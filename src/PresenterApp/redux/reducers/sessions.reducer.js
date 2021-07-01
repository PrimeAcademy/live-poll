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
        return {
            ...action.payload,
            // Calculate total
            averageScores: allAverageScores(action.payload.participants),
            // Add average score to participant objet
            participants: action.payload.participants.map((p) => ({
                ...p,
                averageScore: averageScore(p.scores),
            })),
        };
    case 'ADD_SESSION_PARTICIPANT':
        const newParticipant = {
            ...action.payload,
            averageScore: averageScore(action.payload.scores),
        };
        const nextParticipants = [...state.participants, newParticipant];
        return {
            ...state,
            averageScores: allAverageScores(nextParticipants),
            participants: nextParticipants,
        };
    case 'ADD_SCORE':
        const participants = state.participants.map((p) => (
            // If the new score is for this participant
            // add it to the list of scores
            p.id === action.payload.participantId
                ? {
                    ...p,
                    scores: p.scores.concat(action.payload),
                    averageScore: averageScore(p.scores.concat(action.payload)),
                }
                : p));

        return {
            ...state,
            averageScores: allAverageScores(participants),
            // Loop through participants.
            participants,
        };
    }

    return state;
};

// TODO: I think this would make more sense as a "snapshot" average
// ie. take latest score from user participant, and avg

// Should we move this to the server?
// just so there's less load on the client...?
function allAverageScores(participants) {
    // Join all scores into a single array, and sort by time
    const allScores = participants
        .reduce((scores, p) => scores.concat(p.scores), [])
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));

    const avgScores = [];
    const lastScoreByParticipant = {};

    for (const score of allScores) {
        // Track latest scores for each participant
        lastScoreByParticipant[score.participantId]
            || (lastScoreByParticipant[score.participantId] = {});

        lastScoreByParticipant[score.participantId] = score.value;

        // Save the average of all the participants latest scores
        const sumOfLatestScores = Object.values(lastScoreByParticipant)
            .reduce((sum, val) => sum + val, 0);
        const avgLatestScore = sumOfLatestScores / Object.values(lastScoreByParticipant).length;

        avgScores.push({
            value: avgLatestScore,
            createdAt: score.createdAt,
        });
    }

    return avgScores;
}

function averageScore(scores) {
    if (!scores.length) {
        return null;
    }
    return scores.reduce((sum, score) => sum + score.value, 0) / scores.length;
}

export const editSession = (state = { presenter: {}, participants: [] }, action) => {
    switch (action.type) {
    case 'SET_SESSION_DETAILS':
        return action.payload;
    case 'SET_EDIT_SESSION':
        return { ...state, ...action.payload };
    }

    return state;
};
