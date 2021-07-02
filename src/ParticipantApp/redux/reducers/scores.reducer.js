export const scores = (state = [], action) => {
    switch (action.type) {
    case 'ADD_SCORE':
        return [...state, action.payload];
    case 'UNSET_USER':
        return [];
    }
    return state;
};

// State of score, while sliding (before mouseup)
export const scoreUncommitted = (state = 3, action) => {
    switch (action.type) {
    case 'ADD_SCORE_UNCOMMITTED':
        return action.payload;
    case 'UNSET_USER':
        return 3;
    }
    return state;
};
