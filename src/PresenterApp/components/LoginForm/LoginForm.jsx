import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    TextField,
    Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Link } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector((store) => store.errors);
    const dispatch = useDispatch();

    const login = (event) => {
        event.preventDefault();

        if (username && password) {
            dispatch({
                type: 'LOGIN',
                payload: {
                    username,
                    password,
                },
            });
        } else {
            dispatch({ type: 'LOGIN_INPUT_ERROR' });
        }
    }; // end login

    return (
        <>
            <form onSubmit={login}>
                <h2>Login</h2>
                {errors.loginMessage && (
                    <Alert
                        severity="error"
                        style={{
                            marginBottom: 20,
                        }}
                    >
                        {errors.loginMessage}
                    </Alert>
                )}

                <div>
                    <TextField
                        label="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        style={{
                            marginBottom: 15,
                            width: 300,
                        }}
                    />
                </div>

                <div>
                    <TextField
                        label="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        style={{
                            marginBottom: 15,
                            width: 300,
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Login
                </Button>
            </form>

            <div style={{ marginTop: 20 }}>
                Or,&nbsp;
                <Link
                    to="/registration"
                    style={{
                        textDecoration: 'none',
                    }}
                >
                    Register for an account
                </Link>
            </div>
        </>
    );
}

export default LoginForm;
