import { put, takeLatest } from 'redux-saga/effects';

function* sendScore(action) {
    // Save score to local state
    yield put({
        type: 'ADD_SCORE',
        payload: {
            createdAt: new Date(),
            value: action.payload,
        },
    });
}

function* scoresSaga() {
    yield takeLatest('SEND_SCORE', sendScore);
}

export default scoresSaga;
