export const score = (state = 3, action) => {
    switch (action.type) {
    case 'SET_SCORE':
        return action.payload;
    }
    return state;
};
