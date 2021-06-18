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
        // Select which table to lookup our user in
        const userTable = {
            presenter: 'user',
            participant: 'participant',
        }[type];

        if (!userTable) {
            throw new Error(`Invalid user type: ${type}`);
        }

        // Lookup user by id
        const { rows: users } = await pool.query(`
            SELECT * FROM "${userTable}" WHERE id = $1
        `, [id]);

        const user = users.length ? users[0] : null;
        done(null, user);
    } catch (err) {
        console.error('deserializeUser error', err);
        done(err, null);
    }
});
