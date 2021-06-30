const router = require('express').Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, async (req, res) => {
    const sql = `
        SELECT 
            session.*, 
            to_json("user") as "presenter",
            array_agg(to_json("participant")) as "participants"
        FROM session
        JOIN "user"
            ON "user".id = "session"."presenterId"
        LEFT JOIN "participant"
            ON "participant"."sessionId" = "session".id
        WHERE "session"."presenterId" = $1
        GROUP BY "session"."id", "user".id
        ORDER BY "createdAt" DESC
        LIMIT 20
    `;

    const { rows } = await pool.query(sql, [req.user.id]);

    res.send(rows);
});

router.get('/:id', rejectUnauthenticated, async (req, res) => {
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
            JOIN "score" ON "score"."participantId" = participant.id
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

    const session = rows[0];

    // postgress returns [null] if there are no particpants
    session.participants = session.participants.filter(Boolean);

    res.send(rows[0]);
});

router.post('/', rejectUnauthenticated, async (req, res) => {
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

router.put('/:id', async (req, res) => {
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
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [
        req.body.name,
        req.params.id,
    ]);

    if (rows.length !== 1) {
        res.status(404).send({
            message: `No session exists with id "${req.params.id}"`,
        });
        return;
    }

    res.send(rows[0]);
});

router.delete('/:id', async (req, res) => {
    const sql = `
        DELETE FROM "session"
        WHERE id=$1
        RETURNING *
    `;
    const { rows } = await pool.query(sql, [req.params.id]);

    if (rows.length !== 1) {
        res.status(404).send({
            message: `No session exists with id "${req.params.id}"`,
        });
        return;
    }

    res.sendStatus(204);
});

module.exports = router;
