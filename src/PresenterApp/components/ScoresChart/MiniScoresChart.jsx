import { Line } from 'react-chartjs-2';

const datasets = [
    {
        label: 'Understanding',
        borderColor: 'green',
        borderWidth: 0.5,
        fill: false,
        lineTension: 0.05,
        borderJoinStyle: 'miter',
        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
    },
    {
        type: 'line',
        label: 'Support',
        borderColor: 'blue',
        borderWidth: 0.5,
        fill: false,
        lineTension: 0.05,
        borderJoinStyle: 'miter',
        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
    },
    {
        type: 'line',
        label: 'Comprehension',
        borderColor: 'red',
        borderWidth: 0.5,
        fill: false,
        lineTension: 0.05,
        borderJoinStyle: 'miter',
        data: new Array(8).fill().map(() => Math.round(Math.random() * 5 + 1)),
    },
];
function MiniScoresChart() {
    return (
        <Line
            data={{
                labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
                datasets,
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                tooltips: { enabled: false },
                datasets: {
                    // straight lines
                    line: { tension: 0 },
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false, suggestedMin: 2, beginAtZero: false, max: 6,
                        },
                        gridLines: { display: false },
                    }],
                    xAxes: [{
                        ticks: { display: false },
                        gridLines: { display: false },
                    }],
                },
            }}
        />
    );
}

export default MiniScoresChart;
