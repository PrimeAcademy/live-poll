import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Route, HashRouter as Router, Switch, Redirect,
} from 'react-router-dom';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import ActiveSession from '../ActiveSession/ActiveSession';
import ParticipantLogin from '../ParticipantLogin/ParticipantLogin';
import Logout from '../Logout/Logout';
import Nav from '../Nav/Nav';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const isLoggedIn = user && user.id;
    const globalError = useSelector((store) => store.errors.globalError);

    useEffect(() => {
        dispatch({ type: 'FETCH_USER' });
    }, [dispatch]);

    return (
        <Router>
            <Nav />
            <Switch>
                {/* <Redirect exact from="/" to="/login" /> */}

                <Route
                    path="/login"
                >
                    {isLoggedIn
                        ? <Redirect to="/" />
                        : <ParticipantLogin />}
                </Route>

                <Route
                    path="/logout"
                >
                    <Logout />
                </Route>

                <Route
                    path="/"
                    exact
                >
                    {isLoggedIn
                        ? <ActiveSession />
                        : <Redirect to="/login" />}
                </Route>
            </Switch>

            <Snackbar
                open={globalError}
                onClose={() => dispatch({ type: 'CLEAR_GLOBAL_ERROR' })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => dispatch({ type: 'CLEAR_GLOBAL_ERROR' })}
                    severity="error"
                >
                    {globalError}
                </Alert>
            </Snackbar>
        </Router>
    );
}

export default App;
