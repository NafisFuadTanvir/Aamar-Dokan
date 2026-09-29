#!/bin/sh
set -e

echo "🚀 Starting Amar Dokan production container..."

# Check if database is reachable and push schema if needed
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Ensuring database schema is up-to-date..."
  npx prisma db push --skip-generate || echo "⚠️ Database push skipped or failed; continuing container start..."
fi

# Execute main CMD (node server.js)
exec "$@"
