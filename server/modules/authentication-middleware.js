const pool = require('./pool');

const rejectUnauthenticated = (req, res, next) => {
    // check if logged in
    if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
        next();
    } else {
    // failure best handled on the server. do redirect here.
        res.status(403).send({
            message: 'User is not authorized to access this data.',
        });
    }
};

const authPresenter = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(403).send({
            message: 'User is not logged in',
        });
        return;
    }

    if (req.user.type !== 'presenter') {
        res.status(403).send({
            message: `This endpoint is not available to ${req.user.type} users`,
        });
        return;
    }

    next();
};

const authParticipant = async (req, res, next) => {
    // Check that they're logged in
    if (!req.isAuthenticated()) {
        res.status(403).send({
            message: 'Participant is not logged in',
        });
        return;
    }

    // Make sure their session is active, and they haven't been kicked
    const { rows: [participant] } = await pool.query(`
        SELECT 
            participant.*,
            to_json(session) as session
        FROM participant
        JOIN session ON session.id = participant."sessionId"
        WHERE participant.id = $1;
    `, [req.user.id]);

    if (!participant) {
        res.status(403).send({
            message: 'Participant is not logged in',
        });
        return;
    }
    // Check if participant is kicked
    if (participant.exitedAt) {
        res.status(403).send({
            message: 'Participant has been removed from this session',
        });
        return;
    }

    // Check if session has ended
    if (participant.session.endedAt) {
        res.status(403).send({
            message: 'Session has ended',
        });
        return;
    }

    next();
};

module.exports = {
    rejectUnauthenticated,
    authParticipant,
    authPresenter,
};
