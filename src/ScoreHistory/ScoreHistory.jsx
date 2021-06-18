import { useSelector } from 'react-redux';
import { Scatter, Line } from 'react-chartjs-2';
import moment from 'moment';
import C3Chart from 'react-c3js';
import 'c3/c3.css';

function ScoreHistory() {
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