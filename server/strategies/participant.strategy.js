const passport = require('passport');
const { Strategy: CustomStrategy } = require('passport-custom');
const pool = require('../modules/pool');

passport.use('participant', new CustomStrategy(
    async (req, done) => {
        try {
            // Find a session matching the joinCode
            const { rows: sessionRows } = await pool.query(`
                SELECT * FROM "session"
                WHERE "joinCode" = $1;
            `, [
                req.body.joinCode.toUpperCase(),
            ]);

            const session = sessionRows[0];

            // No matching joinCode, 401
            if (!session) {
                done(null, null);
                return;
            }

            // joinCode is correct, now we actually create a user
            const { rows: participantRows } = await pool.query(`
                INSERT INTO "participant"
                    ("sessionId", "displayName", "joinedAt")
                VALUES ($1, $2, CURRENT_TIMESTAMP)
                RETURNING *
            `, [
                session.id,
                'Purple Penguin', // TODO generate name
            ]);

            const participant = {
                ...participantRows[0],
                type: 'participant',
            };

            // Value from done() goes to serializeUser
            done(null, participant);
        } catch (err) {
            console.error('participant strategy error', err);
            done(err, null);
        }
    },
));
