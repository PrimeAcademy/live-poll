import React from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
    const history = useHistory();

    const onLogin = (event) => {
        history.push('/login');
    };

    return (
        <div className="container">
            <h2>
                How
                <em>are</em>
                {' '}
                you doing?
            </h2>

            <p>
                And how will you know, if no one tells you?
            </p>

            <p>
                The best way to grow as a professional is with direct, honest, and timely
                feedback. LivePoll gives you instant feedback from your students, coworkers,
                or audience members.
            </p>

            <RegisterForm />

            <center>
                <h4>Already a Member?</h4>
                <button className="btn btn_sizeSm" onClick={onLogin}>
                    Login
                </button>
            </center>
        </div>
    );
}

export default LandingPage;
