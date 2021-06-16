export const sessionList = (state = [], action) => {
    switch (action.type) {
    case 'PUT_SESSION_LIST':
        return action.payload;
    }

    return state;
};
