import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import ScoreChart from '../ScoreChart/ScoreChart';

function ScoreHistory() {
    const scores = useSelector(
        (store) => store.scores,
    );

    return (
        <ScoreChart
            participants={[
                {
                    name: 'Score',
                    scores,
                },
            ]}
        />
    );
}

export default ScoreHistory;
