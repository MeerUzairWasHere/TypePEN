#!/bin/bash

# Get the migration name from the first argument, default to "init" if not provided
MIGRATION_NAME=${1:-init}
npx prisma migrate dev --name "$MIGRATION_NAME"
npm run start