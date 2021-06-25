const passport = require('passport');
const pool = require('../modules/pool');

passport.serializeUser((user, done) => {
    // this user value comes from our strategy
    // Our done() value is passed to deserializeUser
    done(null, {
        // Internets say we should only serialize fields used to id the user.
        // as other data could change between requests
        // (eg. user changes their name)
        // https://stackoverflow.com/a/27637668/830030
        id: user.id,
        type: user.type,
    });
});

passport.deserializeUser(async ({ id, type }, done) => {
    try {
        let user;
        if (type === 'presenter') {
            user = await fetchPresenter(id);
        } else if (type === 'participant') {
            user = await fetchParticipant(id);
        } else {
            throw new Error(`Invalid user type "${type}"`);
        }

        // Remove socket.io session object
        if (user.socket) {
            delete user.socket;
        }

        done(null, user);
    } catch (err) {
        console.error('deserializeUser error', err);
        done(err, null);
    }
});

async function fetchPresenter(id) {
    const { rows: users } = await pool.query(`
        SELECT * FROM "user" WHERE id = $1
    `, [id]);

    return users.length ? users[0] : null;
}

async function fetchParticipant(id) {
    const { rows: users } = await pool.query(`
        SELECT 
            participant.*,
            to_json("session") as "session"
        FROM participant
        JOIN "session" ON "session".id = participant."sessionId"
        WHERE participant.id = $1;
    `, [id]);

    return users.length ? users[0] : null;
}
