# Telegram Bot API Order Notifications

## Overview
Order notifications to the store owner/admin are delivered via the **Telegram Bot API**. This replaces the legacy WhatsApp integration and delivers instant, reliable order notifications to a private chat or private group.

---

## Security Guarantee
- `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` are **strictly server-side environment variables**.
- They are **never** exposed to the browser client or included in `NEXT_PUBLIC_*` prefixes.
- Notifications are triggered **only after independent server-side payment verification** via the payment provider callback (SSLCommerz IPN / validation server), or via explicit audited admin verification. Client browser redirects can never trigger a notification.

---

## Step-by-Step Setup Guide

### 1. Create a Telegram Bot
1. Open Telegram and search for `@BotFather`.
2. Send `/newbot` and follow the prompts to choose a name and username (e.g. `AmarDokanOrderBot`).
3. BotFather will provide an API token in the format:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
4. Save this token as `TELEGRAM_BOT_TOKEN` in your `.env` file.

### 2. Get Your Chat ID (Personal or Group)

#### Option A: Private Chat (Personal Notification)
1. Search for your bot in Telegram and click **Start** (or send `/start`).
2. Search for `@userinfobot` or `@GetIDsBot` and send `/start`.
3. Note your numeric Chat ID (e.g. `987654321`).
4. Set `TELEGRAM_CHAT_ID=987654321` in your `.env` file.

#### Option B: Private Group (Team / Staff Channel)
1. Create a new Telegram group (e.g. "Amar Dokan — Order Alerts").
2. Add your bot as a member/administrator of the group.
3. Send a test message in the group (e.g. `Hello bot`).
4. In your browser or curl, call:
   ```bash
   https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
5. Look for `"chat":{"id": -1001234567890}` in the JSON response. Group IDs begin with a minus sign `-` or `-100`.
6. Set `TELEGRAM_CHAT_ID=-1001234567890` in your `.env` file.

---

## Notification Message Template
When a verified payment occurs, the bot sends:
```
🛍️ নতুন পেইড অর্ডার — ORD-20240929-1234

👤 গ্রাহক: তানভীর আহমেদ
📞 ফোন: 01700000000
📍 ঠিকানা: বাড়ি ১২, রোড ৫, ধানমন্ডি, ঢাকা

📦 পণ্য:
  • সুন্দরবনের খাঁটি মধু [৫০০ গ্রাম] × 2 = ৳1700
  • সরিষার তেল × 1 = ৳360

💰 পণ্যের মোট:   ৳2060
🚚 ডেলিভারি চার্জ: ৳70
✅ মোট পরিশোধ:   ৳2130

💳 পেমেন্ট: BKASH
🔖 ট্রানজ্যাকশন: 9J47AB12CD
⏰ যাচাইয়ের সময়: 29/09/2024, 03:45:00 PM

🔗 অ্যাডমিন লিংক: https://yourdomain.com/admin/orders/ord_12345
```

---

## Transactional Outbox & Retry Engine
- Notifications are written to the `notification_outbox` table inside the same DB transaction that marks the order `PAID`.
- An automated cron job triggers `/api/cron/notifications` with `Authorization: Bearer <CRON_SECRET>`.
- **Bounded exponential backoff**: 5 maximum attempts with increasing delays (1m, 2m, 4m, 8m, 16m).
- **Graceful degradation**: If Telegram credentials are missing, the job status is set to `NOT_CONFIGURED`. The order remains safely `PAID`, and notifications are **never silently discarded**. Admins can view and manually retry them from `/admin/notifications`.
