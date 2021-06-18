import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import store from './PresenterApp/redux/store';
import App from './PresenterApp/components/App/App';
import theme from './PresenterApp/Theme';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('react-root'),
);
