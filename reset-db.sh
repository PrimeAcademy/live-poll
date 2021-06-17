dropdb -f live_poll; 
createdb live_poll && \
    psql -d live_poll -f ./database.sql && \
    psql -d live_poll -f ./database-seed.sql;