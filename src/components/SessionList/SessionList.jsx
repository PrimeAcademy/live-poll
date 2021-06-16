import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody, TableRow, TableCell, TableContainer,
    Paper,
    Container,
    Button,
    makeStyles,
} from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import ButtonLink from '../Util/ButtonLink';

function Chart() {
    return (
        <Line
            data={{
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets: [
                    {
                        label: 'Understanding',
                        borderColor: 'green',
                        borderWidth: 0.5,
                        fill: false,
                        lineTension: 0.05,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                    {
                        type: 'line',
                        label: 'Support',
                        borderColor: 'blue',
                        borderWidth: 0.5,
                        fill: false,
                        lineTension: 0.05,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                    {
                        type: 'line',
                        label: 'Comprehension',
                        borderColor: 'red',
                        borderWidth: 0.5,
                        fill: false,
                        lineTension: 0.05,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                ],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: false },
                datasets: {
                    // straight lines
                    line: { tension: 0 },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false, suggestedMin: 2, beginAtZero: false, max: 6,
                        },
                        gridLines: { display: false },
                    }],
                    xAxes: [{
                        ticks: { display: false },
                        gridLines: { display: false },
                    }],
                },
            }}
        />
    );
}

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
                                <TableCell style={{ maxWidth: 60 }}>

                                    <div style={{
                                        width: 60,
                                        height: 35,
                                    }}
                                    >
                                        <Chart />
                                    </div>
                                </TableCell>

                                {/* Average */}
                                <TableCell style={{
                                    fontSize: 22,
                                    color: 'rgba(0, 0, 0, 0.65)',
                                    paddingLeft: 12,
                                }}
                                >
                                    {(Math.random() * 5).toFixed(1)}
                                </TableCell>

                                {/* Name */}
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    <Link className={classes.stretchedLink} to={`/sessions/${sesh.id}`}>
                                        {sesh.name}
                                    </Link>
                                </TableCell>
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
                                            textDecoration: 'none',
                                            borderBottom: '1px solid var(--almost-black)',
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
