import {
    CircularProgress,
    Container,
    Paper,
} from '@material-ui/core';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function CreateSession() {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        dispatch({
            type: 'CREATE_SESSION',
            payload: {
                onSuccess: (sesh) => {
                    setTimeout(() => {
                        history.push(`/sessions/${sesh.id}/edit`);
                    }, 1000);
                },
            },
        });
    }, []);

    return (
        <Container style={{
            maxWidth: 980,
        }}
        >

            <Paper style={{ height: 500, textAlign: 'center' }}>
                <h2 style={{
                    paddingTop: 130,
                    color: 'var(--almost-black)',
                }}
                >
                    Starting your session...
                </h2>
                <div style={{ padding: 20 }}>
                    <CircularProgress />
                </div>
            </Paper>
        </Container>
    );
}

export default CreateSession;
