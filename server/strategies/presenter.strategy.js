const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');

// Does actual work of logging in
passport.use(
    'presenter',
    new LocalStrategy((username, password, done) => {
        pool
            .query('SELECT * FROM "user" WHERE username = $1', [username])
            .then((result) => {
                const user = result && result.rows && result.rows[0];
                if (user && encryptLib.comparePassword(password, user.password)) {
                    user.type = 'presenter';

                    // All good! Passwords match!
                    // done takes an error (null in this case) and a user
                    done(null, user);
                } else {
                    // Not good! Username and password do not match.
                    // done takes an error (null in this case) and a user (also null in this case)
                    // this will result in the server returning a 401 status code
                    done(null, null);
                }
            })
            .catch((error) => {
                console.log('Error with query for user ', error);
                // done takes an error (we have one) and a user (null in this case)
                // this will result in the server returning a 500 status code
                done(error, null);
            });
    }),
);
