// @ts-nocheck
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';

function ParticipantLogin() {
    const dispatch = useDispatch();
    const [joinCode, setJoinCode] = useState('');

    const user = useSelector((store) => store.user);
    // todo: redirect if user
    if (user && user.id) {
        return (
            <Redirect to="/" />
        );
    }

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
            <h2>Join Session</h2>

            <form onSubmit={onSubmit}>
                Session Code (?)
                {/* TODO: need a "what's a session code, where do I get one thing" */}
                <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                />
                <input type="submit" value="Join Now!" />
            </form>
        </>
    );
}

export default ParticipantLogin;
