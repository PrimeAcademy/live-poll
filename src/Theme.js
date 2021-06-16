import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: { main: '#659157ff' },
    },
    overrides: {
        MuiTableCell: {
            root: {
                fontSize: 16,
                padding: '10px 0 10px 12px',
            },
        },
        MuiButton: {
            root: {
                fontWeight: 'bold',
                textTransform: 'initial',
                fontSize: 16,
                textShadow: '1px 1px 5px rgba(0, 0, 0, 0.5)',
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
