const { Router } = require('express');
const passport = require('passport');
const { authParticipant } = require('../modules/authentication-middleware');

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
router.post('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});

module.exports = router;
