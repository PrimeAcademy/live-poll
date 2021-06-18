// @ts-nocheck
import { useState } from 'react';
import { useSelector } from 'react-redux';

function ParticipantLogin() {
    const [joinCode, setJoinCode] = useState('');

    const errors = useSelector((s) => s.errors);
    console.log({ errors });

    const onSubmit = () => {
        console.log('sub');
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
