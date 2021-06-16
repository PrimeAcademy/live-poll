const router = require('express').Router();
const pool = require('../modules/pool');
const { rejectUnauthenticated } = require('../modules/authentication-middleware');

router.get('/', rejectUnauthenticated, async (req, res) => {
    const sql = `
      SELECT session.* FROM session
      JOIN "user"
        ON "user".id = "session"."presenterId"
      WHERE "user".id = $1
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;

    const { rows } = await pool.query(sql, [req.user.id]);

    res.send(rows);
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
    const joinCode = Math.random().toString(36).slice(2, 10).toUpperCase();

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

module.exports = router;
