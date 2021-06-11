import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import store from './redux/store';
import App from './components/App/App';
import theme from './Theme';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('react-root'),
);
