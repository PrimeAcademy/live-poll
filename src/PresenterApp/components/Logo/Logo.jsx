import { makeStyles } from '@material-ui/core';
import touchScreen from '../../images/swipe.jpg';

const useStyles = makeStyles({
    logo: {
        display: 'inline-block',
        position: 'relative',

        '& img': {
            width: '80%',
            transform: 'rotate(-10deg)',
        },

        '& div': {
            fontFamily: 'Marker Felt',
            fontSize: 70,
            color: '#3c3c3c',
            position: 'absolute',
            right: -3,
            top: 35,
            textShadow: '4px 3px 2px #c4c2b9',
            transform: 'rotate(-5deg)',
        },
    },
});
function Logo({
    showText = true,
    style,
}) {
    const classes = useStyles();

    return (
        <div className={classes.logo} style={style}>
            <img
                alt="LivePoll logo"
                src={touchScreen}
            />
            {showText && <div>LivePoll</div>}
        </div>
    );
}

export default Logo;
