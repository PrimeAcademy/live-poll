export const scores = (state = [], action) => {
    switch (action.type) {
    case 'ADD_SCORE':
        return [...state, {
            value: action.payload,
            createdAt: new Date(),
        }];
    }
    return state;
};

export const currentScore = (state = { value: 3, createdAt: new Date() }, action) => {
    switch (action.type) {
    case 'ADD_SCORE':
        return { value: action.payload, createdAt: new Date() };
    }
    return state;
};
