import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* fetchScores(action) {
    const { data: scores } = yield axios.get(`/api/scores/${action.payload.sessionId}`);

    yield put({
        type: 'SET_SCORES',
        payload: scores,
    });
}

function* scoresSaga() {
    yield takeLatest('FETCH_SCORES', fetchScores);
}

export default scoresSaga;
