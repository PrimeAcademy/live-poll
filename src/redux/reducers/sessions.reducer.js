export const sessionList = (state = [], action) => {
    switch (action.type) {
    case 'PUT_SESSION_LIST':
        return action.payload;
    }

    return state;
};

export const sessionDetails = (state = {}, action) => {
    switch (action.type) {
    case 'SET_SESSION_DETAILS':
        return action.payload;
    }

    return state;
};
