/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
import Slider from '@material-ui/core/Slider';
import { withStyles, makeStyles } from '@material-ui/core';
import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScoreHistory from '../../../ScoreHistory/ScoreHistory';

const ScoreSlider = withStyles({
/*     root: {
        width: 50,
    },
    rail: {
        '&$vertical': {
            width: 50,
        },
    },
    track: {
        background: 'none',
        borderTop: '20px solid grey',
    }, */
})(Slider);

const useStyles = makeStyles({
    slider: {

        '& .MuiSlider-root': {
            width: '40%',
            marginLeft: 70,
        },

        '& .MuiSlider-valueLabel': {
            position: 'relative',
            right: 400,
            marginTop: 88,
            marginLeft: -92,
            // animations were too fast
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },

        '& .PrivateValueLabel-circle-5': {
            transform: 'rotate(-135deg)',
            fontWeight: 'bold',
            fontSize: 28,
            width: 62,
            height: 62,
        },

        '& .PrivateValueLabel-label-6': {
            transform: 'rotate(135deg)',
        },

        '& .MuiSlider-thumb': {
            margin: 0,
            width: 'calc(100% + 20px)',
            marginLeft: -10,
            height: 50,
            marginBottom: -25,
            borderRadius: 10,

            background: 'linear-gradient(0deg, rgba(107,107,107,1) 0%, rgba(154,154,154,1) 100%)',
            border: '1px solid #949494',
        },

        '& .MuiSlider-rail': {
            width: 11,
            opacity: 1,
            // https://cssgradient.io/
            background: 'linear-gradient(90deg, rgba(156,156,156,1) 0%, rgba(116,114,114,1) 23%, rgba(103,103,103,1) 100%)',
            position: 'relative',
            left: 'calc(50% + 11px)',
        },

        '& .MuiSlider-track': {
            opacity: 0,
        },
    },
});

// https://stackoverflow.com/a/63775249/830030
function interpolateColor(c0, c1, f) {
    c0 = c0.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * (1 - f));
    c1 = c1.match(/.{1,2}/g).map((oct) => parseInt(oct, 16) * f);
    const ci = [0, 1, 2].map((i) => Math.min(Math.round(c0[i] + c1[i]), 255));
    // eslint-disable-next-line no-bitwise
    return ci.reduce((a, v) => ((a << 8) + v), 0).toString(16).padStart(6, '0');
}

// https://stackoverflow.com/a/13532993/830030
function shadeColor(color, percent) {
    let R = parseInt(color.substring(0, 2), 16);
    let G = parseInt(color.substring(2, 4), 16);
    let B = parseInt(color.substring(4, 6), 16);
    console.log({ R, G, B });

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16));
    const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16));
    const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16));

    return `${RR}${GG}${BB}`;
}

function ActiveSession() {
    const dispatch = useDispatch();
    const scoreUncommitted = useSelector((store) => store.scoreUncommitted);
    const classes = useStyles();
    const sliderRef = useRef(null);

    useEffect(() => {
        const track = sliderRef.current.querySelector('.MuiSlider-thumb');
        console.log(track);

        const lowestColor = 'b97b82';
        const highestColor = '99b490';

        const color = interpolateColor(lowestColor, highestColor, scoreUncommitted / 5);
        console.log({ color });
        track.style.background = `
            linear-gradient(
                0deg, 
                #${shadeColor(color, -20)} 0%,  
                #${shadeColor(color, 20)} 78%
            )
        `;
    }, [scoreUncommitted]);

    return (
        <>
            <h1>Active Session</h1>

            <div id="slider" ref={sliderRef} style={{ height: 400, marginLeft: 20 }} className={classes.slider}>
                <ScoreSlider
                    orientation="vertical"
                    value={scoreUncommitted}
                    valueLabelDisplay="auto"
                    // triggered while sliding
                    // only tracked client-side
                    onChange={(e, val) => dispatch({
                        type: 'ADD_SCORE_UNCOMMITTED',
                        payload: Number(val),
                    })}
                    // only triggered while mouse-up
                    // actually sends to server
                    onChangeCommitted={(e, val) => dispatch({
                        type: 'SEND_SCORE',
                        payload: Number(val),
                    })}
                    min={1}
                    max={5}
                    step={0.1}
                />
            </div>

            <div style={{
                margin: 20,
            }}
            >
                <ScoreHistory />
            </div>
        </>
    );
}

export default ActiveSession;
