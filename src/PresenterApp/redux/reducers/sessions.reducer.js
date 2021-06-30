export const sessionList = (state = [], action) => {
    switch (action.type) {
    case 'PUT_SESSION_LIST':
        return action.payload;
    case 'REMOVE_SESSION':
        return state.filter((s) => s.id !== action.payload);
    }

    return state;
};

export const sessionDetails = (state = { presenter: {}, participants: [] }, action) => {
    switch (action.type) {
    case 'SET_SESSION_DETAILS':
        return action.payload;
    case 'ADD_SCORE':
        return {
            ...state,
            // Loop through participants.
            participants: state.participants.map((p) => (
                // If the new score is for this participant
                // add it to the list of scores
                p.id === action.payload.participantId
                    ? {
                        ...p,
                        scores: p.scores.concat(action.payload),
                    }
                    : p)),
        };
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
