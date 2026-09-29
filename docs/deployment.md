# Deployment Guide

## Prerequisites
- Node.js 18.x or 20.x
- Managed PostgreSQL Database (Neon, Supabase, Railway, AWS RDS, or Render)
- SSLCommerz Merchant Credentials
- Telegram Bot Token & Chat ID

---

## Deployment Steps (Vercel, Render, Railway, or VPS)

### 1. Database Provisioning
1. Provision a PostgreSQL 15+ database.
2. Retrieve the connection string:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"
   ```

### 2. Environment Variables Configuration
Set the following environment variables in your deployment platform:
```bash
NODE_ENV=production
APP_URL=https://yourstore.com
NEXT_PUBLIC_APP_URL=https://yourstore.com
NEXT_PUBLIC_STORE_NAME="Amar Dokan"

# Generate 32+ character secrets: openssl rand -base64 32
AUTH_SECRET="your-generated-auth-secret-min-32-chars"
CRON_SECRET="your-generated-cron-secret-min-16-chars"

# Database
DATABASE_URL="your-postgresql-connection-string"

# Payment (SSLCommerz)
SSLCOMMERZ_STORE_ID="your_live_store_id"
SSLCOMMERZ_STORE_PASSWORD="your_live_store_password"
SSLCOMMERZ_SANDBOX=false

# Telegram Notifications
TELEGRAM_BOT_TOKEN="your_bot_token"
TELEGRAM_CHAT_ID="your_chat_id"
```

### 3. Database Migration & Initial Seed
Run the following build/migration command:
```bash
npm run db:migrate:deploy
npm run db:seed
```

### 4. Create Initial Admin Account
Run the interactive CLI:
```bash
npm run admin:create
```

### 5. Automated Cron Job Setup
Configure an external cron scheduler (e.g. Vercel Cron, GitHub Actions, or cron-job.org) to trigger the outbox worker every 1 minute:
- **URL**: `https://yourstore.com/api/cron/notifications`
- **Method**: `POST` or `GET`
- **Header**: `Authorization: Bearer <CRON_SECRET>`
