import { all } from 'redux-saga/effects';
import loginSaga from './login.saga';
import registrationSaga from './registration.saga';
import userSaga from './user.saga';
import sessionSaga from './sessions.saga';
import scoresSaga from './scores.saga';

// rootSaga is the primary psaga.
// It bundles up all of the other sagas so our project can use them.
// This is imported in index.js as rootSaga

// some sagas trigger other sagas, as an example
// the registration triggers a login
// and login triggers setting the user
export default function* rootSaga() {
    yield all([
        loginSaga(), // login saga is now registered
        registrationSaga(),
        userSaga(),
        sessionSaga(),
        scoresSaga(),
    ]);
}
