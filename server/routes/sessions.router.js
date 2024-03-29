const router = require('express').Router();
const pool = require('../modules/pool');
const { authPresenter } = require('../modules/authentication-middleware');
const { io } = require('../io');

router.get('/', authPresenter, async (req, res) => {
    const sql = `
        SELECT 
            session.*, 
            to_json("user") as "presenter",
            array_agg(to_json("participant")) as "participants"
        FROM session
        JOIN "user"
            ON "user".id = "session"."presenterId"
        LEFT JOIN (
            -- grab all scores for each participant
            SELECT 
                participant.*,
                array_agg(to_json(score) ORDER BY "createdAt" ASC) as "scores"
            FROM "participant"
            LEFT JOIN "score" ON "score"."participantId" = participant.id
            GROUP BY "participant".id
        ) as "participant"
            ON "participant"."sessionId" = "session".id
        WHERE "session"."presenterId" = $1
        GROUP BY "session"."id", "user".id
        ORDER BY "createdAt" DESC
        LIMIT 20
    `;

    const { rows } = await pool.query(sql, [req.user.id]);

    // postgress returns [null] if there are no particpants
    const sessions = rows.map(serializeSession);

    res.send(sessions);
});

router.get('/:id', authPresenter, async (req, res) => {
    const sql = `
        SELECT 
            session.*,
            to_json("user") as "presenter",
            array_agg(to_json("participant")) as "participants"
        FROM session
        JOIN "user"
            ON "user".id = "session"."presenterId"
        LEFT JOIN (
            SELECT 
                participant.*,
                array_agg(to_json(score) ORDER BY "createdAt" ASC) as "scores"
            FROM "participant"
            LEFT JOIN "score" ON "score"."participantId" = participant.id
            GROUP BY "participant".id
        ) as "participant"
            ON "participant"."sessionId" = "session".id
        WHERE "session"."presenterId" = $1
        AND "session".id = $2
        GROUP BY "session"."id", "user".id
    `;

    const { rows } = await pool.query(sql, [
        req.user.id,
        req.params.id,
    ]);

    if (!rows.length) {
        res.status(404).send({
            message: `No session with id=${req.params.id} exists`,
        });
        return;
    }

    const session = serializeSession(rows[0]);

    res.send(session);
});

router.post('/', authPresenter, async (req, res) => {
    const sql = `
      INSERT INTO session
        ("presenterId", "name", "joinCode", "createdAt")
      VALUES
        ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING *
    `;

    // Generate a join code
    // https://stackoverflow.com/a/12502559/830030
    const joinCode = Math.random().toString(36).slice(2, 8).toUpperCase();

    const name = 'name' in req.body
        ? req.body.name
        : 'Untitled Session';

    const { rows } = await pool.query(sql, [
        req.user.id,
        name,
        joinCode,
    ]);

    res.status(201).send(rows[0]);
});

router.put('/:id', authPresenter, async (req, res) => {
    if (!('name' in req.body)) {
        res.status(400).send({
            message: 'Missing required "name" attribute in request body',
        });
        return;
    }

    const sql = `
        UPDATE "session"
        SET "name" = $1
        WHERE id = $2
        AND "presenterId" = $3
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [
        req.body.name,
        req.params.id,
        req.user.id,
    ]);

    if (rows.length !== 1) {
        res.status(404).send({
            message: `No session exists with id "${req.params.id}"`,
        });
        return;
    }

    res.send(rows[0]);
});

// End session
router.put('/:id/end', authPresenter, async (req, res) => {
    const sessionId = req.params.id;
    const { rows: sessions } = await pool.query(`
        UPDATE session
        SET "endedAt" = CURRENT_TIMESTAMP
        WHERE session.id = $1 
        AND session."presenterId" = $2
        AND session."endedAt" IS NULL
        RETURNING *
    `, [sessionId, req.user.id]);

    if (!sessions.length) {
        res.status(404).send({
            message: `No active session exists with id ${sessionId}`,
        });
        return;
    }

    const session = sessions[0];

    // Remove all participants
    const { rows: participants } = await pool.query(`
        UPDATE participant
        SET "exitedAt" = CURRENT_TIMESTAMP
        WHERE participant."sessionId" = $1
        RETURNING id
    `, [sessionId]);

    // Notify participants
    for (const p of participants) {
        io.to(`participant/${p.id}`).emit('sessionEnded', session);
    }

    res.send(200);
});

router.delete('/:id', authPresenter, async (req, res) => {
    const sql = `
        DELETE FROM "session"
        WHERE id=$1
        AND "presenterId" = $2
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [req.params.id, req.user.id]);

    if (rows.length !== 1) {
        res.status(404).send({
            message: `No session exists with id "${req.params.id}"`,
        });
        return;
    }

    res.sendStatus(204);
});

/*
Remove ("kick") a participant from the session
*/
router.delete('/:sessionId/participants/:participantId', authPresenter, async (req, res) => {
    const { participantId, sessionId } = req.params;
    // Make sure the participant is in this session
    const { rows: matchingParticipants } = await pool.query(`
        SELECT participant.*, to_json(session)
        FROM participant
        JOIN session ON session.id = participant."sessionId"
        WHERE participant.id = $1
        AND session.id = $2
        AND session."presenterId" = $3
    `, [participantId, sessionId, req.user.id]);

    // Check for 404
    if (!matchingParticipants.length) {
        res.status(404).send({
            message: `Participant ${participantId} does not exist in session ${sessionId}`,
        });
        return;
    }
    const participant = matchingParticipants[0];

    // Check if already exited
    if (participant.exitedAt !== null) {
        res.status(409).send({
            message: `Participant ${participantId} has already exited this session`,
        });
        return;
    }

    // This is a "soft delete", b/c we don't want
    // to lose this participants feedback.
    // Mark them as "exited"
    await pool.query(`
        UPDATE participant
        SET "exitedAt" = CURRENT_TIMESTAMP
        WHERE participant.id = $1
        RETURNING id
    `, [req.params.participantId]);

    // Let the participant know that the user has been removed
    io.to(`participant/${participantId}`).emit('kickParticipant', participant);

    res.send(204);
});

function serializeSession(session) {
    return {
        ...session,
        participants: session.participants
            .filter(Boolean)
            .map((p) => ({
                ...p,
                joinedAt: new Date(p.joinedAt),
                exitedAt: p.exitedAt && new Date(p.exitedAt),
                scores: p.scores
                    .filter(Boolean)
                    .map((s) => ({
                        ...s,
                        // For some reason,
                        // pg does not cast this
                        createdAt: new Date(s.createdAt),
                    })),
            })),
    };
}

module.exports = router;
