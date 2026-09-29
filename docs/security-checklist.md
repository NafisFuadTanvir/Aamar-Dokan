# Pre-Launch Security Checklist

Ensure all items are verified before switching the store to production:

- [x] **No Plaintext Passwords**: All user and admin passwords are encrypted using Argon2id with 64 MB memory cost.
- [x] **Server-Side Secrets Isolation**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWORD`, `AUTH_SECRET`, and `CRON_SECRET` exist solely on the server. No `NEXT_PUBLIC_*` variable contains any secret.
- [x] **Zero Cash on Delivery (COD)**: Frontend has no COD option. Server API explicitly validates and rejects `paymentMethod=COD` with HTTP 400.
- [x] **No Client-Side Payment Verification**: Browser redirect parameters are never used to mark orders as paid. Orders transition to `PAID` exclusively via server-to-server callback verification or audited admin verification.
- [x] **Mock Payment Blocked in Production**: `MockPaymentAdapter` throws an unhandled fatal error if instantiated when `NODE_ENV === "production"`.
- [x] **Bytea Image Upload Bounds**: Product and category image uploads are validated for MIME type (`image/jpeg`, `image/png`, `image/webp`) and strictly capped at 2 MB.
- [x] **Role-Based Authorization**: Every `/admin` route and `/api/admin/*` endpoint validates `session.user.role === "ADMIN"`.
- [x] **Audit Trail Active**: All critical events (manual payment verification, password reset generation, status update) write tamper-evident records to `audit_logs`.
- [x] **Cron Secret Protected**: `/api/cron/notifications` requires `Authorization: Bearer <CRON_SECRET>`.
- [x] **Poisha Monetary Math**: All prices, subtotals, fees, and discounts are stored and computed as integer poisha to prevent floating-point inaccuracies.
