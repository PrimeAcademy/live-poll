
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
    "presenterId" INT REFERENCES "user",
    "name" VARCHAR(255),
    "joinCode" VARCHAR(12),
    "createdAt" TIMESTAMP,
    "endedAt" TIMESTAMP
);

CREATE TABLE "participant" (
    "id" SERIAL PRIMARY KEY,
    "sessionId" INT REFERENCES "session",
    "displayName" VARCHAR(255),
    "joinedAt" TIMESTAMP,
    "exitedAt" TIMESTAMP
);

-- Feedback score
CREATE TABLE "score" (
    "id" SERIAL PRIMARY KEY,
    "participantId" INT REFERENCES "participant",
    "value" INT,
    "createdAt" TIMESTAMP
)