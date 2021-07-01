const http = require('http');
const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
require('dotenv').config();

const passport = require('passport');

const { http: server, express: app } = require('./httpServer');

const sessionMiddleware = require('./modules/session-middleware');
require('./strategies/serialize');
require('./strategies/presenter.strategy');
require('./strategies/participant.strategy');

// Route includes
const userRouter = require('./routes/user.router');
const sessionsRouter = require('./routes/sessions.router');
const scoresRouter = require('./routes/scores.router');

const participantRouter = require('./routes/participant.router');

// Setup socket.io
require('./io').setup();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/scores', scoresRouter);

app.use('/api/participants', participantRouter);

// Serve static files
app.use(express.static('build'));

// Error handler
app.use((err, req, res, next) => {
    console.error('Uncaught API Error:', err);

    res.status(500).send({
        message: `Internal Server Error: ${err.message}`,
    });
});

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
