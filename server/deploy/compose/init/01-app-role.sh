#!/bin/sh
# Runs once when the data volume is first initialised. Creates the
# least-privileged role the API connects as: LOGIN only, owner of nothing
# outside the `careers` database, no superuser/createdb/createrole.
set -eu
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<SQL
CREATE ROLE careers_app LOGIN PASSWORD '${CAREERS_APP_PASSWORD}' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
REVOKE ALL ON DATABASE careers FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CONNECT, TEMP ON DATABASE careers TO careers_app;
GRANT USAGE, CREATE ON SCHEMA public TO careers_app;
SQL
