import { Line } from 'react-chartjs-2';

function ScoresChart() {
    return (
        <Line
            data={{
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets: [
                    {
                        label: 'Understanding',
                        borderColor: 'green',
                        borderWidth: 2,
                        fill: false,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                    {
                        type: 'line',
                        label: 'Support',
                        borderColor: 'blue',
                        borderWidth: 2,
                        fill: false,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                    {
                        type: 'line',
                        label: 'Comprehension',
                        borderColor: 'red',
                        borderWidth: 2,
                        fill: false,
                        borderJoinStyle: 'miter',
                        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
                    },
                ],
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
                            display: true, suggestedMin: 2, beginAtZero: false, max: 6, stepSize: 2,
                        },
                        // gridLines: { display: false },
                    }],
                    xAxes: [{
                        ticks: { display: true },
                        // gridLines: { display: false },
                    }],
                },
            }}
        />
    );
}

export default ScoresChart;
