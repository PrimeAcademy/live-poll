import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

function ScoreChart({
    participants,
}) {
    const getSeries = () => participants.map((part) => ({
        name: part.displayName,
        data: part.scores.map((s) => [s.createdAt.getTime(), s.value]),
    }));

    useEffect(() => {
        ApexCharts.exec('realtime', 'updateSeries', getSeries());
    }, [participants]);

    return (
        <Chart
            type="line"
            height="100%"
            // https://apexcharts.com/docs/options/
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
                    type: 'line',
                    toolbar: {
                        show: false,
                    },
                    zoom: {
                        enabled: false,
                    },
                },
                grid: {
                    show: false,
                },
                tooltip: {
                    x: {
                        format: 'hh:mm',
                    },
                    y: {
                        formatter: (val) => (val === undefined ? '' : val.toFixed(1)),
                    },
                },
                stroke: { curve: 'smooth' },
                // dataLabels: { enabled: false },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        datetimeUTC: false,
                        format: 'hh:mm',
                    },
                },
                yaxis: {
                    labels: {
                        formatter: (val) => (val === undefined ? '' : val.toFixed(1)),
                    },
                },
                legend: { show: false },
            }}
            series={getSeries()}
        />
    );
}

export default ScoreChart;
