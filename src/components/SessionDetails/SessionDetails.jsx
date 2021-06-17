import {
    Container,
    makeStyles,
    Paper,
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

const useStyles = makeStyles({
    sessionName: {
        minWidth: 450,
        display: 'inline-block',
        fontSize: 30,
        lineHeight: 1.35,
        fontWeight: 'bold',
        padding: '5px 12px',
        margin: '-5px 0 0 -13px',
        letterSpacing: 'inherit',

        '&.h2': {
            cursor: 'text',
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
                </div>

                <div style={{ clear: 'both' }} />
            </div>

            {/* Feedback scores chart */}
            <Paper style={{
                padding: 20,
                marginTop: 20,
            }}
            >
                <div style={{
                    height: 500,
                    margin: '20px auto',
                }}
                >
                    <ScoresChart />
                </div>
            </Paper>
        </Container>
    );
}

export default SessionDetails;
