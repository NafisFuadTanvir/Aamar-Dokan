# Admin Operation Guide

## Accessing the Admin Dashboard
- The admin dashboard is intentionally **unlinked in public navigation** to prevent casual discovery.
- URL: `/admin`
- Access requires an authenticated session with the `ADMIN` role. Unauthorized requests are automatically redirected to `/login`.

---

## Daily Operations

### 1. Reviewing New Orders
1. Navigate to **অর্ডার ও পেমেন্ট** (`/admin/orders`).
2. Filter by status: `PAID` for orders ready to pack, or `PENDING_PAYMENT` for pending checkouts.
3. Click **বিস্তারিত** on any order to inspect:
   - Recipient Name, Phone, and Full Address
   - Purchased Products, selected variants (e.g. 500g, Single bed), and quantities
   - Financial breakdown (Subtotal, District delivery fee, Total)
   - Payment Transaction Reference and Provider Validation summary

### 2. Manual Payment Verification (If Customer Paid Directly)
If a customer sent money via bKash/Nagad merchant counter or personal transfer:
1. Open the order in `/admin/orders/[id]`.
2. Click **ম্যানুয়ালি ভেরিফাই করুন**.
3. Select payment method (bKash, Nagad, Rocket, or Card).
4. Enter the verified Transaction ID (TrxID).
5. Enter the **Audit Reason** (e.g. "Verified in bKash merchant statement on 29/09").
6. Click **পেমেন্ট নিশ্চিত করুন**.
7. The order transitions to `PAID`, inventory is deducted, an audit record is logged with your Admin ID, and a notification is dispatched to Telegram.

### 3. Adding New Products & Variants
1. Navigate to `/admin/products/new`.
2. Enter Product Name, Category, Short Description, and Full Description.
3. Choose product mode:
   - **একক পণ্য (Simple)**: Enter single price in BDT and stock quantity.
   - **ভ্যারিয়েন্টযুক্ত পণ্য (Variable)**: Check the variant checkbox and add variant rows (e.g. 250g, 500g, 1kg) with their respective prices and stock.
4. Upload product images (JPEG, PNG, WebP ≤ 2 MB).
5. Click **পণ্যটি সংরক্ষণ ও প্রকাশ করুন**. Images are stored directly in PostgreSQL bytea.

### 4. Telegram Notification Outbox
1. Navigate to `/admin/notifications`.
2. Review the status of automated messages.
3. If an error occurred (e.g. temporary network glitch), click **রিট্রাই** to immediately re-attempt delivery.
4. Click **টেস্ট বার্তা পাঠান** to verify that your Telegram Bot is communicating properly.
