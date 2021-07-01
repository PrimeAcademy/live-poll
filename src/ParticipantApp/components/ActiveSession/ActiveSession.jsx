/* eslint-disable no-mixed-operators */
/* eslint-disable radix */
import Slider from '@material-ui/core/Slider';
import { useState, useRef, useEffect } from 'react';
import {
    withStyles, makeStyles,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
    Button,
} from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import io from 'socket.io-client';
import ScoreHistory from '../../../ScoreHistory/ScoreHistory';
import ButtonLink from '../../../PresenterApp/components/Util/ButtonLink';

const ScoreSlider = withStyles({
})(Slider);

const useStyles = makeStyles({
    slider: {

        '& .MuiSlider-root': {
            width: '40%',
            display: 'block',
            margin: '0 auto',
        },

        '& .MuiSlider-valueLabel': {
            position: 'relative',
            right: 400,
            marginTop: 88,
            marginLeft: -92,
            // animations were too fast
            transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },

        '& .MuiSlider-valueLabel > span': {
            transform: 'rotate(-135deg)',
            fontWeight: 'bold',
            fontSize: 28,
            width: 62,
            height: 62,
        },

        '& .MuiSlider-valueLabel > span > span': {
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
            border: '1px solid #434343',
        },

        '& .MuiSlider-rail': {
            width: 11,
            opacity: 1,
            // https://cssgradient.io/
            background: 'linear-gradient(90deg, rgb(90 90 90) 0%, rgb(188 179 179) 23%, rgb(104 102 102) 100%)',
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
    // Track the current value of slider (before it's released)
    const scoreUncommitted = useSelector((store) => store.scoreUncommitted);
    const [socket, setSocket] = useState(null);

    const session = useSelector((store) => store.user.session);
    const userId = useSelector((store) => store.user.id);

    const classes = useStyles();
    const sliderRef = useRef(null);

    const [showConfirmLeave, setShowConfirmLeave] = useState(false);

    // Set menu links
    useEffect(() => {
        dispatch({
            type: 'SET_MENU_LINKS',
            payload: [
                {
                    label: 'How it works',
                    to: '/info',
                },
                {
                    label: 'Leave Session',
                    onClick: () => setShowConfirmLeave(true),
                },
            ],
        });
    });

    // setup socket connection
    useEffect(() => {
        // eslint-disable-next-line no-shadow
        const socket = io();
        setSocket(socket);

        // Send the initial score
        dispatch({
            type: 'SEND_SCORE',
            payload: scoreUncommitted,
        });
        socket.emit('sendScore', scoreUncommitted);

        socket.on('kickParticipant', (participant) => {
            console.log('I got the boot!', participant);
            // todo show notification
            dispatch({
                type: 'UNSET_USER',
            });
        });

        return () => socket.disconnect();
    }, [session.id, userId]);

    // Change slider color as the value changes
    useEffect(() => {
        const track = sliderRef.current.querySelector('.MuiSlider-thumb');
        const label = sliderRef.current.querySelector('.MuiSlider-valueLabel');

        const lowestColor = 'b52132';
        const highestColor = '659157';

        const color = interpolateColor(lowestColor, highestColor, scoreUncommitted / 5);
        track.style.background = `
            linear-gradient(
                0deg, 
                #${shadeColor(color, -20)} 0%,  
                #${shadeColor(color, 20)} 78%
            )
        `;
        label.style.color = `#${shadeColor(color, 20)}`;
    }, [scoreUncommitted]);

    return (
        <>
            <div style={{
                padding: 14,
                borderBottom: '1px solid var(--almost-black)',
                background: '#3f3f3f',
                color: 'white',
            }}
            >
                {/* Session title and info */}
                <h1 style={{
                    margin: '0 0 5px 0',
                    fontSize: 22,
                }}
                >
                    {session.name}
                </h1>
                <div style={{
                    fontSize: 13,
                }}
                >
                    <div>Presented by: {session.presenter.displayName}</div>
                    <div>
                        {moment(session.createdAt).format(
                            'MMM D hh:mm:a',
                        )}
                        {session.endedAt && ` - ${
                            moment(session.endedAt).format(
                                'hh:mm:a',
                            )}
                        `}
                    </div>
                </div>
            </div>

            {/* Score slider */}
            <div
                id="slider"
                ref={sliderRef}
                style={{
                    // height: 400,
                    padding: '30px 0',
                    background: '#575757',
                    height: 'calc(70% - 45px)',
                }}
                className={classes.slider}
            >
                <ScoreSlider
                    orientation="vertical"
                    value={scoreUncommitted}
                    valueLabelDisplay="on"
                    // triggered while sliding
                    // only tracked client-side
                    onChange={(e, val) => dispatch({
                        type: 'ADD_SCORE_UNCOMMITTED',
                        payload: Number(val),
                    })}
                    // only triggered while mouse-up
                    // actually sends to server
                    onChangeCommitted={(e, val) => {
                        dispatch({
                            type: 'SEND_SCORE',
                            payload: Number(val),
                        });
                        // Send the score to the server
                        socket.emit('sendScore', Number(val));
                    }}
                    min={1}
                    max={5}
                    step={0.1}
                />
            </div>

            <div style={{
                background: '#3f3f3f',
                height: 'calc(20% - 45px)',
            }}
            >
                <ScoreHistory />
            </div>

            <Dialog
                open={showConfirmLeave}
                onClose={() => setShowConfirmLeave(false)}
            >
                <DialogTitle>Leave Session</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to leave this session?
                        You will not be able to re-join.
                    </DialogContentText>
                    <DialogActions>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={() => setShowConfirmLeave(false)}
                        >
                            Cancel
                        </Button>
                        <ButtonLink
                            to="/logout"
                            color="secondary"
                            variant="contained"
                            onClick={() => setShowConfirmLeave(false)}
                        >
                            Leave Session
                        </ButtonLink>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default ActiveSession;
