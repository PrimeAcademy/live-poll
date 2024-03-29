import React from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import Logo from '../Logo/Logo';
import ButtonLink from '../Util/ButtonLink';

// https://coolors.co/ffcab1-69a2b0-659157-a1c084-e05263

function LandingPage() {
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
                    <h1>
                        How
                        <em> are</em>
                        {' '}
                        you doing?
                    </h1>

                    <p>
                        And how will you know, if no one tells you?
                    </p>

                    <p>
                        The best way to grow as a professional is with direct, honest, and timely
                        feedback. LivePoll gives you instant feedback from your students, coworkers,
                        or audience members.
                    </p>

                    <p style={{
                        textAlign: 'right',
                        paddingTop: 40,
                    }}
                    >
                        <ButtonLink
                            to="/registration"
                            style={{
                                fontSize: 22,
                            }}
                        >
                            Start LivePolling
                        </ButtonLink>
                        <div style={{ paddingTop: 12 }}>
                            or
                            {' '}
                            <Link to="/login">login</Link>
                            {' '}
                            to an existing account
                        </div>
                    </p>
                </Grid>
            </Grid>

        </div>
    );
}

export default LandingPage;
