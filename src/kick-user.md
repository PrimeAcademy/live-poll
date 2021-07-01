Remove a participant from a session
DELETE /sessions/:seshId/participants/:participantId

    - set exitedAt to NOW
    - emit 'participantKicked' message on server
    - Participant listens to socket, leaves session

Need to update participant login -- cannot login if exitedAt is in past


Need to change room names
    presenter/:presId
    participant/:partId

    or use io.to(socketId).emit()?