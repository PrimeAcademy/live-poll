import {
    Button,
    TableRow,
    TableCell,
} from '@material-ui/core';
import moment from 'moment';

import ScoresChart from '../../../ScoreChart/ScoreChart';

function ParticipantRow({ participant, sessionEndedAt, onKickUser }) {
    const hasExited = participant.exitedAt
        && new Date(participant.exitedAt) <= new Date();

    return (
        <TableRow style={hasExited ? {
            opacity: 0.6,
        } : {}}
        >
            {/* Scores chart */}
            <TableCell style={{ maxWidth: 60, paddingLeft: 0 }}>
                <div style={{
                    width: 60,
                    height: 60,
                    marginLeft: -6,
                }}
                >
                    <ScoresChart
                        isMini
                        participants={[
                            participant,
                        ]}
                    />
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
                    {participant.scores.length
                        && participant.scores[participant.scores.length - 1].value.toFixed(1)}
                </span>
                {participant.averageScore !== null
                && (
                    <span style={{
                        fontSize: 14,
                    }}
                    >
                        &nbsp;/ {participant.averageScore.toFixed(1)} avg
                    </span>
                )}
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
                Joined: {moment(participant.joinedAt)
                    .format('h:mma')}

            </TableCell>

            {/* Kick User */}
            <TableCell>
                {!hasExited && sessionEndedAt === null ? (
                    <Button
                        color="secondary"
                        variant="outlined"
                        style={{
                            fontSize: 14,
                            padding: '4px 14px',
                        }}
                        onClick={() => onKickUser(participant)}
                    >
                        Kick User
                    </Button>
                )
                    : (
                        <div style={{
                            fontStyle: 'italic',
                            fontSize: 14,
                            paddingRight: 34,
                            maxWidth: 130,
                        }}
                        >
                            Exited: {moment(participant.exitedAt || sessionEndedAt)
                                .format('h:mma')}
                        </div>
                    )}
            </TableCell>
        </TableRow>
    );
}

export default ParticipantRow;
