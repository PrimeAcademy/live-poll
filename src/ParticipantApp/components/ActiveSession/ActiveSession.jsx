import Slider from '@material-ui/core/Slider';
import { withStyles } from '@material-ui/core';
import { useState } from 'react';
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

function ActiveSession() {
    const dispatch = useDispatch();
    const scoreUncommitted = useSelector((store) => store.scoreUncommitted);

    return (
        <>
            <h1>Active Session</h1>

            <div style={{ height: 400, marginLeft: 20 }}>
                <ScoreSlider
                    orientation="vertical"
                    value={scoreUncommitted}
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
