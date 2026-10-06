# Amar Dokan (আমার দোকান) — Project Handover & Context Document
> **তারিখ:** ২৯ সেপ্টেম্বর ২০২৬  
> **ব্যবহারের নিয়ম:** নতুন জিমেইল (Gmail) বা নতুন চ্যাট সেশনে Antigravity-কে শুধু বলবেন:  
> *"Please read `PROJECT_HANDOVER.md` and continue the work."* — তাহলে সে ঠিক এইখান থেকেই কাজ চালিয়ে নিতে পারবে।

---

## ১. প্রজেক্ট পরিচিতি ও স্ট্যাক (Tech Stack)
* **ফ্রন্টএন্ড ও ব্যাকএন্ড:** Next.js 14 (App Router, Standalone mode) + TypeScript
* **স্টাইলিং:** Tailwind CSS + Radix UI / Lucide React (Bengali-first responsive UI)
* **ডাটাবেজ:** PostgreSQL 16 + Prisma ORM (v5)
* **অথেনটিকেশন:** Auth.js v5 (NextAuth) + Credentials Provider + **Argon2id** পাসওয়ার্ড হ্যাশিং
* **ডকার ও ডেপ্লয়মেন্ট:** Docker Multi-stage build + Docker Compose (Production-ready)

---

## ২. মালিকের দেওয়া বিশেষ রিকোয়ারমেন্ট ও আর্কিটেকচারাল সিদ্ধান্ত (Key Decisions)
1. **টেলিগ্রাম বট নোটিফিকেশন (WhatsApp এর পরিবর্তে):**
   - ব্যাকএন্ড যখন স্বাধীনভাবে পেমেন্ট ভেরিফাই করবে (SSLCommerz IPN এর মাধ্যমে), তখনই নোটিফিকেশন যাবে।
   - টেলিগ্রাম বট ক্রেডেন্সিয়ালস (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) শুধুমাত্র সার্ভার-সাইডে সুরক্ষিত থাকবে।
   - ট্রানজেকশনাল আউটবক্স (Transactional Outbox) প্যাটার্ন ও ব্যাকঅফ রিট্রাই মেকানিজম যুক্ত।
2. **পোস্টগ্রেসকিউএল-এ ছবি সংরক্ষণ (`bytea`):**
   - স্টোরে ৫০টির মতো পণ্য থাকবে, তাই কোনো এক্সটার্নাল ক্লাউড বা Cloudinary রাখা হয়নি।
   - ছবি সরাসরি PostgreSQL-এর `bytea` কলামে জমা থাকে এবং `/api/images/[id]` রুটের মাধ্যমে দ্রুত ক্যাশ হয়ে রেন্ডার হয়।
3. **ঐচ্ছিক ইমেইল (Optional SMTP):**
   - Resend বা কোনো বাধ্যতামূলক থার্ড-পার্টি ইমেইল ডিপেন্ডেন্সি নেই। 
   - ইমেইল কনফিগার না থাকলেও কোনো সমস্যা নেই; অ্যাডমিন প্যানেল থেকে ওয়ান-টাইম সিকিউর পাসওয়ার্ড রিসেট লিংক তৈরি করে কাস্টমারকে শেয়ার করা যায়।
4. **কোনো সিমুলেটেড/ফেইক পেমেন্ট নেই:**
   - ক্রিডেনশিয়াল না থাকলে সরাসরি `NOT_CONFIGURED` দেখাবে এবং ডকুমেন্টেশন নির্দেশ করবে।
5. **ক্যাশ অন ডেলিভারি (COD) বন্ধ:**
   - শতভাগ নিরাপদ ডিজিটাল অগ্রিম পেমেন্ট ভিত্তিক সিস্টেম।

---

## ৩. বর্তমান কাজের অবস্থা (Current Status — 100% Completed)
* **হোম ও শপিং ফ্লো:** প্রোডাক্ট ব্রাউজিং, ভ্যারিয়েন্ট সিলেকশন, কার্ট, চেকআউট সম্পূর্ণ তৈরি।
* **অ্যাডমিন ড্যাশবোর্ড:** `/admin` প্যানেলে অর্ডার ম্যানেজমেন্ট, প্রোডাক্ট যোগ/এডিট, নোটিফিকেশন হিস্ট্রি, ম্যানুয়াল ভেরিফিকেশন।
* **নীতিমালা ও তথ্যবহুল পেজ (সবগুলো তৈরি ও টেস্টেড):**
  - `/about` — আমাদের সম্পর্কে (About Us)
  - `/terms` — শর্তাবলী (Terms & Conditions)
  - `/privacy` — গোপনীয়তা নীতি (Privacy Policy)
  - `/refund-policy` — রিফান্ড ও রিটার্ন নীতি
  - `/shipping-policy` — ডেলিভারি তথ্য
* **ডকার বিল্ড:**
  - Alpine Linux-এ `argon2` নেটিভ কম্পাইলেশন সমস্যার সমাধান করা হয়েছে।
  - `docker-compose.yml` দিয়ে `ecommerce_postgres` এবং `ecommerce_web` উভয় সার্ভিস চালু রয়েছে।

---

## ৪. প্রজেক্ট চালানোর কমান্ডসমূহ (How to Run)

### ডকার দিয়ে চালানো (লোকাল বা VPS):
```bash
# কন্টেইনার স্টার্ট করা
docker compose up -d

# স্ট্যাটাস দেখা
docker compose ps

# লগ চেক করা
docker compose logs -f web

# কন্টেইনার বন্ধ করা
docker compose down
```

### লোকাল ডেভেলপমেন্ট মোডে চালানো (ডকার ছাড়া):
```bash
npm install
npx prisma generate
npm run dev
# ব্রাউজারে: http://localhost:3000
```

---

## ৫. গুরুত্বপূর্ণ ফাইল ও ডিরেক্টরি
* `src/app/` — সব পেজ ও এপিআই রুট
* `src/components/layout/` — `Header.tsx` এবং `Footer.tsx`
* `prisma/schema.prisma` — ডাটাবেজ মডেল
* `docker-compose.yml` ও `Dockerfile` — কন্টেইনারাইজেশন কনফিগারেশন
* `.env.example` — এনভায়রনমেন্ট ভেরিয়েবলের পূর্ণাঙ্গ তালিকা

---

## ৬. পরবর্তী কাজের সুযোগ (Future Next Steps if any)
1. আসল SSLCommerz মার্চেন্ট ক্রেডেনশিয়াল এবং Telegram Bot টোকেন `.env` ফাইলে বসিয়ে লাইভ টেস্ট করা।
2. ভিপিএস (VPS - Ubuntu/Debian) এ কোড ক্লোন করে `docker compose up -d` দিয়ে লাইভ ডোমেইনে ডেপ্লয় করা।
