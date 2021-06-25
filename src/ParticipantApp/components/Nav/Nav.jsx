import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../../../PresenterApp/components/Logo/Logo';
import '../../../PresenterApp/components/Nav/Nav.css';

function Nav() {
    const [isMenuOpen, setMenuOpen] = useState(false);

    return (
        <div
            className="nav"
            style={{
                padding: '10px 0',
            }}
        >
            <div style={{ textAlign: 'center', width: '100%', marginLeft: 30 }}>
                <Link to="/" style={{ opacity: 0.9 }}>
                    <Logo
                        showText={false}
                        style={{
                            display: 'inline-block',
                            width: 80,
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
                            fontSize: 26,
                            padding: 0,
                            transform: 'rotate(-4deg)',
                            position: 'relative',
                            top: 5,
                            left: -1,
                        }}
                    >
                        LivePoll
                    </h2>
                </Link>
            </div>

            <MenuIcon
                style={{
                    color: '#4e534d',
                    fontSize: 40,
                    margin: '0 20px',
                    cursor: 'pointer',
                }}
                onClick={(e) => setMenuOpen(!isMenuOpen)}
            />

            <Drawer
                anchor="top"
                open={isMenuOpen}
                onClose={() => setMenuOpen(false)}
                style={{
                }}
                /* PaperProps={{
                    style: { marginTop: 70 },
                }} */
            >
                <button>How it works</button>
                <button>Create a Session</button>
            </Drawer>
        </div>
    );
}

export default Nav;
