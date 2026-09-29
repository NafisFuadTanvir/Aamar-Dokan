# Amar Dokan (আমার দোকান) — Bangladesh E-Commerce Store

Production-minded, mobile-first full-stack e-commerce web application tailored for Bangladesh, supporting prepaid digital payments (bKash, Nagad, Rocket, Cards), PostgreSQL image storage (`bytea`), and automated **Telegram Bot API** order notifications.

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
