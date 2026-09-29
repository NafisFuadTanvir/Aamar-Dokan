# System Architecture & Technical Specifications

## Architectural Overview
Amar Dokan is architected around security, zero-trust payment verification, resilience against missing third-party services, and ease of deployment without external image CDNs.

```
[Browser / Mobile Client]
       │
       ▼
 [Next.js 14 App Router]
   ├── Public Pages (Storefront, Catalogue, Product Detail, Cart, Checkout, Tracking)
   ├── Auth Handlers (NextAuth credentials + Argon2id)
   ├── API Route Handlers (Orders, Webhooks, Image Server, Cron Outbox)
   └── Private Admin Dashboard (/admin, /admin/products, /admin/orders, /admin/notifications)
       │
       ├──► [PostgreSQL Database]
       │      ├── Bytea Column for Product Images (≤ 2 MB)
       │      ├── Order & Payment State Machines
       │      ├── Notification Outbox
       │      └── Tamper-evident Audit Logs
       │
       ├──► [SSLCommerz Payment Gateway]
       │      ├── Session Creation & Redirect
       │      └── Server-to-Server IPN & Validator API
       │
       └──► [Telegram Bot API]
              └── Outbox Processor with Exponential Backoff
```

---

## Key Design Decisions

### 1. PostgreSQL `bytea` for Images
- For up to ~50 products, external cloud storage accounts (S3/Cloudinary) introduce extra billing, key management, and failure points.
- Images are stored as binary buffers in `product_images.data`.
- An image delivery route `/api/images/[id]` serves images with `Content-Type` and `Cache-Control: public, max-age=31536000, immutable` headers.
- Uploads are capped at 2 MB with strict MIME validation.

### 2. Zero-Trust Payment Flow
- **Initiation**: Checkout creates an Order in `PENDING_PAYMENT` and a Payment in `INITIATED` inside a single DB transaction. Stock is reserved.
- **Verification**: The payment gateway calls `/api/webhooks/payment`. The server queries the SSLCommerz validator API to verify the transaction reference, amount, and status.
- **Idempotency**: Duplicate callbacks are safely acknowledged without duplicate actions.
- **Order Promotion**: The order is updated to `PAID` only upon verified callback or audited manual admin verification.

### 3. Telegram Outbox & Worker Pattern
- Rather than calling external Telegram APIs synchronously during order payment, a notification record is saved to `notification_outbox`.
- A background worker (`/api/cron/notifications`) polls pending jobs and sends them with bounded exponential retries.
- If credentials are not configured, the job enters `NOT_CONFIGURED` status and remains safely queued.
