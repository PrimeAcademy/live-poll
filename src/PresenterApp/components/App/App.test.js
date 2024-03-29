import {
    render, screen,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom/extend-expect';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import App from './App';
import store from '../../redux/store';

// GET /api/user
const user = {
    id: 1,
    username: 'Testy McTesterson',
};
const isUserLoggedIn = true;
const server = setupServer(
    rest.get('/api/user', (req, res, ctx) => {
        if (!isUserLoggedIn) {
            ctx.status(401);
            return res();
        }
        return res(ctx.json(user));
    }),
);

// Server setup / cleanup
// See for example:
//  https://testing-library.com/docs/react-testing-library/example-intro
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should render', async () => {
    // Render our app
    render(
    /* It needs a redux store!! */
        <Provider store={store}>
            <App />
        </Provider>,
    );
});

test('should render welcome view, if not logged in', async () => {
    // Render our app
    render(
        <Provider store={store}>
            <App />
        </Provider>,
    );

    // Check for copyright
    expect(screen.getByText('© Edan Schwartz')).toBeVisible();

    // Check for landing page text
    expect(screen.getByText('And how will you know, if no one tells you?')).toBeVisible();
});
