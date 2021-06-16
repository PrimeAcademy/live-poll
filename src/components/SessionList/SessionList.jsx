import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Table,
    TableBody, TableRow, TableCell, TableContainer,
    Paper,
    Container,
} from '@material-ui/core';
import moment from 'moment';
import { Link } from 'react-router-dom';

function SessionList() {
    const dispatch = useDispatch();
    const sessions = useSelector((store) => store.sessionList);

    // Load sessions on init
    useEffect(() => {
        dispatch({
            type: 'FETCH_SESSION_LIST',
        });
    }, []);

    return (
        <Container style={{ maxWidth: 1024 }}>
            <h2>Past Sessions</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableBody>
                        {sessions.map((sesh) => (
                            <TableRow key={sesh.id}>
                                <TableCell>
                                    CHART
                                </TableCell>
                                <TableCell>
                                    3.7
                                </TableCell>
                                <TableCell>
                                    {sesh.name}
                                </TableCell>
                                <TableCell>
                                    {moment(sesh.createdAt)
                                        .format('MMM D, \'YY @ h:mma')}
                                </TableCell>
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
