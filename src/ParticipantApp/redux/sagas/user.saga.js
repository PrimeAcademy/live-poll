import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';
import io from 'socket.io-client';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };

        // the config includes credentials which
        // allow the server session to recognize the user
        // If a user is logged in, this will return their information
        // from the server session (req.user)
        const response = yield axios.get('/api/participants', config);

        // Setup socket.io connection
        const socket = io();

        // wait for socket to connect
        const SOCKET_TIMEOUT = 2000;
        yield new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error(
                    `Took more than ${SOCKET_TIMEOUT} to connect to socket.io server`,
                ));
            }, SOCKET_TIMEOUT);

            socket.on('connect', () => {
                clearTimeout(timeout);
                resolve();
            });
        });

        // now that the session has given us a user object
        // with an id and username set the client-side user object to let
        // the client-side code know the user is logged in
        yield put({
            type: 'SET_USER',
            payload: {
                ...response.data,
                socket,
            },
        });
    } catch (error) {
        console.log('User get request failed', error);
    }
}

function* userSaga() {
    yield takeLatest('FETCH_USER', fetchUser);
}

export default userSaga;
