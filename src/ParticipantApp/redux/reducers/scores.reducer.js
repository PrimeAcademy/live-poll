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
