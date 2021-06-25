
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "displayName" VARCHAR (255) UNIQUE NOT NULL,
    "password" VARCHAR (255) NOT NULL
);

CREATE TABLE "session" (
    "id" SERIAL PRIMARY KEY,
    "presenterId" INT REFERENCES "user" NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "joinCode" VARCHAR(12) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL,
    "endedAt" TIMESTAMP
);

CREATE TABLE "participant" (
    "id" SERIAL PRIMARY KEY,
    "sessionId" INT REFERENCES "session" NOT NULL,
    "displayName" VARCHAR(255) NOT NULL,
    "joinedAt" TIMESTAMP NOT NULL,
    "exitedAt" TIMESTAMP
);

-- Feedback score
CREATE TABLE "score" (
    "id" SERIAL PRIMARY KEY,
    "participantId" INT REFERENCES "participant" NOT NULL,
    "value" FLOAT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL
)