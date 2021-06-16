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

module.exports = router;
