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

function* fetchSessionDetails(action) {
    try {
        console.log(action);
        const { data } = yield axios.get(`/api/sessions/${action.payload}`);

        // Convert score timestamps to dates
        for (const part of data.participants) {
            for (const score of part.scores) {
                score.createdAt = new Date(score.createdAt);
            }
        }

        yield put({
            type: 'SET_SESSION_DETAILS',
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

        yield put({
            type: 'FETCH_SESSION_DETAILS',
            payload: data.id,
        });

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

function* updateSession(action) {
    try {
        // Immediately update local state with new value
        yield put({
            type: 'SET_SESSION_DETAILS',
            payload: action.payload,
        });

        // Persist changes to server
        yield axios.put(`/api/sessions/${action.payload.id}`, action.payload);
    } catch (err) {
        console.error(err);
        yield put({
            type: 'SET_GLOBAL_ERROR',
            payload: err,
        });
    }
}
function* deleteSession(action) {
    try {
        yield put({
            type: 'REMOVE_SESSION',
            payload: action.payload,
        });

        yield axios.delete(`/api/sessions/${action.payload}`);
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
    yield takeLatest('FETCH_SESSION_DETAILS', fetchSessionDetails);
    yield takeLatest('CREATE_SESSION', createSession);
    yield takeLatest('UPDATE_SESSION', updateSession);
    yield takeLatest('DELETE_SESSION', deleteSession);
}

export default sessionSaga;
