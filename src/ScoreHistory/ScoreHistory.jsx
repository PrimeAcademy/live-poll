import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

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
                stroke: { curve: 'smooth' },
                dataLabels: { enabled: false },
                xaxis: { type: 'datetime' },
                legend: { show: false },
            }}
            series={[{
                // https://apexcharts.com/docs/series/
                data: [],
            }]}
        />
    );
}

export default ScoreHistory;
