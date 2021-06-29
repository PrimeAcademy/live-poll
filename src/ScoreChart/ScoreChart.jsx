import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

function ScoreChart({
    participants,
}) {
    useEffect(() => {
        const series = participants.map((part) => ({
            name: part.displayName,
            data: part.scores.map((s) => [s.createdAt.getTime(), s.value]),
        }));

        ApexCharts.exec('realtime', 'updateSeries', series);
    }, [participants]);

    return (
        <Chart
            type="line"
            height="100%"
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
                },
                stroke: { curve: 'smooth' },
                // dataLabels: { enabled: false },
                xaxis: {
                    type: 'datetime',
                },
                legend: { show: false },
            }}
            series={[{
                // https://apexcharts.com/docs/series/
                name: 'Score',
                data: [],
            }]}
        />
    );
}

export default ScoreChart;
