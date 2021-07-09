import ButtonLink from '../../../PresenterApp/components/Util/ButtonLink';

import Logo from '../../../PresenterApp/components/Logo/Logo';

function Info() {
    return (
        <>
            <div style={{
                padding: '8vh 50px',
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
                    marginTop: 30,
                    marginBottom: 20,
                    fontSize: 24,
                }}
                >
                    How <em>are</em> you doing?
                </h2>

                <p>
                    And how will you know, if no one tells you?
                </p>
                <p>
                    The best way to grow as a professional is with direct,
                    honest, and timely feedback. LivePoll gives you instant
                    feedback from your students, coworkers, or audience members.
                </p>

                <ButtonLink
                    type="submit"
                    variant="contained"
                    color="primary"
                    to={process.env.REACT_APP_PRESENTER_URL}
                    external
                    style={{
                        float: 'right',
                        marginTop: 11,
                        fontSize: 18,
                    }}
                >
                    Start Live Polling!
                </ButtonLink>
                <div style={{ clear: 'both' }} />
            </div>
        </>
    );
}

export default Info;
