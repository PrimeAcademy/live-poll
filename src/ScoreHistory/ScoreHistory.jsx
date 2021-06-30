import { useSelector } from 'react-redux';
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
