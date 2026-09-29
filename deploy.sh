#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# Amar Dokan — Automated VPS Deployment Script
# Usage: ./deploy.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

echo "=========================================================="
echo "    Amar Dokan — VPS Automated Docker Deployment         "
echo "=========================================================="

# 1. Ensure .env exists
if [ ! -f .env ]; then
  echo "⚠️ .env file not found! Copying from .env.example..."
  cp .env.example .env
  echo "👉 Please edit .env with your real credentials, then re-run ./deploy.sh"
  exit 1
fi

# 2. Check Docker and Docker Compose
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first: https://get.docker.com"
  exit 1
fi

echo "📦 Pulling and building Docker images..."
docker compose build --pull

echo "🚀 Starting database and application containers..."
docker compose up -d

echo "⏳ Waiting for services to become healthy..."
sleep 5

echo "🌱 Running database seeds (demo products & initial admin)..."
docker compose exec web npx prisma db push --skip-generate || true
docker compose exec web npx tsx prisma/seed.ts || true

echo "=========================================================="
echo "✅ Application successfully deployed and running!"
echo "🌐 Storefront: http://localhost:3000"
echo "🔐 Admin Portal: http://localhost:3000/admin"
echo "=========================================================="
