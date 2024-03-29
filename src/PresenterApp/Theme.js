import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#659157ff' },
        secondary: { main: '#b52132' },
        warning: { main: '#ff9800' },
    },
    overrides: {
        MuiTableCell: {
            root: {
                fontSize: 16,
                padding: '10px 0 10px 12px',
            },
        },
        MuiAlert: {
            root: {
                border: '1px solid rgb(169 151 150 / 45%)',
            },
        },
        MuiButton: {
            root: {
                fontWeight: 'bold',
                textTransform: 'initial',
                fontSize: 16,
            },
            containedPrimary: {
                textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
            },
            containedSecondary: {
                textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
            },
            outlined: {
                textShadow: 'none',
            },
            outlinedSecondary: {
                borderColor: '#b32031',
            },
        },
        MuiCssBaseline: {
            '@global': {
                'p, h1, h2, h3, h4, h5': {
                    fontSize: 16,
                    fontFamily: 'Helvetica Neue',
                    lineHeight: 1.35,
                },
                h1: {
                    fontSize: 40,
                },
                h2: {
                    fontSize: 30,
                },
                p: {
                    fontSize: 18,
                    lineHeight: 1.6,
                },
            },
        },
    },
});

export default theme;
