
client
onchange

    socket.emit("score", {
        value: 3.5,
        createdAt: 9:30:00
    })

server
    socket.on("score", score => {
        score = {
            ...score,
            // add participantId to score
            participantId: socket.user.id
        }

        // Tell presenter about the new score
        // each session gets a room
        // ... assuming we have user data for participant via socket.io-auth 
        socket.to(socket.user.sessionId).emit("score", score)

        // Also persist to DB, for later retrieval
        await saveToDb(score)
    })

presenter client side

    // got a a new score from participant
    socket.on("score", score => {

    })

    - Update graph continuously (~250ms), assuming latest score is current score
    - calculating averages on client, 
        - might be tricky, but we can do it.
        - Need a "snapshot" average, and also a total average for each user, and total average for all users
        - totalAverage = (score * scoreDuration) / totalDuration