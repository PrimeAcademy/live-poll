const express = require('express');
const { authPresenter } = require('../modules/authentication-middleware');
const pool = require('../modules/pool');

const router = express.Router();

router.get('/:sessionId', authPresenter, async (req, res) => {
    // TODO, only presenters allowed to see other sessions

    const { rows: scores } = await pool.query(`
        SELECT 
            score.*
        FROM score
        JOIN participant 
            ON participant.id = score."participantId"
        JOIN session
            ON session.id = participant."sessionId"
        WHERE participant.id = $1
    `, [
        req.user.id,
    ]);

    res.send(scores);
});

module.exports = router;
