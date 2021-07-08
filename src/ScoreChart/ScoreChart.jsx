import { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

function ScoreChart({
    participants,
    isMini = false,
}) {
    const [uniqueId, setUniqueId] = useState(null);
    const getSeries = () => participants.map((part) => ({
        name: part.displayName,
        data: part.scores.map((s) => [new Date(s.createdAt).getTime(), s.value]),
    }));

    useEffect(() => {
        setUniqueId(Math.random());
    }, []);

    useEffect(() => {
        if (uniqueId) {
            ApexCharts.exec(`${uniqueId}-scores`, 'updateSeries', getSeries());
        }
    }, [participants, uniqueId]);

    return (
        <Chart
            type="line"
            height="100%"
            // https://apexcharts.com/docs/options/
            options={{
                chart: {
                    // Each chart needs a unique ID, so we can update with .exec()
                    id: `${uniqueId}-scores`,
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
                stroke: {
                    curve: 'smooth',
                    width: isMini ? 2 : 6,
                },
                // dataLabels: { enabled: false },
                xaxis: {
                    type: 'datetime',
                    labels: {
                        show: !isMini,
                        datetimeUTC: false,
                        format: 'hh:mm',
                    },
                },
                yaxis: {
                    labels: {
                        show: !isMini,
                        formatter: (val) => (val === undefined ? '' : val.toFixed(1)),
                    },
                    min: 1,
                    max: 5,
                },
                legend: { show: false },
            }}
            series={getSeries()}
        />
    );
}

export default ScoreChart;
