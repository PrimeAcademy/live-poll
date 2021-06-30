import {
    Container,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableContainer,
    Button,
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import io from 'socket.io-client';

import PersonIcon from '@material-ui/icons/Person';
import { useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useHistory, useParams, useLocation, Link,
} from 'react-router-dom';
import moment from 'moment';
import ButtonLink from '../Util/ButtonLink';
import ScoresChart from '../../../ScoreChart/ScoreChart';
import ParticipantRow from './ParticipantRow';

const useStyles = makeStyles({
    sessionName: {
        display: 'inline-block',
        fontSize: 30,
        lineHeight: 1.35,
        fontWeight: 'bold',
        padding: '5px 12px',
        margin: '-5px 0 0 -13px',
        letterSpacing: 'inherit',

        '&.h2': {
            cursor: 'text',
            maxWidth: 600,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
        },
        '&.h2:hover': {
            background: 'white',
            outline: '1px solid rgba(0,0,0,0.2)',
        },
    },
});

function SessionDetails() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    const session = useSelector((store) => store.sessionDetails);
    const editSession = useSelector((store) => store.editSession);

    // Edit mode uses `/sessions/:id/edit` url
    const location = useLocation();
    const isEditMode = location.pathname.endsWith('/edit');

    // Setup socket.io connection
    useEffect(() => {
        // eslint-disable-next-line no-shadow
        const socket = io();

        // Show error on connect timeout
        const timeoutTimer = setTimeout(() => {
            dispatch({
                type: 'SET_GLOBAL_ERROR',
                payload: new Error('Timeout connecting to socket.io server'),
            });
        }, 2000);
        socket.on('connect', () => clearTimeout(timeoutTimer));

        // Listen for scores
        socket.on('newScore', (score) => {
            score.createdAt = new Date(score.createdAt);

            dispatch({
                type: 'ADD_SCORE',
                payload: score,
            });
        });

        // Listen for joined participants
        socket.on('participantJoined', (participant) => {
            const isAlreadyJoined = session.participants
                .map((p) => p.id)
                .includes(participant.id);
            if (participant.sessionId === session.id && !isAlreadyJoined) {
                dispatch({
                    type: 'ADD_SESSION_PARTICIPANT',
                    payload: {
                        ...participant,
                        scores: [],
                    },
                });
            }
        });

        return () => socket.disconnect();
    }, [session.id]);

    // Select name text in input, on switch to edit mode
    const nameInputRef = createRef();
    useEffect(() => {
        if (nameInputRef.current) {
            console.log(nameInputRef.current);
            nameInputRef.current.select();
        }
    }, [isEditMode]);

    // Fetch session info on load
    useEffect(() => {
        dispatch({
            type: 'FETCH_SESSION_DETAILS',
            payload: params.id,
        });
    }, [params.id]);

    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    const copyJoinCode = (evt) => {
        try {
            navigator.clipboard.writeText(session.joinCode);
        } catch (err) {
            console.error(err);
            dispatch({
                type: 'SET_GLOBAL_ERROR',
                payload: new Error('Failed to copy to clipboard'),
            });
            return;
        }

        dispatch({
            type: 'SET_TOAST',
            payload: 'Copied session code to clipboard',
        });
    };

    const onSubmitName = (evt) => {
        evt.preventDefault();

        dispatch({
            type: 'UPDATE_SESSION',
            payload: editSession,
        });

        // Leave edit mode
        history.push(`/sessions/${session.id}`);
    };

    const deleteSession = () => {
        dispatch({
            type: 'DELETE_SESSION',
            payload: session.id,
        });

        dispatch({
            type: 'SET_TOAST',
            payload: 'Session deleted',
        });

        history.push('/sessions');
    };

    return (
        <Container style={{ maxWidth: 980 }}>
            <Link
                to="/sessions"
                style={{
                    textDecoration: 'none',
                    paddingLeft: 20,
                    fontSize: 14,
                    fontWeight: 'bold',
                    paddingBottom: 10,
                    display: 'block',
                    color: 'var(--almost-black)',
                    marginTop: -15,
                }}
            >
                <ArrowBackIosIcon style={{
                    fontSize: 10,
                    verticalAlign: 0,
                }}
                />
                <span style={{ textDecoration: 'underline' }}>Back</span>
            </Link>
            <div style={{ padding: '0 20px' }}>
                <div style={{ display: 'inline-block' }}>
                    {isEditMode
                        ? (
                            <>
                                <form onSubmit={onSubmitName} style={{ display: 'inline-block' }}>
                                    <input
                                    // eslint-disable-next-line jsx-a11y/no-autofocus
                                        autoFocus
                                        ref={nameInputRef}
                                        type="text"
                                        // todo save edit name state
                                        value={editSession.name}
                                        className={classes.sessionName}
                                        onBlur={onSubmitName}
                                        onChange={(e) => dispatch({
                                            type: 'SET_EDIT_SESSION',
                                            payload: { name: e.target.value },
                                        })}
                                        style={{ width: 600 }}
                                    />
                                    <MoreHorizIcon
                                        style={{
                                            fontSize: 26,
                                            border: '1px solid rgba(0,0,0,0.9)',
                                            borderRadius: 100,
                                            marginLeft: 11,
                                            background: 'white',
                                            padding: 2,
                                            color: '1px solid rgba(0,0,0,0.9)',
                                        }}
                                    />
                                </form>
                            </>
                        )
                        : (
                        /* Session name & edit link */
                            <Link
                                to={`/sessions/${session.id}/edit`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                }}
                            >
                                <h2
                                    className={`${classes.sessionName} h2`}
                                >
                                    {session.name}
                                </h2>
                                <EditOutlinedIcon style={{
                                    fontSize: 22,
                                    marginLeft: 20,
                                    cursor: 'pointer',
                                    verticalAlign: 12,
                                }}
                                />
                            </Link>
                        )}

                    {/* Presented by */}
                    <div style={{ fontStyle: 'italic' }}>
                        Presented by: {session.presenter.displayName}
                        <br />
                        {moment(session.createdAt).format(
                            'MMM D hh:mma',
                        )}
                        {session.endedAt
                            && ` - ${moment(session.endedAt).format(
                                'hh:mma',
                            )}`}
                    </div>
                </div>

                {/* Side area: code + end sesh button */}
                <div style={{ float: 'right' }}>
                    <div
                        style={{
                            fontWeight: 'bold',
                            marginBottom: 10,
                            cursor: 'pointer',
                            lineHeight: '30px', // to line up better w/h2
                        }}
                        onKeyDown={copyJoinCode}
                        onClick={copyJoinCode}
                        role="button"
                        tabIndex="0"
                    >
                        Session Code:
                        {' '}
                        {session.joinCode}
                        <FileCopyOutlinedIcon
                            style={{
                                fontSize: 18,
                                marginLeft: 6,
                                verticalAlign: -3,
                            }}
                        />
                    </div>

                    {/* If the session has already ended
                        don't show end/cancel buttons
                     */}
                    {!!session.endedAt || (
                        session.participants.length
                            ? (
                                // If participants have already joined,
                                // show End Session
                                <ButtonLink
                                    to="/sessions/new"
                                    style={{
                                        fontSize: 14,
                                        padding: '2px 10px',
                                        float: 'right',
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                >
                                    End Session
                                </ButtonLink>
                            )
                            : (
                                // If no participants have joined yet,
                                // we can "cancel" (delete) the session
                                <Button
                                    onClick={deleteSession}
                                    style={{
                                        fontSize: 14,
                                        padding: '2px 10px',
                                        float: 'right',
                                    }}
                                    color="secondary"
                                    variant="outlined"
                                >
                                    Cancel Session
                                </Button>
                            )
                    )}
                </div>

                <div style={{ clear: 'both' }} />
            </div>

            <Paper style={{
                padding: 20,
                marginTop: 20,
            }}
            >

                {/* Feedback scores chart */}
                <div style={{
                    height: 500,
                    margin: '20px auto',
                }}
                >
                    {session.participants.length
                        ? (
                            <ScoresChart participants={[
                                ...session.participants,
                                {
                                    displayName: 'Average',
                                    scores: session.averageScores,
                                },
                            ]}
                            />
                        )
                        : (
                            <div style={{
                                height: '100%',
                                padding: 140,
                                outline: '1px solid black',
                                textAlign: 'center',
                            }}
                            >
                                <h3 style={{ fontSize: 20, margin: 0 }}>
                                    Invite Participants to join:
                                </h3>
                                <h2 style={{
                                    margin: '20px 0 0 0',
                                    fontSize: 35,
                                }}
                                >live-poll.herokuapp.com
                                </h2>

                                <h3 style={{ margin: '35px 0 0 0' }}>Session Code</h3>
                                <h3
                                    style={{
                                        fontSize: 18,
                                        marginLeft: 6,
                                        marginTop: 7,
                                        verticalAlign: -3,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <div
                                        onKeyDown={copyJoinCode}
                                        onClick={copyJoinCode}
                                        role="button"
                                        tabIndex="0"
                                    >
                                        {session.joinCode}
                                        <FileCopyOutlinedIcon
                                            style={{
                                                fontSize: 18,
                                                marginLeft: 5,
                                                verticalAlign: -2,
                                            }}
                                        />
                                    </div>
                                </h3>
                            </div>
                        )}
                </div>

                {/* Participants */}
                <h2 style={{ paddingTop: 20 }}>
                    Participants
                    <div style={{
                        display: 'inline-block',
                        fontSize: 14,
                        marginLeft: 30,
                        color: 'var(--almost-black)',
                        verticalAlign: 2,
                    }}
                    >
                        {session.participants.length}
                        <PersonIcon style={{
                            verticalAlign: -5,
                            fontSize: 22,
                            marginLeft: 3,
                        }}
                        />
                    </div>
                </h2>

                {/* Participant List */}
                {session.participants.length
                    ? (

                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {session.participants.map((participant) => (
                                        <ParticipantRow
                                            key={participant.id}
                                            participant={participant}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )
                    : (
                        <h3>No participants have joined yet</h3>
                    )}

            </Paper>
        </Container>
    );
}

export default SessionDetails;
