# Product Requirements Document (PRD)
## Bangladesh E-commerce Store — Full-Stack Web Application

**Document version:** 1.0  
**Status:** Implementation-ready baseline  
**Target build environment:** Google Antigravity / AI coding agents  
**Primary market:** Bangladesh  
**Primary currency:** BDT (৳ / টাকা)  
**Initial catalogue size:** 30–40 products  
**Business model:** Prepaid orders only; no Cash on Delivery (COD)

---

## 1. Project Summary

Build a production-minded, mobile-first e-commerce website for selling approximately 30–40 physical products in Bangladesh. Customers can browse and search products, view product details and reviews, create an account, submit an order, pay in advance through supported local payment methods (bKash, Nagad, and Rocket), and receive order updates. COD must not be offered anywhere in the customer journey.

After a payment is verified as successful, the system must send an order notification to the store's configured WhatsApp number. The notification should include the order number, customer and delivery details, purchased items, total amount, payment method, and payment transaction reference where available.

The application must include a private admin dashboard that is not linked or exposed in the public storefront. Admin access must require authenticated credentials and server-side authorization. Admins can manage products, inventory, orders, payment status, customer reviews, store settings, and notification settings.

The product must be secure, responsive across small phones, large phones, tablets, laptops, and desktop screens, accessible, maintainable, and designed with a modern visual system.

> **Important payment rule:** Do not treat a customer-entered transaction ID, a screenshot, a browser redirect, or a WhatsApp message as proof of payment. An order becomes “Paid” only after a trusted payment-provider verification/callback or an explicitly documented, audited manual verification by an authorized admin.

---

## 2. Goals and Success Criteria

### 2.1 Business goals
- Sell 30–40 products through one storefront.
- Accept advance payments through bKash, Nagad, and Rocket.
- Eliminate COD from the checkout and order flow.
- Make product and order management possible without editing code.
- Notify the store on WhatsApp after payment confirmation.
- Build customer trust through clear product information, transparent pricing, delivery details, and moderated reviews.

### 2.2 User goals
- Find products quickly on mobile.
- Understand price, description, availability, delivery fees, and total payable amount before ordering.
- Complete checkout without confusion.
- Know whether an order and payment were received.
- Track order status and access order history.
- Leave a review after an eligible purchase.

### 2.3 Acceptance-level success criteria
- Public pages work at widths from 320 px to 1920 px without horizontal overflow.
- Product catalogue supports at least 100 products without architectural changes.
- No COD option is shown or accepted by the backend.
- Payment status cannot be set to “Paid” by an untrusted client request.
- Duplicate payment callbacks do not create duplicate paid orders or duplicate fulfilment actions.
- Only authorized admins can access admin pages and admin APIs.
- Passwords are securely hashed; session handling and access control are implemented server-side.
- Successful verified payments trigger a WhatsApp notification attempt and record its delivery status.
- Product, stock, order, payment, and review data persist in the database.
- Critical flows have automated tests.

---

## 3. Scope

### 3.1 In scope — MVP
1. Responsive storefront and navigation.
2. Home page with hero area, featured products, categories, promotional sections, trust information, and footer.
3. Product catalogue, category filtering, search, sorting, pagination, and product cards.
4. Product detail pages with image gallery, price, description, stock status, quantity selector, and reviews.
5. Cart and checkout.
6. Customer registration, login, logout, password reset, and profile.
7. Prepaid checkout using bKash, Nagad, and Rocket through a compliant provider/integration.
8. Payment initiation, server-side verification, callback/webhook handling, and payment records.
9. Order confirmation page and customer order history/details.
10. WhatsApp order notification after verified payment.
11. Private admin authentication and dashboard.
12. Admin CRUD for products, categories, images, prices, stock, and publication status.
13. Admin order management, payment review, fulfilment status, and cancellation/refund records.
14. Review submission, moderation, and display.
15. Store settings for contact details, delivery fees, payment configuration, WhatsApp configuration, and policies.
16. Basic SEO, analytics hooks, logging, error handling, security controls, and tests.

### 3.2 Explicitly out of scope for MVP unless separately approved
- Cash on Delivery.
- Multi-vendor marketplace.
- Customer-to-customer selling.
- Native Android/iOS applications.
- Loyalty points, wallet, subscriptions, or recurring payments.
- Automated courier booking integrations.
- Multi-currency checkout.
- Complex ERP/accounting integrations.
- AI-generated product descriptions or reviews.
- Public customer-to-customer messaging.

The architecture should not prevent these future additions, but they must not delay the MVP.

---

## 4. Assumptions and Decisions to Configure

The following values must be configurable and must not be hard-coded throughout the application:

- Store name, logo, favicon, contact email, phone number, WhatsApp number.
- Store address and business hours.
- Currency display: BDT / ৳.
- Default delivery fee and any location-based delivery fee rules.
- Free-delivery threshold, if used.
- Estimated delivery copy by region.
- Payment provider and provider credentials.
- Whether each payment method is enabled.
- Order cancellation rules.
- Review eligibility and moderation rules.
- Privacy policy, terms, return/refund policy, and shipping policy.
- Admin account bootstrap method.
- Email provider settings.
- WhatsApp provider settings and approved message template, if required.

**Do not invent business-specific prices, delivery promises, legal terms, or provider credentials.** Seed development data may be fictional and must be clearly marked as demo data.

---

## 5. User Roles and Permissions

### 5.1 Guest
Can:
- View published products and categories.
- Search, filter, sort, and paginate products.
- View product details and approved reviews.
- Add/remove items from a temporary cart.
- Register or log in.
- Begin checkout.

Cannot:
- Access another customer's account or orders.
- Submit a review unless authenticated and eligible.
- Access admin routes or APIs.

### 5.2 Customer
Can:
- Manage their own profile and saved delivery details.
- View their own order history and order details.
- Place prepaid orders.
- Initiate payment for an unpaid pending order where allowed.
- View payment/order status.
- Submit a review for a product under the configured eligibility rules.
- Request account deletion or support, subject to applicable retention requirements.

Cannot:
- Mark an order paid.
- Change the price, discount, delivery fee, or order total sent by the server.
- View another customer's personal data or order.
- Access admin functions.

### 5.3 Admin
Can:
- Access the private admin dashboard after authentication and authorization.
- Create, edit, publish, unpublish, archive, and delete products where safe.
- Manage categories, product images, prices, stock, and SKU.
- View and manage orders.
- Inspect payment attempts and verification details.
- Manually verify a payment only through an explicit audited workflow if the provider integration cannot verify it automatically.
- Update fulfilment status.
- Moderate reviews.
- Manage store settings and notification settings.
- View operational logs and notification delivery status.

Admin actions involving payment status, refunds, stock adjustments, account changes, and order cancellation must be audit-logged.

### 5.4 Authorization model
- Enforce role checks on the server for every admin API/action.
- Hiding an admin link in the UI is not security.
- Deny access by default.
- Admin users must not be self-registered through the public registration form.
- Create the initial admin using a documented, secure bootstrap command or deployment process; require a password change on first login.
- Do not seed a production admin with a known default password.
- Support least privilege if additional roles are introduced later.

---

## 6. Recommended Technical Architecture

Use a single repository with clearly separated application layers. Prefer a TypeScript stack for end-to-end type safety.

### 6.1 Suggested stack
- **Frontend and server application:** Next.js (App Router) + TypeScript.
- **UI:** React, Tailwind CSS, and a consistent accessible component system such as shadcn/ui.
- **Database:** PostgreSQL.
- **ORM and migrations:** Prisma.
- **Authentication:** Auth.js or a well-maintained equivalent, configured for secure server-side sessions. If using an alternative, document its security model.
- **Validation:** Zod or equivalent schema validation shared where appropriate.
- **Forms:** React Hook Form + Zod.
- **Image storage:** S3-compatible object storage or a managed image service; do not rely on local ephemeral storage in production.
- **Payment:** Integrate through an officially supported Bangladesh payment gateway/aggregator that supports bKash, Nagad, and Rocket, or use each provider's approved merchant integration. Confirm current merchant onboarding and API requirements before implementation.
- **WhatsApp:** WhatsApp Business Platform/Cloud API or a compliant official provider. Do not use unofficial WhatsApp Web automation.
- **Email:** Transactional email provider for verification and password reset.
- **Testing:** Vitest/Jest for unit tests, Playwright for end-to-end tests.
- **Deployment:** A managed Node-compatible hosting platform plus managed PostgreSQL and object storage. Keep provider choice configurable.

AI coding agents may propose an equivalent stack, but must document the reason and preserve all functional and security requirements.

### 6.2 Architectural rules
- Keep payment, order totals, stock updates, permissions, and order transitions on the server.
- Never trust prices, discounts, totals, user IDs, role values, or payment status supplied by the browser.
- Use database transactions for order creation, inventory reservation/decrement, payment state transitions, and other multi-step changes.
- Use idempotency for payment callbacks and notification jobs.
- Use background jobs/queue or a retryable outbox pattern for WhatsApp notifications.
- Separate development, staging, and production configuration.
- Keep secrets in environment variables or the hosting platform's secret manager.
- Do not commit `.env` files or credentials.

---

## 7. Information Architecture and Routes

### 7.1 Public storefront
- `/` — Home
- `/products` — Product catalogue
- `/products/[slug]` — Product details
- `/categories/[slug]` — Category listing
- `/search?q=...` — Search results, or equivalent query-driven catalogue route
- `/cart` — Cart
- `/checkout` — Checkout
- `/checkout/payment/[orderId]` — Payment continuation/status, if required by provider flow
- `/order/confirmation/[orderNumber]` — Confirmation page; sensitive details must require a valid session or secure, unguessable access token
- `/account/register` — Registration
- `/account/login` — Login
- `/account/forgot-password` — Password reset request
- `/account/reset-password` — Password reset completion
- `/account` — Profile overview
- `/account/profile` — Edit profile
- `/account/addresses` — Delivery addresses
- `/account/orders` — Customer's orders
- `/account/orders/[orderNumber]` — Order details
- `/pages/about` — About
- `/pages/contact` — Contact
- `/pages/shipping-policy` — Shipping policy
- `/pages/return-refund-policy` — Return/refund policy
- `/pages/privacy-policy` — Privacy policy
- `/pages/terms` — Terms and conditions

### 7.2 Admin routes
Use a distinct route namespace such as `/admin`:
- `/admin/login`
- `/admin` — Dashboard
- `/admin/products`
- `/admin/products/new`
- `/admin/products/[id]/edit`
- `/admin/categories`
- `/admin/orders`
- `/admin/orders/[id]`
- `/admin/reviews`
- `/admin/customers` — Minimal data needed for operations
- `/admin/payments`
- `/admin/notifications`
- `/admin/settings`
- `/admin/audit-logs`

Admin routes must be protected at both page and API/action levels. Avoid linking to admin from the public header/footer. A non-linked URL is not a security measure; authentication and authorization are mandatory.

---

## 8. Storefront UX and Visual Design

### 8.1 Design direction
Create a modern, polished, trustworthy Bangladeshi online store. Avoid a generic unstyled template. Use a coherent design system with:
- Clear visual hierarchy and generous spacing.
- Strong product photography and consistent image ratios.
- Rounded but restrained cards, subtle borders, soft shadows, and purposeful whitespace.
- High-contrast buttons and visible focus states.
- Smooth, subtle transitions; avoid excessive motion.
- A consistent icon family.
- Consistent spacing, radius, typography, button sizes, and form controls.

### 8.2 Typography
- Use **Hind Siliguri** for Bengali UI text, with sensible Bengali-capable fallback fonts.
- Use a compatible Latin font for English/numbers if needed.
- Ensure Bengali glyphs render correctly across Android, iOS, Windows, and major browsers.
- Use readable line height and avoid tiny text.
- Suggested baseline: body 16 px on mobile; headings scale responsively using `clamp()` or equivalent.

### 8.3 Suggested theme tokens
These are initial design tokens and can be adjusted consistently:
- Primary: deep forest green `#176B4D`.
- Primary hover: `#11563D`.
- Accent: warm amber `#F4B544`.
- Page background: `#F7F9F7`.
- Surface/card: `#FFFFFF`.
- Main text: `#17211B`.
- Secondary text: `#66736B`.
- Border: `#E2E8E3`.
- Success: `#16834A`.
- Warning: `#B7791F`.
- Error: `#C53030`.

Maintain accessible contrast; do not rely on color alone to convey state.

### 8.4 Responsive requirements
Test at minimum:
- 320 px, 360 px, 375 px, 390 px, 430 px.
- 768 px, 820 px, 1024 px.
- 1280 px, 1440 px, 1920 px.

Requirements:
- No horizontal page overflow.
- Touch targets preferably at least 44 × 44 CSS px.
- Mobile navigation must be usable one-handed.
- Product grid: typically 2 columns on small phones, 2–3 on larger phones/tablets as space allows, 3–4 on desktop.
- Checkout form must be a single readable column on mobile and may use a two-column layout on wide screens.
- Admin tables must become responsive cards or use a clearly labelled horizontal scroll region on small screens.
- Respect safe areas on mobile where relevant.
- Avoid fixed-width elements that break at 320 px.

### 8.5 Motion and accessibility
- Use short transitions for hover, focus, cart feedback, and menu opening.
- Respect `prefers-reduced-motion`.
- Support keyboard navigation and visible focus.
- Use semantic HTML, proper labels, descriptive alt text, and accessible dialog/menu behavior.
- Ensure validation errors are announced and associated with fields.
- Do not use animation that blocks checkout or causes layout shifts.

---

## 9. Home Page Requirements

Include:
1. Header with logo, catalogue navigation, search, account, and cart.
2. Optional announcement strip configurable from admin.
3. Hero section with editable heading, description, image, and CTA.
4. Featured categories.
5. Featured/bestselling products.
6. Promotional banner(s) that can be enabled/disabled.
7. Trust section with accurate, configurable points such as secure payment, order support, and delivery information. Do not make unsupported claims.
8. Customer review/testimonial section showing only approved reviews.
9. FAQ section with editable content.
10. Footer with contact details, policy links, social links, and payment-method marks only for enabled methods.

All important home-page content should be editable via admin settings or a simple content-management structure, not hard-coded into components.

---

## 10. Product Catalogue and Product Detail

### 10.1 Product fields
Each product should support:
- Internal ID.
- Name.
- Unique slug.
- SKU (unique when provided).
- Short description.
- Full description (sanitized rich text or safe structured content).
- Price in integer poisha, not floating-point BDT.
- Optional compare-at/original price in poisha.
- One or more images, with alt text and ordering.
- Category and optional tags.
- Stock quantity.
- Low-stock threshold.
- Publication status: draft, published, archived.
- Featured flag.
- Optional weight/dimensions.
- Optional product options/variants if needed (e.g. size or pack), with variant-specific SKU, price, and stock.
- SEO title and meta description.
- Created/updated timestamps.

### 10.2 Catalogue functionality
- Search product name and relevant description fields.
- Filter by category and availability.
- Sort by newest, price low-to-high, price high-to-low, and featured/recommended (if configured).
- Pagination or accessible “load more”.
- Clear empty, loading, and error states.
- Do not show unpublished products publicly.
- Show sold-out state and disable purchase when unavailable.
- Product card displays image, name, price, optional compare-at price, review summary if available, and a clear detail/add-to-cart action.

### 10.3 Product detail page
- Image gallery with thumbnails and keyboard-accessible controls.
- Product name, price, compare-at price when configured, stock status, SKU if useful, description, quantity selector, and add-to-cart button.
- Display delivery fee/estimate information or link to policy.
- Related products.
- Approved review list and review submission entry point.
- Clear disabled/loading states.
- Price and stock must be revalidated on the server when the order is created.

### 10.4 Image handling
- Validate MIME type, file size, and image dimensions.
- Generate optimized responsive formats where possible.
- Use object storage or managed image storage.
- Restrict uploads to authorized admins.
- Prevent SVG/script uploads unless safely sanitized and explicitly needed.
- Support reordering and alt text.
- Do not lose images during deployment.

---

## 11. Cart Requirements

- Support add, remove, and quantity update.
- Display item image, name, unit price, quantity, line total, subtotal, estimated delivery fee, and estimated total.
- Persist guest cart locally in a safe manner; merge into the customer's cart on login where practical.
- Server must revalidate product publication, current price, variant, and stock at checkout.
- If price or stock changed, explain the change and ask the customer to confirm before proceeding.
- Do not reserve stock indefinitely for abandoned carts.
- Prevent quantities below 1 or above available stock.
- Never trust the cart total calculated in the browser.

---

## 12. Checkout Requirements

### 12.1 Checkout form
Collect only required data:
- Customer full name.
- Phone number (Bangladesh-friendly validation, but do not assume every valid number has one fixed prefix).
- Email (optional unless required by the selected payment provider or operational policy).
- Delivery address.
- District/city and area/thana as appropriate.
- Delivery instructions (optional).
- Order notes (optional; limit length).

If guest checkout is enabled, create an order linked to a guest identity and provide a secure way to retrieve order status. Otherwise, require customer login. Make this a documented product decision and configure it consistently.

### 12.2 Order summary
Before payment, show:
- Each product, selected variant, quantity, and line total.
- Subtotal.
- Delivery fee and its basis.
- Discount, only if a valid server-side discount feature is implemented.
- Final payable total.
- Explicit notice: **“অর্ডার কনফার্ম করতে অগ্রিম পেমেন্ট করতে হবে। ক্যাশ অন ডেলিভারি নেই।”**
- Enabled payment methods.
- Links to shipping, return/refund, privacy, and terms pages.

### 12.3 Checkout validation
- Validate on both client and server.
- Normalize phone and address fields safely.
- Use clear Bengali/English validation messages.
- Prevent duplicate submissions with loading state and idempotency key.
- Do not create a paid order before payment verification.
- Never accept a client-submitted total as authoritative.
- Do not collect card data directly; let the payment provider handle sensitive payment details.

---

## 13. Payment Integration — bKash, Nagad, Rocket

### 13.1 Integration strategy
Use an officially supported payment gateway/aggregator that currently supports all three methods, or integrate each merchant API separately. Before implementation, verify current provider availability, merchant eligibility, sandbox access, settlement rules, callback format, and required credentials. Do not assume a provider supports a method without checking its current documentation.

Keep payment logic behind a provider adapter interface so the application can change gateway without rewriting checkout:
- `createPayment(...)`
- `verifyPayment(...)`
- `parseCallback(...)`
- `refundPayment(...)` if supported
- `normalizeProviderStatus(...)`

The exact function contracts should be typed and documented.

### 13.2 Payment flow
1. Customer submits checkout.
2. Server validates customer details, products, prices, stock, delivery fee, and total.
3. Server creates an order with status `PENDING_PAYMENT` and a payment attempt with status `INITIATED`, using a database transaction.
4. Server requests a payment session/URL from the configured provider.
5. Customer is redirected to or shown the provider's secure payment flow.
6. Provider returns the customer to the site and/or sends a server-to-server callback/webhook.
7. Server verifies the payment with the provider using trusted server-side credentials or validates a signed callback according to official provider documentation.
8. Server checks order reference, amount, currency, merchant account, transaction ID, and final provider status.
9. In a database transaction, mark the payment attempt successful and order `PAID` exactly once; update inventory according to the chosen stock strategy.
10. Add an outbox/job record for WhatsApp notification.
11. Show a confirmation page based on the server's order state.

The customer return/redirect page alone must never mark the order paid.

### 13.3 Payment statuses
At minimum:
- `INITIATED`
- `PENDING`
- `SUCCEEDED`
- `FAILED`
- `CANCELLED`
- `EXPIRED`
- `REFUND_PENDING`
- `PARTIALLY_REFUNDED` (if supported)
- `REFUNDED`

Store provider name, provider transaction/reference IDs, requested amount, currency, raw response only when safe, verification result, timestamps, and error code/message. Redact secrets and sensitive data from logs.

### 13.4 Order statuses
At minimum:
- `PENDING_PAYMENT`
- `PAID`
- `PROCESSING`
- `PACKED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`
- `REFUND_PENDING`
- `REFUNDED`

Define allowed transitions and enforce them server-side. A failed payment should not automatically imply the order is cancelled if retry is allowed.

### 13.5 Idempotency and reconciliation
- Verify callback signatures/tokens exactly as provider documentation specifies.
- Store unique provider transaction IDs where available.
- Store and deduplicate callback event IDs.
- Process duplicate callbacks safely.
- Use database transactions and unique constraints.
- Add a scheduled reconciliation mechanism for payments left pending, if provider APIs allow it.
- Log payment state transitions for audit.
- Provide an admin payment list with filters and a safe manual verification workflow.
- Manual verification must require a reason and audit record; never expose it to customers.
- Refunds must be recorded and must not be represented as completed until confirmed.

### 13.6 No COD enforcement
- No COD option in UI, API, database defaults, or admin order-creation flow.
- Server rejects any request containing an unsupported payment method such as `COD`.
- Automated tests must confirm COD cannot be selected or submitted.

---

## 14. WhatsApp Notifications

### 14.1 Trigger
Send the order notification only after the payment is verified as successful. A separate optional notification can alert admins to failed/pending payments, but it must be clearly labelled and must not imply the order is paid.

### 14.2 Recommended implementation
Use WhatsApp Business Platform/Cloud API or an approved provider. Store credentials securely. Use an approved template when required by WhatsApp policy. Do not automate a personal WhatsApp Web session or expose access tokens in the browser.

### 14.3 Admin notification content
Use a concise, structured message. Example template (populate values from trusted server-side order data):

**নতুন পেইড অর্ডার — {{order_number}}**

- গ্রাহক: {{customer_name}}
- ফোন: {{customer_phone}}
- ঠিকানা: {{delivery_address}}, {{area}}, {{district}}
- পণ্য: {{items_summary}}
- পণ্যের মোট: {{subtotal}}
- ডেলিভারি চার্জ: {{delivery_fee}}
- মোট পরিশোধ: {{total}}
- পেমেন্ট: {{payment_method}}
- ট্রানজ্যাকশন রেফারেন্স: {{transaction_reference}}
- অর্ডারের অবস্থা: পেমেন্ট নিশ্চিত

Do not include passwords, authentication tokens, full payment credentials, or unnecessary personal data.

### 14.4 Reliability
- Create a notification outbox/job in the same transaction that marks the order paid.
- A worker sends the message and records `PENDING`, `SENT`, `FAILED`, attempt count, provider message ID, and last error.
- Retry transient errors with bounded exponential backoff.
- Ensure retries do not create duplicate messages where provider idempotency is available.
- Show notification delivery status in admin.
- If WhatsApp fails, the order must remain paid; notify admins through dashboard/email logs and allow safe retry.
- Do not claim the message was delivered until the provider reports success.

### 14.5 Customer notification
Optionally send a customer confirmation by WhatsApp only if the customer has provided a valid number and the business has the required consent/template configuration. Do not assume admin notification automatically authorizes marketing messages.

---

## 15. Authentication and Account Security

### 15.1 Customer authentication
- Registration with name, phone and/or email, and password, based on the selected login model.
- Login and logout.
- Secure password reset using single-use, expiring tokens.
- Email verification if email login is enabled.
- Optional phone OTP only if a compliant SMS/OTP provider is configured.
- Session expiration and secure session renewal.
- Customers can only read/update their own profile, addresses, and orders.

### 15.2 Password requirements
- Never store plaintext passwords.
- Use a modern password hashing algorithm supported by the chosen auth library (Argon2id or appropriately configured bcrypt).
- Rate-limit login and password reset.
- Use generic login/reset responses where needed to reduce account enumeration.
- Do not log passwords, reset tokens, OTPs, or session cookies.

### 15.3 Session and web security
- HTTPS in production.
- Secure, HttpOnly, SameSite cookies.
- CSRF protections appropriate to the auth architecture.
- Protect against XSS by escaping/sanitizing user-generated content.
- Apply secure headers, including a considered Content Security Policy.
- Rate-limit authentication, review submission, checkout creation, and sensitive admin actions.
- Validate all inputs on the server.
- Use parameterized ORM queries.
- Prevent IDOR by checking ownership for every order/address/review resource.
- Keep dependencies patched and scan for known vulnerabilities.

### 15.4 Admin security
- No public admin registration.
- Strong password policy and rate limiting.
- Optional MFA is recommended; implement if feasible for production.
- Re-authentication for sensitive operations where appropriate.
- Audit login attempts and sensitive admin actions without storing secrets.
- Do not rely on an obscure admin URL as the only protection.

---

## 16. Customer Reviews and Comments

### 16.1 Review model
A review should support:
- Product ID.
- Customer ID.
- Rating from 1 to 5.
- Review title (optional).
- Comment text.
- Created and updated timestamps.
- Moderation status: `PENDING`, `APPROVED`, `REJECTED`, `HIDDEN`.
- Optional verified-purchase flag, derived server-side.
- Optional admin moderation note.

### 16.2 Rules
- Only authenticated customers can submit reviews.
- Recommended default: one review per customer per product, with editing allowed.
- Prefer verified-purchase reviews: customer must have a paid order containing the product. If non-purchaser reviews are allowed, label them clearly and apply stricter spam moderation.
- New reviews default to `PENDING`; only approved reviews appear publicly.
- Admin can approve, reject, hide, or remove reviews.
- Validate rating and comment length.
- Escape/sanitize text; never render raw user HTML.
- Add rate limiting and basic spam protection.
- Do not generate fake reviews or prefill fabricated customer testimonials.
- Show average rating and count based only on approved reviews.
- Clearly label verified-purchase reviews where applicable.

---

## 17. Admin Dashboard

### 17.1 Dashboard overview
Display:
- Orders today / selected date range.
- Paid revenue for selected period (exclude failed/pending/refunded amounts as defined).
- Pending payment count.
- Orders needing processing.
- Low-stock products.
- Recent orders.
- Failed WhatsApp notifications.
- Recent operational alerts.

Define revenue calculations consistently and document how refunds are handled.

### 17.2 Product management
Admin can:
- Create/edit product.
- Upload multiple images and reorder them.
- Set name, slug, SKU, descriptions, category, price, compare-at price, stock, low-stock threshold, tags, featured flag, and publication status.
- Preview product before publishing.
- Save as draft.
- Archive product.
- Validate unique slug/SKU.
- See stock warnings.
- Prevent accidental destructive actions with confirmation.

If products have variants, manage stock and price at the variant level and make the selected variant explicit in cart/order lines.

### 17.3 Category management
- Create/edit/archive categories.
- Name, slug, description, image, display order, and active status.
- Prevent duplicate slugs.
- Prevent deleting a category that still has products unless products are reassigned.

### 17.4 Order management
- Search by order number, customer name, phone, or transaction reference.
- Filter by date, payment status, order status, and payment method.
- View line items, price snapshots, address snapshot, payment attempts, and notification status.
- Update allowed fulfilment states.
- Add internal notes not visible to customers.
- Print/download a packing slip if feasible.
- Cancel according to policy and record reason.
- Refund only through supported provider workflow or clearly audited manual process.
- Never edit historical order line prices when the product price changes later.

### 17.5 Review moderation
- Filter pending/approved/rejected.
- Read review and product context.
- Approve, reject, hide, or remove.
- Record moderator and timestamps.

### 17.6 Admin settings
- Store name and logo.
- Contact details and WhatsApp destination.
- Delivery fee rules.
- Payment methods enabled/disabled.
- Provider configuration status (never display full secrets after saving).
- Policies and FAQ content.
- Home page banners and featured sections.
- Notification retry controls.
- Email/WhatsApp test action restricted to admins and rate-limited.
- Setting changes should be validated and audit-logged.

### 17.7 Admin usability
- Responsive layout, sidebar/drawer navigation, clear page titles, breadcrumbs, tables with filters, pagination, and loading/empty/error states.
- Confirm destructive actions.
- Use toast/inline feedback for save success/failure.
- Preserve form values after validation errors.
- Avoid losing unsaved changes without warning.

---

## 18. Database Design

Use PostgreSQL with migrations. Use UUIDs or another non-guessable identifier strategy for internal records, and human-readable unique order numbers for customer support. Store money as integer poisha (`BIGINT` or a suitable integer type); 1 BDT = 100 poisha. Never use floating-point numbers for monetary calculations.

### 18.1 Core tables

#### `users`
- `id`
- `name`
- `email` nullable, unique when present
- `phone` nullable, normalized, unique when policy requires
- `password_hash` if password auth is managed locally
- `role` (`CUSTOMER`, `ADMIN`) or equivalent role relation
- `email_verified_at` nullable
- `status` (`ACTIVE`, `SUSPENDED`, `DELETED`/soft-delete strategy)
- `created_at`, `updated_at`, `last_login_at`

If the auth library has its own user/account/session tables, use its required schema and do not duplicate incompatible authentication storage.

#### `sessions` / auth tables
Use the chosen authentication library's schema for sessions, linked accounts, verification tokens, and password-reset tokens as applicable.

#### `addresses`
- `id`
- `user_id`
- `recipient_name`
- `phone`
- `address_line`
- `area_or_thana`
- `district`
- `postal_code` nullable
- `delivery_instructions` nullable
- `is_default`
- timestamps

#### `categories`
- `id`
- `name`
- `slug` unique
- `description` nullable
- `image_url` nullable
- `sort_order`
- `is_active`
- timestamps

#### `products`
- `id`
- `name`
- `slug` unique
- `sku` nullable, unique when present
- `short_description`
- `description`
- `price_paisa`
- `compare_at_price_paisa` nullable
- `stock_quantity`
- `low_stock_threshold`
- `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`)
- `is_featured`
- `category_id` nullable or join table if multiple categories are supported
- `weight_grams` nullable
- `seo_title` nullable
- `seo_description` nullable
- timestamps

#### `product_images`
- `id`
- `product_id`
- `url`
- `alt_text`
- `sort_order`
- timestamps

#### `product_variants` (if variants are supported)
- `id`
- `product_id`
- `sku`
- `name`
- `options` as validated JSON or normalized option tables
- `price_paisa` nullable if inherited
- `stock_quantity`
- `is_active`
- timestamps

#### `carts` / `cart_items` (optional persistent cart)
- `carts`: `id`, `user_id` nullable, `guest_token_hash` nullable, timestamps
- `cart_items`: `id`, `cart_id`, `product_id`, `variant_id` nullable, `quantity`, timestamps
Do not treat stored cart prices as authoritative.

#### `orders`
- `id`
- `order_number` unique
- `user_id` nullable only if guest checkout is supported
- `customer_name`
- `customer_phone`
- `customer_email` nullable
- delivery address snapshot fields
- `subtotal_paisa`
- `delivery_fee_paisa`
- `discount_paisa` default 0
- `total_paisa`
- `currency` default `BDT`
- `payment_status`
- `order_status`
- `customer_note` nullable
- `internal_note` nullable
- `idempotency_key` unique where applicable
- `paid_at` nullable
- `cancelled_at` nullable
- timestamps

Store address and customer details as an order snapshot so later profile changes do not rewrite past orders.

#### `order_items`
- `id`
- `order_id`
- `product_id` nullable if product is later deleted
- `variant_id` nullable
- `product_name_snapshot`
- `sku_snapshot` nullable
- `variant_snapshot` nullable
- `unit_price_paisa`
- `quantity`
- `line_total_paisa`

#### `payments`
- `id`
- `order_id`
- `provider`
- `method` (`BKASH`, `NAGAD`, `ROCKET`, or provider-normalized method)
- `status`
- `amount_paisa`
- `currency`
- `provider_payment_id` nullable
- `provider_transaction_id` nullable
- `provider_event_id` nullable
- `idempotency_key`
- `initiated_at`
- `verified_at` nullable
- `failure_code` nullable
- `failure_message` nullable
- `verification_source` (`PROVIDER_API`, `SIGNED_CALLBACK`, `ADMIN_MANUAL`)
- timestamps

Add appropriate unique constraints for provider transaction/event identifiers when present.

#### `reviews`
- `id`
- `product_id`
- `user_id`
- `rating`
- `title` nullable
- `comment`
- `status`
- `is_verified_purchase`
- `moderated_by` nullable
- `moderated_at` nullable
- `moderation_note` nullable
- timestamps
Unique constraint on `(product_id, user_id)` if one review per customer/product is the rule.

#### `notification_outbox`
- `id`
- `order_id`
- `channel` (`WHATSAPP`, `EMAIL`)
- `template_key`
- `payload` containing only necessary non-secret fields
- `status` (`PENDING`, `PROCESSING`, `SENT`, `FAILED`)
- `attempt_count`
- `next_attempt_at` nullable
- `provider_message_id` nullable
- `last_error` nullable, redacted
- timestamps

#### `audit_logs`
- `id`
- `actor_user_id` nullable for system events
- `action`
- `entity_type`
- `entity_id`
- `metadata` with safe, non-secret information
- `ip_hash` or appropriately minimized IP data if needed
- `created_at`

#### `store_settings`
Use validated key/value settings or a typed settings model. Do not store provider secrets as ordinary readable settings. Prefer a secret manager/environment configuration for credentials.

### 18.2 Indexes and integrity
Add indexes for:
- Product status/category/slug.
- Product search strategy.
- Order number, user ID, created date, order status, payment status.
- Customer phone where operationally needed.
- Payment provider IDs and status.
- Review product/status/created date.
- Notification status/next attempt time.
- Audit actor/date.

Use foreign keys, check constraints for non-negative quantities and monetary values, unique constraints, and appropriate delete behavior. Avoid cascading deletion of orders/payments/audit logs.

---

## 19. API / Server Action Requirements

Choose either typed server actions or REST endpoints consistently. Document the choice. Regardless of approach, validate all inputs and enforce authorization server-side.

Expected capabilities:
- List/search published products.
- Fetch product details.
- List categories.
- Create/update cart.
- Calculate a server-authoritative checkout quote.
- Create order and payment attempt.
- Start payment.
- Receive provider callback/webhook.
- Query current order/payment status for the authenticated owner.
- List customer's orders and order details.
- Submit/update a review.
- Admin product/category CRUD.
- Admin order/payment/review management.
- Admin settings management.
- Admin notification retry.
- Admin audit log viewing.

### API rules
- Use consistent success/error response shapes.
- Return appropriate HTTP status codes.
- Never leak stack traces or secrets to clients.
- Validate pagination limits.
- Rate-limit sensitive endpoints.
- Enforce ownership checks on every customer resource.
- Protect webhook routes using the provider's official verification method.
- Avoid logging full request bodies for payment or authentication endpoints.

---

## 20. Search, SEO, and Performance

### SEO
- Server-render public product/category pages where practical.
- Unique title and meta description for product pages.
- Canonical URLs and clean slugs.
- Open Graph metadata.
- Product structured data with accurate price, currency, availability, and rating data only when eligible.
- Sitemap and robots configuration.
- Useful 404 page and correct status codes.
- Do not index admin, account, checkout, or sensitive order pages.
- Do not expose private customer information in metadata or URLs.

### Performance
- Optimize and lazy-load below-the-fold images.
- Use responsive image sizes and modern formats.
- Avoid layout shift by reserving image dimensions.
- Use caching only for public data; never cache private order/account responses publicly.
- Paginate catalogue and admin lists.
- Avoid unnecessary client-side JavaScript.
- Set practical performance budgets and test on a throttled mobile connection.

Suggested targets (measure rather than assume):
- Good Core Web Vitals on representative mobile devices.
- Main product content should appear quickly on mid-range phones and ordinary mobile data.
- No critical console errors on primary flows.

---

## 21. Privacy, Compliance, and Operational Policies

- Publish privacy, terms, shipping, and return/refund policies before launch.
- Collect only data required for fulfilment, support, fraud prevention, and legal obligations.
- Explain how customer data is used and how customers can contact the business.
- Restrict customer data access to authorized staff.
- Define retention and deletion policies for accounts, orders, payment records, and audit logs.
- Retain records as required for accounting, payment-provider, dispute, and applicable legal requirements; do not promise deletion of records that must legally be retained.
- Obtain appropriate consent before optional marketing messages.
- Follow payment-provider merchant terms and WhatsApp Business policies.
- Confirm applicable Bangladesh legal, tax, consumer-protection, privacy, and payment obligations with qualified local advice before launch. This PRD is a technical specification, not legal advice.

---

## 22. Error Handling and Edge Cases

Handle at least:
- Product becomes unavailable while in cart.
- Price changes between add-to-cart and checkout.
- Stock changes during concurrent checkout.
- Customer closes the payment page.
- Payment succeeds but customer browser never returns.
- Provider callback arrives before/after customer redirect.
- Duplicate or out-of-order callbacks.
- Provider is temporarily unavailable.
- Payment amount or order reference does not match.
- Payment remains pending beyond timeout.
- WhatsApp API is unavailable or rate-limited.
- Notification is sent but the worker crashes before recording success.
- Admin accidentally attempts an invalid status transition.
- Customer tries to view another customer's order by changing the URL.
- Review spam, abusive content, or excessive submissions.
- Image upload fails or contains an unsupported format.
- Session expires during checkout/admin editing.
- Database transaction fails midway.
- Duplicate checkout submission.
- Refund is initiated but provider confirmation is delayed.

Show users actionable, non-technical messages and log diagnostic details safely.

---

## 23. Testing Strategy

### 23.1 Unit tests
- Price and delivery calculations.
- Quantity/stock validation.
- Order status transition rules.
- Payment status normalization.
- Callback signature/verification logic.
- Review eligibility and rating calculations.
- Authorization helper functions.
- Input schemas.

### 23.2 Integration tests
- Product CRUD and image metadata.
- Checkout order creation.
- Payment success/failure/pending flows using provider sandbox or mocks.
- Duplicate callback idempotency.
- Stock updates under concurrent order attempts.
- WhatsApp outbox creation and retry.
- Review moderation and public visibility.
- Admin API access controls.
- Customer order ownership enforcement.

### 23.3 End-to-end tests
1. Guest browses products and adds an item to cart.
2. Customer registers/logs in.
3. Customer checks out and sees the exact total.
4. Payment sandbox success marks the order paid.
5. Payment failure does not mark the order paid.
6. Customer can see their order history.
7. Customer cannot access another user's order.
8. Admin can create/edit/publish a product.
9. Unauthenticated user cannot access admin pages or APIs.
10. Customer cannot access admin APIs or alter prices/payment status.
11. COD submission is rejected.
12. Approved reviews display; pending/rejected reviews do not.
13. Duplicate payment callback does not duplicate fulfilment/notification.
14. WhatsApp notification failure is visible and retryable in admin.

### 23.4 Responsive and accessibility checks
- Test all target widths from Section 8.4.
- Keyboard-only navigation for menus, forms, dialogs, product gallery, and admin.
- Screen-reader labels and form errors.
- Reduced-motion preference.
- Contrast and focus-state checks.

---

## 24. Logging, Monitoring, Backups, and Recovery

- Use structured logs with timestamps, request IDs, and safe error context.
- Redact passwords, session tokens, OTPs, provider secrets, and sensitive payment payloads.
- Monitor payment callback failures, pending payments, order creation errors, and WhatsApp delivery failures.
- Configure database backups and document restore testing.
- Define migration and rollback procedures.
- Use separate environments and databases for development/staging/production.
- Add a health check that does not reveal secrets or internal system details.
- Configure alerts for repeated payment failures, worker failures, and database availability issues.
- Keep audit logs for important admin and payment actions.

---

## 25. Environment Variables and Secrets

Create `.env.example` with names and safe placeholders only. Actual values must be provided by the owner/deployment environment.

Suggested groups:
- `DATABASE_URL`
- `AUTH_SECRET` or framework equivalent
- `APP_URL`
- `NODE_ENV`
- `EMAIL_PROVIDER_API_KEY`
- `EMAIL_FROM`
- `STORAGE_ENDPOINT` / `STORAGE_BUCKET` / `STORAGE_ACCESS_KEY` / `STORAGE_SECRET_KEY` (depending on provider)
- `PAYMENT_PROVIDER`
- `PAYMENT_MERCHANT_ID`
- `PAYMENT_API_KEY`
- `PAYMENT_API_SECRET`
- `PAYMENT_WEBHOOK_SECRET`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_BUSINESS_ACCOUNT_ID` if required
- `WHATSAPP_ADMIN_RECIPIENT`
- `CRON_SECRET` or job-worker authentication secret

Use the exact variables required by the chosen providers. Never put secrets in `NEXT_PUBLIC_*` variables or expose them to client bundles. Do not print secret values in admin UI or logs.

---

## 26. Seed Data and Demo Mode

- Provide a seed script for development with 6–10 clearly labelled demo products across several categories.
- Do not present fake reviews as real customer feedback.
- If review examples are needed for visual development, label them as demo-only and ensure the production seed excludes them.
- Create categories and sample stock values for local testing.
- Do not include a production admin password in seed files.
- Provide a documented admin bootstrap command.
- Include a payment-provider mock/sandbox mode for local development; it must be impossible to confuse it with real production payment.
- Disable test payment success shortcuts in production.

---

## 27. Deployment and Release Requirements

Before launch:
1. Provision production database, storage, email, payment provider, and WhatsApp Business integration.
2. Set environment variables securely.
3. Run migrations and verify backups.
4. Create the first admin securely.
5. Configure real merchant credentials and provider callback URLs.
6. Configure the WhatsApp recipient and required templates.
7. Set real delivery fees and policies.
8. Test successful, failed, cancelled, and delayed payment flows in sandbox.
9. Verify no COD path exists.
10. Test on real mobile devices and major browsers.
11. Check SEO metadata, sitemap, analytics, and error monitoring.
12. Confirm privacy and business policies.
13. Run the full test suite and dependency/security checks.
14. Perform a staging sign-off before production release.

Payment provider production access may require merchant onboarding and approval. Do not claim live payments are working until a real end-to-end test has been completed with approved credentials.

---

## 28. Suggested Project Structure

The exact structure may vary with framework conventions, but maintain clear boundaries:

```text
src/
  app/
    (store)/
      page.tsx
      products/
      categories/
      cart/
      checkout/
      account/
      pages/
    admin/
      login/
      products/
      categories/
      orders/
      reviews/
      payments/
      settings/
    api/
      webhooks/
        payment/
  components/
    ui/
    layout/
    product/
    cart/
    checkout/
    review/
    admin/
  features/
    auth/
    catalogue/
    cart/
    checkout/
    orders/
    payments/
    reviews/
    notifications/
    admin/
  lib/
    auth/
    db/
    validation/
    security/
    money/
    rate-limit/
    logging/
  server/
    services/
    repositories/
    policies/
    jobs/
  styles/
  types/
prisma/
  schema.prisma
  migrations/
  seed.ts
tests/
  unit/
  integration/
  e2e/
public/
docs/
  architecture.md
  payment-integration.md
  deployment.md
  operations-runbook.md
```

Do not place all business logic in page components. Use typed services/modules for orders, payments, stock, notifications, and permissions.

---

## 29. Implementation Plan for the AI Coding Agent

Build in small, verifiable phases. Do not generate the entire application as one unreviewed code dump.

### Phase 1 — Repository and architecture
- Inspect the existing repository before changing it.
- Write a concise implementation plan.
- Create the app, TypeScript configuration, linting, formatting, environment validation, and folder structure.
- Document architecture and key decisions.
- Set up database and migrations.

**Exit criteria:** App boots locally; lint/typecheck work; database connects; migrations run.

### Phase 2 — Design system and public shell
- Add fonts, theme tokens, layout, responsive header/footer, buttons, cards, forms, dialogs, and toast system.
- Build home page using demo data.
- Test at all specified breakpoints.

**Exit criteria:** Polished responsive shell with no horizontal overflow.

### Phase 3 — Catalogue and product management
- Implement database-backed categories/products/images.
- Build catalogue, search, filters, product detail, and related products.
- Implement protected admin product/category CRUD and image uploads.

**Exit criteria:** Admin can publish a product and it appears correctly in the storefront.

### Phase 4 — Authentication and customer account
- Implement registration, login, logout, reset flow, sessions, roles, and ownership policies.
- Create account/profile/address/order pages.

**Exit criteria:** Customer data is isolated; admin access is protected server-side.

### Phase 5 — Cart, checkout, orders, and inventory
- Implement cart, authoritative price quote, delivery calculation, order snapshots, stock validation, and duplicate-submit protection.
- Implement order state machine.

**Exit criteria:** Order is created with accurate server-calculated totals and cannot be manipulated from the browser.

### Phase 6 — Payment integration
- Confirm the selected provider supports bKash, Nagad, and Rocket.
- Implement provider adapter, payment initiation, callback verification, idempotency, payment history, and sandbox tests.
- Enforce prepaid-only checkout.

**Exit criteria:** Verified success marks order paid; failed/unverified payments do not.

### Phase 7 — WhatsApp notifications
- Implement notification outbox, worker/retry logic, template, and admin delivery status.
- Add duplicate-event tests.

**Exit criteria:** One verified payment creates one logical notification job; failures can be retried safely.

### Phase 8 — Reviews and moderation
- Implement review submission, purchase eligibility, moderation, and public rating display.

**Exit criteria:** Only eligible/approved reviews appear publicly.

### Phase 9 — Hardening and release
- Add SEO, accessibility, performance improvements, monitoring, backups, security headers, rate limits, and end-to-end tests.
- Complete deployment documentation and operations runbook.

**Exit criteria:** All release requirements and critical tests pass.

---

## 30. Definition of Done

The MVP is complete only when all items below are true:

- [ ] Public storefront is polished, responsive, and works from 320 px through desktop widths.
- [ ] Bengali text renders correctly with Hind Siliguri or a suitable fallback.
- [ ] Admin can create, edit, publish, unpublish, and archive products.
- [ ] Product images, descriptions, prices, categories, and stock are database-backed.
- [ ] Catalogue search, filtering, sorting, and pagination work.
- [ ] Cart totals are recalculated and validated server-side.
- [ ] Checkout collects and validates delivery details.
- [ ] COD is absent from the UI and rejected by the backend.
- [ ] bKash, Nagad, and Rocket are enabled through an approved, configured provider/integration.
- [ ] Payment success is verified server-side, not inferred from browser redirect.
- [ ] Payment callbacks are idempotent and tested.
- [ ] Order status and payment status are distinct and correct.
- [ ] Admin receives a WhatsApp notification after verified payment.
- [ ] WhatsApp notification failures are logged and retryable.
- [ ] Customer registration, login, logout, and password recovery work.
- [ ] Customers can only access their own private data.
- [ ] Admin pages and APIs require server-side admin authorization.
- [ ] Reviews can be submitted, moderated, and displayed according to policy.
- [ ] Only approved reviews appear publicly.
- [ ] Historical order prices and address snapshots remain unchanged.
- [ ] Audit logs record sensitive admin/payment actions.
- [ ] Secrets are not committed or exposed to client code.
- [ ] Policies, contact details, delivery fees, and payment configuration are real and reviewed.
- [ ] Unit, integration, and critical E2E tests pass.
- [ ] Production backup and restore procedures are documented.
- [ ] README and deployment/runbook documentation are complete.

---

## 31. Required Documentation Deliverables

The AI coding agent must create and maintain:
- `README.md` — project overview, setup, scripts, local development.
- `.env.example` — variable names and placeholders only.
- `docs/architecture.md` — architecture, data flow, trust boundaries.
- `docs/payment-integration.md` — chosen provider, setup, callback verification, sandbox testing, failure handling.
- `docs/deployment.md` — staging and production deployment.
- `docs/operations-runbook.md` — payment reconciliation, notification retries, backups, incident steps.
- `docs/admin-guide.md` — product/order/review management.
- `docs/security-checklist.md` — implemented controls and remaining risks.

---

## 32. Instructions to Antigravity / AI Coding Agent

Treat this PRD as the source of truth. Before coding:
1. Inspect the repository and report existing framework, code, and constraints.
2. Identify unresolved provider/business decisions. Do not fabricate credentials or claim integrations are live without configuration.
3. Propose a phased plan and database schema.
4. Implement one phase at a time and run lint, typecheck, tests, and build after each phase.
5. Fix failures before moving forward.
6. Use migrations rather than editing production schema manually.
7. Never weaken authentication, payment verification, or authorization to make a demo pass.
8. Do not add COD.
9. Do not create fake testimonials or claim payment success from a client-side redirect.
10. Do not leave primary buttons as non-functional placeholders.
11. Use accessible, responsive components and realistic loading, empty, success, and error states.
12. Include tests for security boundaries and payment edge cases.
13. At the end, report completed features, required environment variables, provider setup still needed, tests run, known limitations, and exact local run commands.

### Final implementation principle
Prioritize correctness and trust for money-related flows. Visual polish is important, but payment verification, order integrity, privacy, and admin authorization must never be sacrificed for appearance or speed.


---

# PRD ADDENDUM — Production-Ready Integrations, Unlimited Catalogue, and Final Build Rules

**This addendum is part of the source of truth and overrides any ambiguous or less-specific requirement elsewhere in this document.** The goal is to implement the integrations and complete application now, with provider-specific credentials and merchant settings supplied by the owner at the end. Do not postpone integration code until credentials are available.

## A. Required delivery standard: fully implemented, configuration-ready

The application must not be delivered as a UI-only demo or as a collection of placeholder buttons. Implement the real integration adapters, persistence, callbacks/webhooks, validation, error handling, admin configuration screens, tests, and setup documentation for every external service in scope.

At the end of development, the owner should only need to:
1. Create/approve the required merchant and business accounts with the selected providers.
2. Add the production credentials and identifiers to the deployment secret manager/environment.
3. Enter non-secret business settings in the admin settings screen where appropriate.
4. Configure provider callback/webhook URLs and WhatsApp templates/webhooks as required.
5. Run the documented health checks and real sandbox/production verification steps.

Do not claim a provider is operational until valid credentials and end-to-end verification are complete. Without credentials, the integration must be implemented and testable in sandbox/mock mode, with a clear `NOT_CONFIGURED` state rather than a fake success.

### A.1 Integration readiness checklist
For each external integration, deliver:
- A typed provider interface and concrete adapter for the selected provider.
- Environment-variable validation and safe missing-configuration behavior.
- A setup guide with exact dashboard steps, required credentials, callback URLs, and test instructions.
- Sandbox/test mode where the provider supports it.
- Unit and integration tests using official sandbox or deterministic mocks.
- Webhook/callback verification and idempotency.
- Timeouts, retries where safe, error mapping, and structured redacted logs.
- Admin-visible configuration/health status without revealing secrets.
- A clear diagnostic message for missing or invalid configuration.
- A production readiness checklist and a manual end-to-end test procedure.

Do not put secrets in the database as plain text, source code, browser bundles, screenshots, logs, or `.env.example`. If an admin settings form accepts a secret, send it only to a protected server endpoint, store it in the deployment secret manager where supported, and display only a masked “configured” indicator afterwards. If the deployment environment cannot securely write secrets from the UI, require environment/secret-manager configuration and explain that clearly.

## B. Payment provider abstraction and configuration

### B.1 Required methods
The codebase must be ready to support **bKash, Nagad, and Rocket** through either:
- One selected, officially supported Bangladesh payment gateway/aggregator that supports all three methods for the merchant account; or
- Separate official merchant integrations for the methods that the chosen gateway does not support.

Do not assume all providers are available through a particular aggregator. Confirm current official documentation, merchant eligibility, and supported methods when choosing the implementation. Keep the application provider-agnostic so a gateway can be changed without rewriting order/checkout logic.

Create a documented interface similar to:
- `getCapabilities()`
- `createPaymentSession(input)`
- `verifyPayment(input)`
- `parseAndVerifyWebhook(request)`
- `queryPaymentStatus(input)`
- `requestRefund(input)` where supported
- `normalizeStatus(providerResponse)`

Implement a registry/factory that selects the configured adapter from validated server-side configuration. Do not create a single generic adapter that pretends every provider has the same API.

### B.2 Payment configuration model
Support:
- Selected gateway/provider name.
- Enabled payment methods: bKash, Nagad, Rocket individually toggleable.
- Sandbox vs production mode.
- Merchant/account identifiers.
- API key/client ID and secret fields as required by the actual provider.
- Webhook/callback verification secret or public-key configuration as required.
- API base URL only if officially configurable; never accept arbitrary unsafe URLs from public users.
- Request timeout.
- Provider-specific required fields validated before activation.
- A “configuration status” (`NOT_CONFIGURED`, `INCOMPLETE`, `READY`, `ERROR`) derived on the server.
- Last successful health check and safe diagnostic message.
- A test-mode warning that is always visible when sandbox/mock mode is active.

Secrets belong in environment variables or a secret manager. Non-secret settings may be stored in a typed database settings model. Never show the full secret after saving.

### B.3 Payment UI and operational behavior
- Show only payment methods enabled and supported by the currently active configured provider.
- If payment configuration is missing or invalid in production, disable checkout payment initiation and show a clear customer-friendly message; do not fake a successful payment.
- In development, provide a clearly labelled mock provider that cannot be enabled in production.
- The mock provider must be guarded by server-side environment checks and tests; production startup/build/deployment checks must reject mock payment mode.
- The payment result page must query the server for status and show `Processing`, `Paid`, `Failed`, or `Cancelled` appropriately.
- If provider confirmation is delayed, tell the customer that confirmation is pending and provide a safe way to refresh/check status.
- The order must not be sent for fulfilment until payment is verified, except where a separately documented admin policy explicitly applies.
- Make provider API calls server-side only.
- Verify amount, currency, order reference, merchant account, transaction ID, and final status.
- Use unique constraints and idempotency to prevent duplicate payment/order processing.
- Store a redacted provider request/response summary sufficient for support, not secrets or unnecessary sensitive payloads.

### B.4 Stock strategy
Implement and document one consistent strategy:
- Preferred: reserve stock for a short, configurable period when creating a payment attempt; release the reservation after payment failure/expiry; finalize decrement after verified payment.
- Use database transactions/locking or atomic conditional updates so concurrent checkouts cannot oversell.
- Add a scheduled expiry/reconciliation job for stale reservations and pending payments.
- If the implementation chooses decrement-on-payment instead, it must still prevent overselling with an atomic stock check at payment confirmation and handle the case where payment succeeds after stock becomes unavailable. Document and test the resolution.
- Do not keep stock reserved indefinitely for abandoned payment sessions.

## C. WhatsApp Business integration — complete but awaiting owner credentials

Implement the real WhatsApp Business Platform/Cloud API integration (or a documented, approved provider adapter) now. Do not merely create a `wa.me` link and call it an automated notification system.

### C.1 Configuration
Support the provider's required configuration, as applicable:
- WhatsApp provider/adapter.
- Access token.
- Phone number ID.
- WhatsApp Business Account ID where required.
- Admin recipient number in international format.
- Approved message template name, language, and variable mapping.
- API version and timeout where appropriate.
- Webhook verification token and app-secret/signature configuration if inbound webhooks are used.
- Enabled/disabled switch.
- Test/health-check status and last successful test timestamp.

Keep access tokens and app secrets server-side in a secret manager/environment. Never expose them to the browser or return them through an admin API. The UI should show masked/boolean configuration state only.

### C.2 Notification workflow
- Trigger an admin notification after a trusted payment verification transaction commits.
- Use a transactional outbox so a payment can succeed even if WhatsApp is temporarily unavailable.
- Use a background worker/queue or a reliable scheduled worker with bounded retries and exponential backoff.
- Track `PENDING`, `PROCESSING`, `SENT`, `FAILED`, and `RETRY_SCHEDULED`, attempt count, last error, provider message ID, and timestamps.
- Add an admin screen to filter notifications, view safe delivery details, and retry failed messages.
- Ensure retries do not create duplicate logical notifications; use provider idempotency if available and maintain an internal unique event key such as `order-paid:{orderId}:admin-whatsapp`.
- If the provider requires approved templates for business-initiated messages, implement template-based messages and document how to create/approve the template.
- Include a protected “Send test notification” action. It must require admin authorization, rate limiting, explicit confirmation, and must not send a real order notification.
- If WhatsApp is not configured, keep the job in a diagnosable failed/not-configured state and show the setup steps to the admin. Never silently discard it.
- A notification failure must not roll back a verified payment or mark the order unpaid.

### C.3 Template variables
The message must be generated from trusted server-side order/payment data and support:
- Order number.
- Customer name and phone.
- Delivery address, area/thana, and district.
- Item names, variants, quantities.
- Subtotal, delivery fee, discount if any, and total paid.
- Payment method.
- Provider transaction/reference ID, when available.
- Payment verification time.
- Link to the protected admin order detail page (not a public page containing private data).

Keep the message concise enough for WhatsApp. Escape/format values safely and avoid sending passwords, OTPs, credentials, or unnecessary personal data.

## D. Unlimited product growth and scalable catalogue

The catalogue must not be hard-coded to 30–40 products. The initial catalogue may contain 30–40 items, but the system must support adding hundreds or thousands of products through the admin interface without code changes, schema changes, or a redesign.

### D.1 Catalogue requirements
- Database-backed products and categories; no fixed product arrays in production.
- Server-side pagination for public product/category/search pages and admin lists.
- Configurable page size with safe maximum limits; suggested public default 12 or 16 products per page, admin default 20 or 25.
- Page navigation with current page, total pages, previous/next, and sensible mobile behavior.
- Preserve search, category, sorting, and filter parameters while navigating pages.
- Use stable sorting and deterministic tie-breakers to avoid products appearing twice or being skipped between pages.
- Use indexed database queries; do not fetch every product to the browser and paginate only on the client.
- Provide an option to switch to cursor pagination for very large datasets, especially admin/order feeds, if justified.
- Search should be database-backed and support Bengali and English product names where practical.
- Add indexes for slug, status, category, SKU, and common sort/filter combinations. Use PostgreSQL full-text/trigram search or an equivalent strategy where appropriate and document its limitations.
- Product count, empty states, loading states, and filter reset must work.
- Avoid unbounded API responses and unbounded admin dropdowns.

### D.2 Admin product list
Include:
- Search by product name, SKU, or slug.
- Filters for category, published/draft/archived, in-stock/out-of-stock, and featured status.
- Sort by newest, name, price, stock, and last updated.
- Pagination and page-size selector (with a safe maximum).
- Bulk actions where safe: publish/unpublish, archive, and category assignment.
- Bulk destructive actions require confirmation and must be audited.
- Export product list to CSV if feasible; do not expose private customer data in product exports.
- Clear total count and current page information.

### D.3 Product creation and editing
- Admin can create as many products as business needs, subject to infrastructure/storage limits.
- Use server-side validation and database constraints.
- Handle slug collisions by showing a clear validation error or proposing a unique slug.
- Upload multiple images, reorder them, set alt text, and choose a primary image.
- Support drafts so incomplete products do not appear publicly.
- Add product variants if needed without forcing variants for simple products.
- Use soft archive rather than deleting products referenced by historical order lines.
- Existing orders retain product name, SKU, variant, and price snapshots even if the product is edited or archived.

### D.4 Performance with a growing catalogue
- Optimize product queries and inspect slow queries.
- Use database indexes and pagination; add caching only for safe public catalogue data.
- Invalidate relevant cache after product/category changes.
- Never publicly cache account, checkout, payment, or order-specific responses.
- Load images lazily and serve appropriately sized optimized assets.
- Add load/performance tests using at least 1,000 seeded products and a representative number of orders.
- The app should degrade gracefully if the catalogue grows beyond the initial target.

## E. Component library and design implementation

The AI agent may use **Material UI (MUI)**, shadcn/ui, or another maintained accessible component library. Material UI is explicitly permitted and is a suitable option for the admin dashboard, forms, dialogs, tables, pagination, menus, alerts, and responsive navigation.

Requirements:
- Choose one primary component system and use it consistently; do not mix multiple libraries without a documented reason.
- If using MUI, configure its theme centrally, including colors, typography, spacing, shape, breakpoints, focus styles, and component defaults.
- Use Hind Siliguri for Bengali text with a reliable fallback; verify rendering in MUI controls, dialogs, tables, pagination, validation errors, and mobile menus.
- Customize components so the website feels like a coherent branded store rather than default library styling.
- Use accessible MUI components such as buttons, text fields, select/autocomplete, dialogs, snackbar/alerts, tables, tabs, drawer, menu, skeletons, and pagination where appropriate.
- For large product/admin tables, use server-side pagination, filtering, and sorting; do not load all rows into a client-side data grid.
- Avoid duplicate UI libraries and conflicting CSS resets.
- Animations must be subtle, performant, and respect reduced-motion settings.
- Keep responsive behavior and keyboard accessibility in all library components.

## F. Final project deliverables — no missing implementation areas

The completed repository must contain:
1. Working public storefront.
2. Customer authentication and account pages.
3. Database schema and migrations.
4. Admin dashboard with secure role-based access.
5. Full product/category/image CRUD with scalable pagination.
6. Cart, server-calculated checkout, delivery fee calculation, and order snapshots.
7. Payment adapter architecture and concrete integrations for the selected gateway/provider(s) covering bKash, Nagad, and Rocket as supported by merchant access.
8. Provider callback/webhook verification, reconciliation, idempotency, and payment state machine.
9. WhatsApp Business adapter, message template support, transactional outbox, retry worker, logs, and admin test/retry controls.
10. Reviews, verified-purchase eligibility, moderation, and public display.
11. `.env.example` with placeholders only.
12. Database seed script for demo data, with no fake production testimonials or known production credentials.
13. Unit, integration, and end-to-end tests for all critical flows.
14. Responsive/accessibility checks.
15. `README.md`, `docs/architecture.md`, `docs/payment-integration.md`, `docs/deployment.md`, `docs/operations-runbook.md`, `docs/admin-guide.md`, and `docs/security-checklist.md`.
16. A final integration status report clearly distinguishing implemented code, configured credentials, sandbox-tested integrations, and production-verified integrations.

## G. Final acceptance gates

Do not mark the project complete until:
- The app can start with documented local setup.
- Database migrations and seed run successfully.
- Product CRUD and pagination work with at least 1,000 seeded products.
- Public catalogue and admin lists use server-side pagination.
- Unauthenticated and non-admin requests are denied from admin APIs.
- Customer ownership checks prevent access to other customers' orders.
- COD is rejected server-side.
- Payment success cannot be forged through a client request or redirect.
- Duplicate/out-of-order callbacks are safe.
- WhatsApp notifications are created only for verified paid orders and can be retried safely.
- Missing credentials produce a clear configuration status, not fake success.
- Production mode refuses mock payment configuration.
- Lint, typecheck, production build, unit tests, integration tests, and critical E2E tests pass.
- The documentation tells the owner exactly which credentials, URLs, templates, merchant approvals, and dashboard settings remain to be supplied at launch.

**Owner's expected final task:** supply approved provider credentials and business settings, configure callback/template settings, then perform the documented end-to-end verification. The AI agent is responsible for implementing the integration code and configuration workflow before that point.

---

# ADDENDUM: Product Variants / Multiple Sizes and Prices

## Required Feature: Multiple Sizes, Weights, Packs, and Prices

The storefront and Admin Dashboard MUST support products sold in multiple selectable variants. Examples:
- 100g — ৳250
- 200g — ৳450
- 500g — ৳1,000
- Small / Medium / Large
- Single pack / Combo pack

This is mandatory. Do not force every product to have only one fixed price.

### Admin Product Management

When creating or editing a product, the admin can choose:
1. **Simple product:** one price and one stock quantity.
2. **Variable product:** multiple selectable variants, each with its own price and stock.

For each variant, the admin can add, edit, reorder, enable/disable, and remove:
- Variant label (e.g., `100g`, `200g`)
- Attribute name and value (e.g., `Weight: 100g`, `Pack: Combo of 3`)
- SKU/variant code (optional)
- Regular price and optional sale price
- Stock quantity and stock status
- Optional variant-specific image
- Enabled/disabled status

Provide a clear “Add variant” interface and a table/form showing each variant’s label, price, sale price, stock, and status. Admins must manage variants without editing code or database records.

Support one or more attributes (Weight, Size, Pack, Color, Quantity). Where products have multiple attributes, support explicit valid combinations and do not show unavailable or disabled combinations.

### Storefront, Cart, and Checkout

- Product cards for variable products should show a starting price, such as “৳250 থেকে”, rather than implying all variants have the same price.
- Product detail pages must show available variants as selectable buttons, chips, or a dropdown.
- Changing the selection must immediately update displayed price, sale price, stock availability, and variant image when configured.
- Require a valid variant selection before adding a variable product to the cart.
- Clearly disable and label out-of-stock variants.
- Preserve the exact selected variant, attributes, unit price, quantity, and line total in the cart, checkout, order confirmation, customer order history, admin order details, and WhatsApp notification.
- Calculate and validate prices on the server from trusted database records; never trust a price submitted by the browser.
- Existing orders must retain a snapshot of the variant label and price that applied when the order was placed, even if the admin later changes the product.

### Database, Inventory, and Testing

- Add a dedicated `ProductVariant` (or equivalent) database model related to `Product`, with appropriate indexes and constraints.
- Store prices as integer poisha, consistent with the main PRD.
- Each order item must snapshot product name/ID, variant ID when applicable, variant label and selected attributes, SKU when applicable, unit price in poisha, quantity, and line total in poisha.
- Update product, cart, checkout, order, payment, admin, and WhatsApp notification logic as needed.
- Validate and update stock safely/atomically according to the inventory policy, preventing overselling when concurrent orders target the same variant.
- Add automated tests for variant management, price calculation, missing/invalid selections, out-of-stock variants, cart persistence, checkout, order snapshots, and concurrent stock updates.
- Keep search, category listings, filters, pagination, and performance working for both simple and variable products.

### Acceptance Criteria

An admin must be able to create and publish a product with `100g — ৳250` and `200g — ৳450`. A customer must be able to select either size, see the correct price, add it to the cart, pay the correct amount, and receive order details/WhatsApp notification identifying the exact selected size and price. Each variant must have independently manageable pricing and stock. This must work on mobile and desktop.
