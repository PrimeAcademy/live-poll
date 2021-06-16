const router = require('express').Router();
const pool = require('../modules/pool');

router.get('/', async (req, res) => {
    const sql = `
      SELECT * FROM session
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;

    const { rows } = await pool.query(sql);

    res.send(rows);
});

module.exports = router;
