import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchSessionList() {
    try {
        const { data } = yield axios.get('/api/sessions');

        yield put({
            type: 'PUT_SESSION_LIST',
            payload: data,
        });
    } catch (err) {
        yield put({
            type: 'SET_GLOBAL_ERROR',
            payload: err,
        });
    }
}

function* sessionSaga() {
    yield takeLatest('FETCH_SESSION_LIST', fetchSessionList);
}

export default sessionSaga;
