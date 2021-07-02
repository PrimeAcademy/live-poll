const { Router } = require('express');
const passport = require('passport');
const { authParticipant } = require('../modules/authentication-middleware');
const { io } = require('../io');
const pool = require('../modules/pool');

const router = Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', authParticipant, (req, res) => {
    // Send back user object from the session (previously queried from the database)
    res.send(req.user);
});

router.post('/login', passport.authenticate('participant'), (req, res) => {
    res.sendStatus(200);
});

// clear all server session information about this user
router.post('/logout', async (req, res) => {
    const userId = req.user.id;

    // Mark participant as exited
    const { rows: [updatedRow] } = await pool.query(`
        UPDATE participant
        SET "exitedAt" = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
    `, [userId]);
    if (!updatedRow) {
        throw new Error(`Failed to mark participant ${userId} as exited`);
    }
    console.log('logged out', updatedRow);

    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);

    // Lookup the presenter, so we can tell them we've left
    try {
        const { rows: [participant] } = await pool.query(`
            SELECT 
                participant.*,
                to_json(session) as session,
                session."presenterId" as "presenterId"
            FROM participant
            JOIN session ON session.id = participant."sessionId"
            WHERE participant.id = $1
        `, [userId]);

        if (!participant || !participant.session.presenterId) {
            console.error(`Failed to location session for participant ${userId} on logout`, participant);
            return;
        }

        // Tell the presenter that we've left
        io.to(`presenter/${participant.session.presenterId}`).emit('participantExited', participant);
    } catch (err) {
        // Don't throw err here, or it will try to send a 500
        console.error('Failed to emit participantExited', err);
    }
});

module.exports = router;
