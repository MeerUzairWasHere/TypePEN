#!/bin/bash

# Get the migration name from the first argument, default to "init" if not provided
MIGRATION_NAME=${1:-init}
docker-compose up -d
echo '🟡 - Waiting for database to be ready...'
./wait-for-it.sh "postgresql://postgres:mysecretpassword@localhost:5432/postgres" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name "$MIGRATION_NAME"
npm run start
docker-compose down
