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

    io.on('connect', (socket) => {
        socket.on('whoami', (cb) => {
            cb(socket.request.user ? socket.request.user.username : '');
        });

        // Receive scores from participants
        socket.on('sendScore', async (value) => {
            const participant = socket.request.user;

            const score = {
                value,
                // add participantId to score
                participantId: participant.id,
                createdAt: new Date(),
            };

            // Send the score to the presenter
            socket.to(participant.sessionId).emit('newScore', value);

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
    });

    return io;
};
