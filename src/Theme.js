import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                fontSize: 16,
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
