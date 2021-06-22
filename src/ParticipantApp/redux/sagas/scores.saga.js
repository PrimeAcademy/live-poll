import { put, select, takeLatest } from 'redux-saga/effects';

function* sendScore(action) {
    // Save score to local state
    yield put({
        type: 'ADD_SCORE',
        payload: {
            createdAt: new Date(),
            value: action.payload,
        },
    });

    // Grab the socket connection for this user
    const socket = yield select((store) => store.user.socket);

    // Send the score to the server
    socket.emit('sendScore', action.payload);
}

function* scoresSaga() {
    yield takeLatest('SEND_SCORE', sendScore);
}

export default scoresSaga;
