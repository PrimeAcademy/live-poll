import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

import presenterStore from './PresenterApp/redux/store';
import PresenterApp from './PresenterApp/components/App/App';
import PresenterTheme from './PresenterApp/Theme';

import ParticipantApp from './ParticipantApp/components/App/App';

// Choose to run presenter vs. participant app
// based on the subdomain
const isPresenterSubdomain = window.location.host.startsWith(`${process.env.REACT_APP_PRESENTER_SUBDOMAIN}.`);
const App = isPresenterSubdomain
    ? (
        <Provider store={presenterStore}>
            <ThemeProvider theme={PresenterTheme}>
                <CssBaseline />
                <PresenterApp />
            </ThemeProvider>
        </Provider>
    )
    : (
        <ParticipantApp />
    );

ReactDOM.render(
    App,
    document.getElementById('react-root'),
);
