import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import Logo from '../Logo/Logo';

function Nav() {
    const user = useSelector((store) => store.user);

    const loginLinkData = {
        path: '/login',
        text: 'Login',
    };

    if (user.id != null) {
        loginLinkData.path = '/sessions';
        loginLinkData.text = 'Past Sessions';
    }

    return (
        <div className="nav">
            <Link to="/home" style={{ opacity: 0.9 }}>
                <Logo
                    showText={false}
                    style={{
                        display: 'inline-block',
                        width: 95,
                        paddingLeft: 30,
                    }}
                />
                <h2
                    className="nav-title"
                    style={{
                        display: 'inline-block',
                        fontFamily: 'Marker Felt',
                        verticalAlign: 19,
                        color: '#4d4d4d',
                        textShadow: '1px 1px 4px rgba(255, 255, 255, 0.3)',
                        fontSize: 30,
                        padding: 0,
                        transform: 'rotate(-4deg)',
                        marginLeft: -13,
                    }}
                >
                    LivePoll
                </h2>
            </Link>
            <div style={{
                paddingRight: 30,
            }}
            >
                <Link className="navLink" to={loginLinkData.path}>
                    {loginLinkData.text}
                </Link>

                {user.id && (
                    <LogOutButton className="navLink" />
                )}
            </div>
        </div>
    );
}

export default Nav;
