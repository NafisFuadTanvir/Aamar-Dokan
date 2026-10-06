# Amar Dokan (আমার দোকান) — Bangladesh E-Commerce Store

Full-stack e-commerce built with Next.js 14, PostgreSQL, SSLCommerz (bKash/Nagad/Rocket), and Telegram Bot notifications. Runs fully in Docker on your local PC.

---

## ▶️ How to Run (Every Time)

> **Prerequisite (one-time):** [Docker Desktop](https://www.docker.com/products/docker-desktop/) must be installed and running.

Open a terminal inside `D:\Nafis\Ecommerce` and run:

```powershell
docker compose up -d
```

That's it. Docker will:
1. Start PostgreSQL and wait until it's healthy
2. Sync the database schema automatically (Prisma 5)
3. Start the Next.js app

| URL | Purpose |
|---|---|
| http://localhost:3000 | Storefront |
| http://localhost:3000/admin | Admin dashboard |

### Stop the app
```powershell
docker compose down
```

### View live logs
```powershell
docker compose logs -f web       # Next.js app logs
docker compose logs -f postgres  # Database logs
```

### Rebuild after code changes
```powershell
docker compose build web
docker compose up -d
```

---

## 🛠️ First-Time Setup (Only Once)

### 1. Copy environment file
```powershell
copy .env.example .env
```
Edit `.env` and fill in your credentials (see [Required Environment Variables](#-required-environment-variables) below).

### 2. Start the stack
```powershell
docker compose up -d
```
The schema is auto-applied on first start. ✅

### 3. Create your admin account
```powershell
docker exec -it ecommerce_web node scripts/create-admin.js
```
Or run locally (requires Node.js installed on your PC):
```powershell
npm run admin:create
```

### 4. (Optional) Seed demo products
```powershell
npm run db:seed
```

---

## 🔑 Required Environment Variables

Edit `D:\Nafis\Ecommerce\.env`:

```env
# ── Required ──────────────────────────────────────────────────────
APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STORE_NAME="Amar Dokan"

AUTH_SECRET=<random 32+ chars>      # openssl rand -base64 32
CRON_SECRET=<random 16+ chars>      # openssl rand -base64 16

# ── Optional: Payment (live orders won't process without this) ─────
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_password
SSLCOMMERZ_SANDBOX=true             # change to false for live payments

# ── Optional: Telegram order notifications ─────────────────────────
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_CHAT_ID=-100123456789

# ── Optional: Email for password reset ────────────────────────────
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your@gmail.com
EMAIL_SMTP_PASS=your_app_password
EMAIL_FROM="Amar Dokan <noreply@yourdomain.com>"
```

> Without SSLCommerz or Telegram credentials the app still runs — it shows a clear `NOT_CONFIGURED` status instead of crashing.

---

## 📋 Common Commands Cheat Sheet

```powershell
# Start everything
docker compose up -d

# Stop everything
docker compose down

# Stop AND wipe database data (full reset)
docker compose down -v

# Rebuild after code changes, then restart
docker compose build web
docker compose up -d

# Watch app logs live
docker compose logs -f web

# Check container status
docker compose ps

# Open a shell inside the app container
docker exec -it ecommerce_web sh

# Run Prisma Studio (DB browser) — locally
npx prisma studio

# Run tests locally
npm test
npm run typecheck
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | NextAuth v5 + Argon2id |
| Payment | SSLCommerz (bKash, Nagad, Rocket, Cards) |
| Notifications | Telegram Bot API |
| Images | PostgreSQL `bytea` (no CDN needed) |
| Testing | Vitest |

---

## 📚 Documentation

- [Architecture & Design](docs/architecture.md)
- [Payment Integration (SSLCommerz)](docs/payment-integration.md)
- [Telegram Notifications Setup](docs/telegram-notifications.md)
- [Email Configuration](docs/email-configuration.md)
- [Admin Operations Guide](docs/admin-guide.md)
- [Security Checklist](docs/security-checklist.md)


---

## Key Highlights

- **100% Prepaid Model**: No Cash on Delivery (COD). All orders require advance payment via bKash, Nagad, Rocket, or Bank Cards.
- **Telegram Bot API Notifications**: Automated order alerts dispatched to a private chat or team group only after independent server verification. Replaces WhatsApp per specification.
- **PostgreSQL Bytea Image Storage**: Images stored directly in the PostgreSQL database with server-side 2 MB validation and Next.js image endpoint (`/api/images/[id]`). No external cloud storage or CDN credentials required.
- **Product Variants**: Full support for simple products and variable products (e.g., 250g, 500g, 1kg or Single/King bed sizes) with dynamic price calculation and stock tracking.
- **Secure Authentication**: NextAuth (Auth.js) credentials provider with **Argon2id** password hashing.
- **Configurable / Optional Email**: Works seamlessly with or without an SMTP server. When unconfigured, an admin-assisted password reset mechanism is active.
- **Integer Poisha Currency**: All money math computed in poisha (1 BDT = 100 poisha) to prevent floating-point errors.
- **Delivery Fee Engine**: Real-time delivery calculations for Dhaka (৳70) vs. Outside Dhaka (৳130) across all 64 districts.
- **Private Admin Dashboard**: Hidden from public storefront with role-based access, product CRUD, order management, manual payment verification with audit logs, and Telegram outbox monitor.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS (Emerald `#176B4D`, Gold `#F4B544`) |
| Fonts | Inter & Hind Siliguri (`next/font/google`) |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth v5 + Argon2id |
| Payment Gateway | SSLCommerz (bKash, Nagad, Rocket, Cards) |
| Order Notifications | Telegram Bot API |
| Testing | Vitest |

---

## Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd Ecommerce
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL`, `AUTH_SECRET`, and `CRON_SECRET` are set. Payment and Telegram credentials can remain empty initially (the app will cleanly display a `NOT_CONFIGURED` status without errors).

### 3. Database Migration & Seed
```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

### 4. Create an Admin Account
```bash
npm run admin:create
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the storefront, or [http://localhost:3000/admin](http://localhost:3000/admin) for the admin portal.

### 6. Run Test Suite
```bash
npm test
npm run typecheck
```

---

## Docker & VPS Hosting (1-Command Deploy)

You can launch the entire stack (Next.js app + PostgreSQL 16) with Docker Compose:

```bash
# 1. Clone repository on VPS
git clone <repo-url> ecommerce
cd ecommerce

# 2. Copy and customize .env
cp .env.example .env

# 3. Launch stack
chmod +x deploy.sh docker-entrypoint.sh
./deploy.sh
```

For complete instructions with Nginx, Let's Encrypt SSL, and automated Telegram cron, see the **[VPS Hosting Guide](docs/vps-hosting-guide.md)**.

---

## Documentation Links

- [Complete VPS Hosting Guide (Docker & SSL)](docs/vps-hosting-guide.md)
- [Architecture & Design Details](docs/architecture.md)
- [Payment Integration & Verification (SSLCommerz)](docs/payment-integration.md)
- [Telegram Bot API Notifications Setup](docs/telegram-notifications.md)
- [Email Configuration & Admin-Assisted Reset](docs/email-configuration.md)
- [Deployment Guide](docs/deployment.md)
- [Admin Operations Guide](docs/admin-guide.md)
- [Pre-Launch Security Checklist](docs/security-checklist.md)
