import React from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, makeStyles } from '@material-ui/core';
import './LandingPage.css';
import touchScreen from '../../images/swipe.jpg';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

const useStyles = makeStyles({
    logo: {
        display: 'inline-block',
        position: 'relative',
        paddingTop: 30,
        marginLeft: -20,

        '& img': {
            width: '80%',
            transform: 'rotate(-10deg)',
        },

        '& div': {
            fontFamily: 'Marker Felt',
            fontSize: 70,
            color: '#3c3c3c',
            position: 'absolute',
            right: -3,
            top: 35,
            textShadow: '4px 3px 2px #c4c2b9',
            transform: 'rotate(-5deg)',
        },
    },
});

function LandingPage() {
    const history = useHistory();
    const classes = useStyles();

    const onLogin = (event) => {
        history.push('/login');
    };

    return (
        <div className="container">

            <Grid container style={{ paddingTop: 40 }} spacing={8}>
                {/* Logo */}
                <Grid item xs={5}>
                    <div className={classes.logo}>
                        <img
                            alt="LivePoll logo"
                            src={touchScreen}
                        />
                        <div>LivePoll</div>
                    </div>
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
                </Grid>
            </Grid>

        </div>
    );
}

export default LandingPage;
