import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody, TableRow, TableCell, TableContainer,
    Paper,
    Container,
    makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PersonIcon from '@material-ui/icons/Person';
import ButtonLink from '../Util/ButtonLink';
import MiniScoresChart from '../ScoresChart/MiniScoresChart';

const useStyles = makeStyles({
    // Allow link to stretch the entire width/height of the containing column
    // https://getbootstrap.com/docs/4.3/utilities/stretched-link/
    // https://stackoverflow.com/a/57591579/830030
    stretchedLink: {
        color: 'inherit',
        textDecoration: 'none',
        '&::after': {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 1,
            pointerEvents: 'auto',
            content: '""',
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
    },
});

function SessionList() {
    const dispatch = useDispatch();
    const sessions = useSelector((store) => store.sessionList);
    const classes = useStyles();

    // Load sessions on init
    useEffect(() => {
        dispatch({
            type: 'FETCH_SESSION_LIST',
        });
    }, []);

    return (
        <Container style={{ maxWidth: 980 }}>
            <div>
                <h2 style={{ margin: 0, display: 'inline-block' }}>
                    Past Sessions
                </h2>

                <div style={{ float: 'right' }}>
                    <ButtonLink to="/sessions/new">
                        Start Session
                    </ButtonLink>
                </div>
            </div>

            <TableContainer component={Paper} style={{ marginTop: 50 }}>
                <Table>
                    <TableBody>
                        {sessions.map((sesh) => (
                            <TableRow key={sesh.id} style={{ position: 'relative' }}>

                                {/* Scores chart */}
                                <TableCell style={{ maxWidth: 40, paddingLeft: 0 }}>

                                    <div style={{
                                        width: 50,
                                        height: 35,
                                    }}
                                    >
                                        <MiniScoresChart />
                                    </div>
                                </TableCell>

                                {/* Average */}
                                <TableCell style={{
                                    fontSize: 22,
                                    color: 'rgba(0, 0, 0, 0.65)',
                                    paddingLeft: 15,
                                }}
                                >
                                    {(Math.random() * 5).toFixed(1)}
                                    <span
                                        style={{
                                            fontSize: 12,
                                        }}
                                    >
                                        &nbsp;avg
                                    </span>
                                </TableCell>

                                {/* Name */}
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    <Link className={classes.stretchedLink} to={`/sessions/${sesh.id}`}>
                                        {sesh.name}
                                    </Link>
                                </TableCell>

                                <TableCell style={{ textAlign: 'right' }}>
                                    {sesh.participants.length}
                                    <PersonIcon style={{
                                        verticalAlign: -5,
                                        fontSize: 22,
                                        marginLeft: 3,
                                    }}
                                    />
                                </TableCell>

                                {/* Date */}
                                <TableCell style={{
                                    fontStyle: 'italic',
                                    fontSize: 14,
                                    textAlign: 'right',
                                    paddingRight: 34,
                                }}
                                >
                                    {moment(sesh.createdAt)
                                        .format('MMM D, \'YY @ h:mma')}
                                </TableCell>

                                {/* View Details link */}
                                <TableCell>
                                    <Link
                                        to={`/sessions/${sesh.id}`}
                                        style={{
                                            color: 'var(--almost-black)',
                                            fontWeight: 'bold',
                                            fontSize: 14,
                                            textDecoration: 'none',
                                            borderBottom: '1px solid var(--almost-black)',
                                            paddingBottom: 1,
                                        }}
                                    >
                                        View Details
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}

export default SessionList;
