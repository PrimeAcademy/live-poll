const passport = require('passport');
const socketIo = require('socket.io');
const sessionMiddleware = require('./modules/session-middleware');
const pool = require('./modules/pool');

// See https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.js
module.exports = (server) => {
    const io = socketIo(server);

    // convert a connect middleware to a Socket.IO middleware
    const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

    io.use(wrap(sessionMiddleware));
    io.use(wrap(passport.initialize()));
    io.use(wrap(passport.session()));

    // Kick unauthorized users
    io.use((socket, next) => {
        if (socket.request.user) {
            next();
        } else {
            next(new Error('unauthorized'));
        }
    });

    io.on('connect', async (socket) => {
        const { user } = socket.request;
        if (user.type === 'presenter') {
            // Join presenter rooms
            const { rows: sessions } = await pool.query(`
                SELECT session.id
                FROM session
                JOIN "user"
                    ON "user".id = "session"."presenterId"
                WHERE "session"."presenterId" = $1
            `, [
                user.id,
            ]);

            // TODO: I don't think this works with newly created room:
            // we're already connected to socket.io, this code doesn't run
            for (const sesh of sessions) {
                console.log(`${user.displayName} joining session ${sesh.id}`);
                socket.join(sesh.id);
            }
        }

        // Let the presenter now a participant has joined
        console.log('connected', user.displayName);
        console.log('connection count', io.engine.clientsCount);
        if (user.type === 'participant') {
            console.log('emit participantJoined for sesh', user.sessionId, user.displayName);
            socket.to(user.sessionId).emit('participantJoined', user);
        }

        // Receive scores from participants
        socket.on('sendScore', async (value) => {
            const score = {
                value,
                // add participantId to score
                participantId: user.id,
                createdAt: new Date(),
            };

            // Send the score to the presenter
            socket.to(user.sessionId).emit('newScore', score);

            // Save score to the database
            await pool.query(`
                INSERT INTO "score"
                    ("participantId", "value", "createdAt")
                VALUES ($1, $2, $3);
            `, [
                score.participantId,
                score.value,
                score.createdAt,
            ]);
        });

        socket.on('disconnect', () => {
            console.log('disconnect', user.displayName);
            console.log('connection count', io.engine.clientsCount);
        });
    });

    return io;
};
