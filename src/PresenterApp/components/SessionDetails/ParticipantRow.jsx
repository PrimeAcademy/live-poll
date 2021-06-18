import {
    Button,
    TableRow,
    TableCell,
} from '@material-ui/core';
import moment from 'moment';
import MiniScoresChart from '../ScoresChart/MiniScoresChart';

function ParticipantRow({ participant }) {
    return (
        <TableRow>
            {/* Scores chart */}
            <TableCell style={{ maxWidth: 60, paddingLeft: 0 }}>
                <div style={{
                    width: 60,
                    height: 35,
                    marginLeft: -6,
                }}
                >
                    <MiniScoresChart />
                </div>
            </TableCell>

            {/* Average scores */}
            <TableCell style={{
                fontSize: 22,
                paddingLeft: 12,
            }}
            >
                <span style={{
                    fontWeight: 'bold',
                    fontSize: 24,
                }}
                >
                    {(Math.random() * 5).toFixed(1)}
                </span>
                <span style={{
                    fontSize: 14,
                }}
                >
                                            &nbsp;/ {(Math.random() * 5).toFixed(1)} avg
                </span>
            </TableCell>

            {/* Name */}
            <TableCell style={{ fontWeight: 'bold' }}>
                {participant.displayName}
            </TableCell>

            {/* Joined at date */}
            <TableCell style={{
                fontStyle: 'italic',
                fontSize: 14,
                paddingRight: 34,
                maxWidth: 130,
            }}
            >
                Joined @ {moment(participant.joinedAt)
                    .format('h:mma')}
            </TableCell>

            {/* Kick User */}
            <TableCell>
                <Button
                    color="secondary"
                    variant="outlined"
                    style={{
                        fontSize: 14,
                        padding: '4px 14px',
                    }}
                >
                    Kick User
                </Button>
            </TableCell>
        </TableRow>
    );
}

export default ParticipantRow;
