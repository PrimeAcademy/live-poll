export const menuLinks = (state = [], action) => {
    switch (action.type) {
    case 'SET_MENU_LINKS':
        return action.payload;
    }

    return state;
};
