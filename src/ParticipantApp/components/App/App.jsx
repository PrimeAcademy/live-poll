import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Route, HashRouter as Router, Switch, Redirect,
} from 'react-router-dom';
import ActiveSession from '../ActiveSession/ActiveSession';
import ParticipantLogin from '../ParticipantLogin/ParticipantLogin';
import Logout from '../Logout/Logout';

function App() {
    const dispatch = useDispatch();
    const user = useSelector((store) => store.user);
    const isLoggedIn = user && user.id;

    useEffect(() => {
        dispatch({ type: 'FETCH_USER' });
    }, [dispatch]);

    return (
        <Router>
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
        </Router>
    );
}

export default App;
