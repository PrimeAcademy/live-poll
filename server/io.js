const passport = require('passport');
const socketIo = require('socket.io');
const sessionMiddleware = require('./modules/session-middleware');
const pool = require('./modules/pool');
const { http: server } = require('./httpServer');

// See https://github.com/socketio/socket.io/blob/master/examples/passport-example/index.js
const io = socketIo(server);

// convert a connect middleware to a Socket.IO middleware
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

const setup = () => {
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

        // Join room called `presenter/:id` or `participant/:id`
        const userRoom = `${user.type}/${user.id}`;
        console.log(`User ${user.id} (${user.displayName}) joining room ${userRoom}`);
        socket.join(userRoom);

        // Let the presenter now a participant has joined
        console.log('connected', user.displayName, 'connection count', io.engine.clientsCount);
        if (user.type === 'participant') {
            // Tell the presenter that the participant has joined this room
            const { rows: [session] } = await pool.query(`
                SELECT *
                FROM session
                WHERE session.id = $1
            `, [user.sessionId]);
            if (!session) {
                throw new Error(`Unable to find session ${user.sessionId} for participant ${user.id}`);
            }

            const presenterRoom = `presenter/${session.presenterId}`;
            console.log(`emitting "participantJoined" to ${presenterRoom}`);
            socket.to(presenterRoom).emit('participantJoined', user);

            // Receive scores from participants
            socket.on('sendScore', async (value) => {
                const score = {
                    value,
                    // add participantId to score
                    participantId: user.id,
                    createdAt: new Date(),
                };

                // Send the score to the presenter
                socket.to(presenterRoom).emit('newScore', score);

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
        }

        socket.on('disconnect', () => {
            console.log('disconnect', user.displayName, 'connection count', io.engine.clientsCount);
            socket.leave(userRoom);
        });
    });
};

module.exports = {
    io,
    setup,
};
