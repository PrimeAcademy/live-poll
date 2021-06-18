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
        console.log(`new connection ${socket.id}`);
        socket.on('whoami', (cb) => {
            cb(socket.request.user ? socket.request.user.username : '');
        });

        /// ??? what is this stuff?
        /* const { session } = socket.request;
        console.log(`saving sid ${socket.id} in session ${session.id}`);
        session.socketId = socket.id;
        session.save(); */

        // Receive scores from participants
        socket.on('sendScore', async (value) => {
            const participant = socket.request.user;

            console.log({ score: value, participant });

            const score = {
                value,
                // add participantId to score
                participantId: socket.user.id,
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
