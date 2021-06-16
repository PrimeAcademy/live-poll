import {
    Container,
} from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ButtonLink from '../Util/ButtonLink';

function SessionDetails() {
    const dispatch = useDispatch();
    const params = useParams();
    const session = useSelector((store) => store.sessionDetails);

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

    return (
        <Container style={{ maxWidth: 980 }}>
            <div>
                <h2 style={{ margin: 0, display: 'inline-block' }}>
                    {session.name}
                </h2>

                <div style={{ float: 'right' }}>
                    <div
                        style={{
                            fontWeight: 'bold',
                            marginBottom: 10,
                            cursor: 'pointer',
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
            </div>
        </Container>
    );
}

export default SessionDetails;
