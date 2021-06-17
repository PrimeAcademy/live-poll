export const sessionList = (state = [], action) => {
    switch (action.type) {
    case 'PUT_SESSION_LIST':
        return action.payload;
    }

    return state;
};

export const sessionDetails = (state = { presenter: {}, participants: [] }, action) => {
    switch (action.type) {
    case 'SET_SESSION_DETAILS':
        return action.payload;
    }

    return state;
};

export const editSession = (state = { presenter: {}, participants: [] }, action) => {
    switch (action.type) {
    case 'SET_SESSION_DETAILS':
        return action.payload;
    case 'SET_EDIT_SESSION':
        return { ...state, ...action.payload };
    }

    return state;
};
