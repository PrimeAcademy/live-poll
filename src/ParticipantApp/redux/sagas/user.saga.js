import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

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

        // now that the session has given us a user object
        // with an id and username set the client-side user object to let
        // the client-side code know the user is logged in
        yield put({
            type: 'SET_USER',
            payload: response.data,
        });
    } catch (error) {
        console.log('User get request failed', error);
    }
}

function* kickedUser() {
    try {
        yield put({ type: 'LOGOUT' });
        yield put({
            type: 'SET_GLOBAL_ERROR',
            payload: new Error('You have been removed from the session by the presenter'),
        });
    } catch (err) {
        console.error('kick user failed', err);
    }
}

function* sessionEnded() {
    try {
        yield put({ type: 'LOGOUT' });
        yield put({
            type: 'SET_GLOBAL_ERROR',
            payload: new Error('The session has ended.'),
        });
    } catch (err) {
        console.error('session ended failed', err);
    }
}

function* userSaga() {
    yield takeLatest('FETCH_USER', fetchUser);
    yield takeLatest('KICKED_USER', kickedUser);
    yield takeLatest('SESSION_ENDED', sessionEnded);
}

export default userSaga;
