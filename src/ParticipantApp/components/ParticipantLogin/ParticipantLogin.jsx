import {
    TextField,
    Button,
} from '@material-ui/core';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import Logo from '../../../PresenterApp/components/Logo/Logo';

function ParticipantLogin() {
    const dispatch = useDispatch();
    const [joinCode, setJoinCode] = useState('');

    const user = useSelector((store) => store.user);

    // Redirect if user is logged in
    if (user && user.id) {
        return (
            <Redirect to="/" />
        );
    }

    // Set menu links
    useEffect(() => {
        dispatch({
            type: 'SET_MENU_LINKS',
            payload: [
                {
                    label: 'How it works',
                    to: '/info',
                },
                {
                    label: 'Create Session',
                    // TODO: link to presenters website
                    to: process.env.REACT_APP_PRESENTER_URL,
                    external: true,
                },
            ],
        });
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch({
            type: 'LOGIN',
            payload: {
                joinCode,
            },
        });
    };

    return (
        <>
            <div style={{
                padding: '10vh 80px',
            }}
            >
                <div style={{ textAlign: 'center' }}>
                    <Logo
                        showText={false}
                        style={{
                            display: 'inline-block',
                            width: 220,
                            marginLeft: -40,
                        }}
                    />
                    <h2
                        className="nav-title"
                        style={{
                            display: 'inline-block',
                            fontFamily: 'Marker Felt',
                            verticalAlign: 124,
                            color: '#4d4d4d',
                            textShadow: '1px 1px 4px rgba(255, 255, 255, 0.3)',
                            fontSize: 42,
                            padding: 0,
                            transform: 'rotate(-8deg)',
                            marginLeft: -90,
                        }}
                    >
                        LivePoll
                    </h2>
                </div>

                <h2 style={{
                    marginTop: 70,
                    marginBottom: 20,
                    fontSize: 24,
                }}
                >
                    Session Code
                </h2>

                <form onSubmit={onSubmit}>
                    {/* TODO: need a "what's a session code, where do I get one thing" */}
                    <TextField
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        variant="outlined"
                        style={{
                            width: '100%',
                        }}
                        inputProps={{
                            style: {
                                padding: '8px 12px',
                            },
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        style={{
                            float: 'right',
                            marginTop: 11,
                        }}
                    >
                        Join!
                    </Button>
                    <div style={{ clear: 'both' }} />
                </form>

            </div>
            <Link
                to="/info"
                style={{
                    color: 'var(--almost-black)',
                    textDecoration: 'none',
                    fontStyle: 'italic',
                    width: '100%',
                    display: 'block',
                    textAlign: 'center',
                }}
            >
                What is LivePoll?
            </Link>
        </>
    );
}

export default ParticipantLogin;
