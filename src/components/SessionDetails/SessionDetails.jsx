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
import { useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    useHistory, useParams, useLocation, Link,
} from 'react-router-dom';
import moment from 'moment';
import ButtonLink from '../Util/ButtonLink';
import ScoresChart from '../ScoresChart/ScoresChart';
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

    // Select name text in input, on switch to edit mode
    const nameInputRef = createRef();
    useEffect(() => {
        if (nameInputRef.current) {
            console.log(nameInputRef.current);
            nameInputRef.current.select();
        }
    }, [isEditMode]);

    useEffect(() => {
        dispatch({
            type: 'FETCH_SESSION_DETAILS',
            payload: params.id,
        });
    }, [params.id]);

    // https://www.w3schools.com/howto/howto_js_copy_clipboard.asp
    const copyJoinCode = (evt) => {
        navigator.clipboard.writeText(session.joinCode);

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
                        ? <ScoresChart />
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
                <h2 style={{ paddingTop: 20 }}>Participants</h2>

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
