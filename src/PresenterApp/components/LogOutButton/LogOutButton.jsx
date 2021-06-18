import React from 'react';
import { useDispatch } from 'react-redux';

function LogOutButton(props) {
    const dispatch = useDispatch();
    return (
        <button
            style={{
                background: 'none',
                fontWeight: 'bold',
            }}
            // This button shows up in multiple locations and is styled differently
            // because it's styled differently depending on where it is used, the className
            // is passed to it from it's parents through React props
            // eslint-disable-next-line react/prop-types
            className={props.className}
            onClick={() => dispatch({ type: 'LOGOUT' })}
        >
            Log Out
        </button>
    );
}

export default LogOutButton;
