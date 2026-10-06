#!/bin/sh
set -e

echo "🚀 Starting Amar Dokan production container..."

# Use the project-local Prisma v5 CLI; call build/index.js directly so
# __dirname resolves prisma_schema_build_bg.wasm from node_modules/prisma/build/
PRISMA_BIN="node ./node_modules/prisma/build/index.js"

# Check if database is reachable and push schema if needed
if [ -n "$DATABASE_URL" ]; then
  echo "📦 Ensuring database schema is up-to-date (Prisma 5)..."
  $PRISMA_BIN db push --schema=./prisma/schema.prisma --skip-generate || echo "⚠️ Database push skipped or failed; continuing container start..."
fi

# Execute main CMD (node server.js)
exec "$@"
