import React from "react";
import { getPaymentAdapter } from "@/lib/payment";
import { telegramService } from "@/lib/telegram";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Send,
  Mail,
  Database,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const paymentAdapter = getPaymentAdapter();
  const paymentStatus = paymentAdapter.getConfigStatus();
  const telegramStatus = telegramService.getConfigStatus();
  const emailStatus = process.env.EMAIL_SMTP_HOST ? "READY" : "NOT_CONFIGURED";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-white font-bengali">
          স্টোর ও সিস্টেম ইন্টিগ্রেশন সেটিংস
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          তৃতীয় পক্ষের সার্ভিসসমূহের সংযোগ ও কনফিগারেশন অবস্থা পর্যবেক্ষণ করুন
        </p>
      </div>

      {/* Services Status Cards */}
      <div className="space-y-5">
        {/* 1. Payment Gateway */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  পেমেন্ট গেটওয়ে — SSLCommerz
                </h3>
                <p className="text-xs text-slate-400">
                  bKash, Nagad, Rocket এবং কার্ডের মাধ্যমে অগ্রিম ডিজিটাল পেমেন্ট
                </p>
              </div>
            </div>
            <Badge variant={paymentStatus === "READY" ? "success" : "warning"}>
              {paymentStatus}
            </Badge>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">অ্যাডাপ্টার:</span>
              <span className="font-mono">{paymentAdapter.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">স্যান্ডবক্স মোড:</span>
              <span className="font-mono">
                {process.env.SSLCOMMERZ_SANDBOX === "false" ? "False (Production)" : "True (Sandbox)"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">স্টোর আইডি:</span>
              <span className="font-mono">
                {process.env.SSLCOMMERZ_STORE_ID
                  ? `${process.env.SSLCOMMERZ_STORE_ID.slice(0, 3)}****`
                  : "কনফিগার করা নেই"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Telegram Notifications */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  অর্ডার নোটিফিকেশন — Telegram Bot API
                </h3>
                <p className="text-xs text-slate-400">
                  যাচাইকৃত পেইড অর্ডারের নোটিফিকেশন সরাসরি প্রাইভেট চ্যাট/গ্রুপে প্রেরণ
                </p>
              </div>
            </div>
            <Badge variant={telegramStatus === "READY" ? "success" : "warning"}>
              {telegramStatus}
            </Badge>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">বট টোকেন (TELEGRAM_BOT_TOKEN):</span>
              <span className="font-mono">
                {process.env.TELEGRAM_BOT_TOKEN ? "সুরক্ষিতভাবে সেট করা আছে" : "অনুপস্থিত"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">গ্রুপ বা চ্যাট আইডি (TELEGRAM_CHAT_ID):</span>
              <span className="font-mono">
                {process.env.TELEGRAM_CHAT_ID ? "সুরক্ষিতভাবে সেট করা আছে" : "অনুপস্থিত"}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Transactional Email */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  ট্রানজ্যাকশনাল ইমেইল (SMTP — ঐচ্ছিক)
                </h3>
                <p className="text-xs text-slate-400">
                  ইমেইল অনুপস্থিত থাকলেও অ্যাডমিন-এসিস্টেড পাসওয়ার্ড রিসেট সক্রিয় থাকে
                </p>
              </div>
            </div>
            <Badge variant={emailStatus === "READY" ? "success" : "default"}>
              {emailStatus}
            </Badge>
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-xs space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">এসএমটিপি হোস্ট:</span>
              <span className="font-mono">{process.env.EMAIL_SMTP_HOST || "কনফিগার করা নেই (ঐচ্ছিক)"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">প্রেরক (EMAIL_FROM):</span>
              <span className="font-mono">{process.env.EMAIL_FROM || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* 4. PostgreSQL & Image Storage */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  ছবি ও ডাটা স্টোরেজ — PostgreSQL Bytea
                </h3>
                <p className="text-xs text-slate-400">
                  সর্বোচ্চ ৫০টি পণ্যের জন্য সরাসরি ডাটাবেজে চিত্র সংরক্ষণ (≤ ২ MB)
                </p>
              </div>
            </div>
            <Badge variant="success">সক্রিয়</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
