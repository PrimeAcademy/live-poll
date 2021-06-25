import React from 'react';
import { Grid } from '@material-ui/core';
import LoginForm from '../LoginForm/LoginForm';
import Logo from '../Logo/Logo';

// https://coolors.co/ffcab1-69a2b0-659157-a1c084-e05263

function LoginPage() {
    return (
        <div className="container">

            <Grid container style={{ paddingTop: 60 }} spacing={8}>
                {/* Logo */}
                <Grid
                    item
                    xs={5}
                    style={{
                        position: 'relative',
                        left: -30,
                        paddingTop: 30,
                    }}
                >
                    <Logo />
                </Grid>

                <Grid item xs={6}>
                    <LoginForm />
                </Grid>
            </Grid>

        </div>
    );
}

export default LoginPage;
