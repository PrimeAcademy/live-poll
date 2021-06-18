const toast = (state = null, action) => {
    switch (action.type) {
    case 'SET_TOAST':
        return action.payload;
    case 'CLEAR_TOAST':
        return null;
    }
    return state;
};

export default toast;
