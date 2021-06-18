import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, HashRouter as Router, Switch } from 'react-router-dom';
import ParticipantLogin from '../ParticipantLogin/ParticipantLogin';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'AFDFDSf' });
    }, [dispatch]);

    return (
        <Router>
            <Switch>
                <Route
                    path="/"
                >
                    <ParticipantLogin />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
