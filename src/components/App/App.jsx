import React, { useEffect } from 'react';
import {
    HashRouter as Router,
    Route,
    Redirect,
    Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import InfoPage from '../InfoPage/InfoPage';
import LandingPage from '../LandingPage/LandingPage';
import LoginPage from '../LoginPage/LoginPage';
import RegisterPage from '../RegisterPage/RegisterPage';

import './colors.css';
import './App.css';
import SessionList from '../SessionList/SessionList';
import CreateSession from '../CreateSession/CreateSession';
import SessionDetails from '../SessionDetails/SessionDetails';

function App() {
    const dispatch = useDispatch();

    const globalError = useSelector((store) => store.errors.globalError);
    const toast = useSelector((store) => store.toast);

    useEffect(() => {
        dispatch({ type: 'FETCH_USER' });
    }, [dispatch]);

    return (
        <Router>
            <div>
                <Nav />
                <Switch>
                    {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
                    <Redirect exact from="/" to="/home" />

                    {/* Visiting localhost:3000/about will show the about page. */}
                    <Route
                        // shows AboutPage at all times (logged in or not)
                        exact
                        path="/about"
                    >
                        <AboutPage />
                    </Route>

                    {/*
                    For protected routes, the view could show one of several things on the
                    same route.
                    Visiting localhost:3000/user will show the UserPage if the user is logged in.
                    If the user is not logged in, the ProtectedRoute will show the
                    LoginPage (component).
                    Even though it seems like they are different pages,
                    the user is always on localhost:3000/user */}
                    <ProtectedRoute
                        // logged in shows UserPage else shows LoginPage
                        exact
                        path="/user"
                    >
                        <UserPage />
                    </ProtectedRoute>

                    <ProtectedRoute
                        // logged in shows InfoPage else shows LoginPage
                        exact
                        path="/info"
                    >
                        <InfoPage />
                    </ProtectedRoute>

                    {/* When a value is supplied for the authRedirect prop the user will
            be redirected to the path supplied when logged in, otherwise they will
            be taken to the component and path supplied. */}
                    <ProtectedRoute
                        // with authRedirect:
                        // - if logged in, redirects to "/sessions"
                        // - else shows LoginPage at /login
                        exact
                        path="/login"
                        authRedirect="/sessions"
                    >
                        <LoginPage />
                    </ProtectedRoute>

                    <ProtectedRoute
                        // with authRedirect:
                        // - if logged in, redirects to "/sessions"
                        // - else shows RegisterPage at "/registration"
                        exact
                        path="/registration"
                        authRedirect="/sessions"
                    >
                        <RegisterPage />
                    </ProtectedRoute>

                    <ProtectedRoute
                        // with authRedirect:
                        // - if logged in, redirects to "/sessions"
                        // - else shows LandingPage at "/home"
                        exact
                        path="/home"
                        authRedirect="/sessions"
                    >
                        <LandingPage />
                    </ProtectedRoute>

                    {/* Session List */}
                    <ProtectedRoute
                        path="/sessions"
                        exact
                    >
                        <SessionList />
                    </ProtectedRoute>

                    {/* Create Session */}
                    <ProtectedRoute
                        path="/sessions/new"
                        exact
                    >
                        <CreateSession />
                    </ProtectedRoute>

                    {/* Session Details */}
                    <ProtectedRoute
                        path="/sessions/:id"
                        exact
                    >
                        <SessionDetails />
                    </ProtectedRoute>

                    {/* Edit Session */}
                    <ProtectedRoute
                        path="/sessions/:id/edit"
                        exact
                    >
                        <SessionDetails />
                    </ProtectedRoute>

                    {/* If none of the other routes matched, we will show a 404. */}
                    <Route>
                        <h1>404</h1>
                    </Route>

                </Switch>
                <Footer />

                <Snackbar
                    open={toast}
                    autoHideDuration={1500}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    onClose={() => dispatch({ type: 'CLEAR_TOAST' })}
                >
                    <Alert
                        onClose={() => dispatch({ type: 'CLEAR_GLOBAL_ERROR' })}
                        severity="info"
                    >
                        {toast}
                    </Alert>
                </Snackbar>

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
            </div>
        </Router>
    );
}

export default App;
