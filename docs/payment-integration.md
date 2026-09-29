# Payment Integration & Verification (SSLCommerz)

## Overview
Amar Dokan operates on a **100% advance prepaid model**. Cash on Delivery (COD) is strictly prohibited across the storefront and API endpoints.

Supported payment methods through SSLCommerz:
- **bKash** (Mobile Financial Service)
- **Nagad** (Mobile Financial Service)
- **Rocket** (Dutch-Bangla Bank MFS)
- **Debit/Credit Cards** (Visa, MasterCard, UnionPay, etc.)

---

## Security & Verification Principles
1. **Never Trust Client Redirects**: Browser redirects from the payment gateway can be forged, manipulated, or replayed. A redirect to `/orders/confirm` only reads verified server state.
2. **Server-to-Server Verification (IPN)**: An order is marked `PAID` exclusively inside `/api/webhooks/payment` after calling SSLCommerz's validation API (`/validator/api/validationserverAPI.php`) and verifying:
   - `status === "VALID" || status === "VALIDATED"`
   - `tran_id === order.orderNumber`
   - Matching amount and currency
3. **Idempotent Webhooks**: Duplicate callbacks from the payment aggregator do not cause duplicate paid orders or duplicate stock adjustments.
4. **No Production Mocks**: The `MockPaymentAdapter` is strictly blocked at runtime if `NODE_ENV === "production"`.

---

## Configuration Variables

In `.env`:
```bash
SSLCOMMERZ_STORE_ID="your_store_id"
SSLCOMMERZ_STORE_PASSWORD="your_store_password"
SSLCOMMERZ_SANDBOX=true # Set to false in production
```

When credentials are empty, the application safely displays a `NOT_CONFIGURED` status in the checkout and admin panel without throwing unhandled exceptions.

---

## Testing in Sandbox
SSLCommerz provides sandbox test credentials:
- Test Store ID: `testbox`
- Test Store Pass: `qwerty`
- Test bKash / Nagad OTP: `123456`
- Test PIN: `1234`
