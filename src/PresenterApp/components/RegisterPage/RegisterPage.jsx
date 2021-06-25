import React from 'react';
import { Grid } from '@material-ui/core';
import RegisterForm from '../RegisterForm/RegisterForm';
import Logo from '../Logo/Logo';

function RegisterPage() {
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
                    <RegisterForm />
                </Grid>
            </Grid>

        </div>
    );
}

export default RegisterPage;
