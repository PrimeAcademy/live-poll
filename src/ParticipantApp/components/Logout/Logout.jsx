import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log('logout');
        dispatch({
            type: 'LOGOUT',
            payload: {
                onSuccess: () => history.push('/login'),
            },
        });
    }, []);

    return (
        <><h1>Logging out...</h1></>
    );
}

export default Logout;
