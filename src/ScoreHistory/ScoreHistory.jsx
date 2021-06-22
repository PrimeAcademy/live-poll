import { useSelector } from 'react-redux';
import { Scatter, Line } from 'react-chartjs-2';
import moment from 'moment';
import C3Chart from 'react-c3js';
import 'c3/c3.css';
import { useRef, useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { flushSync } from 'react-dom';

/*
Thought:
- grab currentScore from redux
- save to a "buffer" (state var)
    - When buffer is updated (or currentScore changes),
        useEffect to setTimeout to flush buffer to graph after X seconds

const newScore = useSelector(store => store.currentScore)
const [dataBuffer, setDataBuffer] = useState([]);
const [flushScoresTimer, setFlushScoresTime] = useState(null);
const [data, setData] = useState([]);       // data to render

useEffect(() => {
    if (flushScoresTimer !== null) {
        // if a time is already set, don't do it again
        return;
    }

    // Flush data to chart after a timeout
    let timer = setTimeout(() => {
        setData(dataBuffer)
        setDataBuffer([]);
        setFlushScoresTimer(null);
    }, 1000);

    // Track the timer, so we don't duplicate
    setFlushScoresTimer(timer);

    // cleanup on umount
    return () => clearTimeout(flushScoresTimer);
}, [newScore])
*/
const GRAPH_UPDATE_BUFFER_MS = 500;

function ScoreHistory() {
    const scores = useSelector(
        (store) => store.scores,
    );

    useEffect(() => {
        ApexCharts.exec('realtime', 'updateSeries', [{
            data: scores.map((s) => [s.createdAt.getTime(), s.value]),
        }]);
    }, [scores]);

    return (
        <Chart
            type="line"
            options={{
                chart: {
                    id: 'realtime',
                    animations: {
                        enabled: true,
                        easing: 'linear',
                        dynamicAnimation: {
                            speed: 800,
                        },
                    },
                },
                id: 'realtime',
                height: 350,
                type: 'line',
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            }}
            series={[{
                // https://apexcharts.com/docs/series/
                // data: scores.map((s) => ([s.createdAt.getTime(), s.value])),
                data: [],
            }]}
            dataLabels={{ enabled: false }}
            stroke={{ curve: 'smooth' }}
            xaxis={{ type: 'datetime' }}
            legend={{ show: false }}
        />
    );
}

function ScoreHistory_c3() {
    const scores = useSelector(
        (store) => store.scores,
    );

    return (
        <C3Chart
            transition={{
                duration: 110,
            }}
            data={{
                x: 'x',
                columns: [
                    ['x',
                        ...scores.map((s) => s.createdAt.getTime()),
                    ],
                    ['score',
                        ...scores.map((s) => s.value),
                    ],
                ],
                // type: 'spline',
            }}
            axis={{
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%H:%M:%S',
                    },
                },
            }}
            point={{ show: false }}
        />
    );
}

function ScoreHistory_bak() {
    const scores = useSelector((store) => store.scores);

    //
    const data = scores.map((s) => ({
        x: s.createdAt,
        y: s.value,
    }));

    // Create a range of dates for labels
    const firstScoreDate = scores.length ? scores[0].createdAt : new Date();
    const dateRange = [firstScoreDate];
    const LABEL_INTERVAL = 1000;

    while (true) {
        const lastDate = dateRange[dateRange.length - 1];
        const nextDate = new Date(lastDate.getTime() + LABEL_INTERVAL);
        dateRange.push(nextDate);

        if (nextDate > new Date()) {
            break;
        }
    }

    const labels = dateRange.map((d) => moment(d).format('hh:mm:ss'));

    console.log(data);
    return (
        <Line
            data={{
                labels,
                datasets: [{
                    label: 'score',
                    borderColor: 'green',
                    borderWidth: 2,
                    fill: false,
                    borderJoinStyle: 'miter',
                    data,
                    spanGaps: true,
                }],
            }}
            options={{
                bezierCurve: true,
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: true },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            display: true, suggestedMin: 1, beginAtZero: false, max: 5, stepSize: 1,
                        },
                        // gridLines: { display: false },
                    }],
                    x: {
                        type: 'time',
                        ticks: {
                            min: scores[0]?.createdAt,
                            max: scores[scores.length - 1]?.createdAt,
                        },
                    },
                },
            }}
        />
    );
}

export default ScoreHistory;
