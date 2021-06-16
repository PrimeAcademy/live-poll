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

function* createSession(action) {
    try {
        const { data } = yield axios.post('/api/sessions');

        console.log({ action });

        if (action.payload.onSuccess) {
            action.payload.onSuccess(data);
        }
    } catch (err) {
        console.error(err);
        yield put({
            type: 'SET_GLOBAL_ERROR',
            payload: err,
        });
    }
}

function* sessionSaga() {
    yield takeLatest('FETCH_SESSION_LIST', fetchSessionList);
    yield takeLatest('CREATE_SESSION', createSession);
}

export default sessionSaga;
