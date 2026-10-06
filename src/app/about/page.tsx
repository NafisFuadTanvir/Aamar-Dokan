import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ShieldCheck,
  Truck,
  Heart,
  Star,
  Users,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "আমাদের সম্পর্কে | Amar Dokan",
  description:
    "আমার দোকান — বাংলাদেশের বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম। আমাদের লক্ষ্য, মিশন এবং প্রতিশ্রুতি সম্পর্কে জানুন।",
};

const values = [
  {
    icon: ShieldCheck,
    title: "বিশ্বস্ততা ও স্বচ্ছতা",
    desc: "আমরা প্রতিটি লেনদেনে সম্পূর্ণ স্বচ্ছতা বজায় রাখি। কোনো লুকানো চার্জ নেই, কোনো বিভ্রান্তি নেই।",
  },
  {
    icon: Star,
    title: "মানসম্পন্ন পণ্য",
    desc: "প্রতিটি পণ্য সরাসরি অনুমোদিত উৎস থেকে সংগ্রহ করা হয় এবং গুণগত মান যাচাই করা হয়।",
  },
  {
    icon: Heart,
    title: "গ্রাহক সন্তুষ্টি",
    desc: "আমাদের গ্রাহকই আমাদের সর্বোচ্চ অগ্রাধিকার। প্রতিটি অভিযোগ আমরা গুরুত্বের সাথে দেখি।",
  },
  {
    icon: Truck,
    title: "দ্রুত ও নিরাপদ ডেলিভারি",
    desc: "ঢাকায় ২৪-৪৮ ঘণ্টা এবং সারা বাংলাদেশে ২-৪ কার্যদিবসে ডেলিভারি নিশ্চিত করা হয়।",
  },
];

const stats = [
  { value: "১০০%", label: "খাঁটি পণ্য" },
  { value: "৬৪", label: "জেলায় ডেলিভারি" },
  { value: "২৪/৭", label: "অর্ডার ট্র্যাকিং" },
  { value: "৭ দিন", label: "রিটার্ন পলিসি" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white py-20 sm:py-28">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>আমাদের গল্প</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              আমাদের সম্পর্কে
            </h1>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto">
              আমার দোকান বাংলাদেশের একটি বিশ্বস্ত ই-কমার্স প্ল্যাটফর্ম, যেখানে
              আপনি ঘরে বসেই সেরা মানের দেশীয় পণ্য অর্ডার করতে পারবেন। আমরা
              বিশ্বাস করি প্রযুক্তি ব্যবহার করে সাধারণ মানুষের কেনাকাটাকে
              সহজ, সুলভ এবং নিরাপদ করা সম্ভব।
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
              {stats.map((s) => (
                <div key={s.label} className="py-10 text-center px-4">
                  <p className="text-3xl sm:text-4xl font-extrabold text-brand-800">
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                আমাদের লক্ষ্য
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                বাংলাদেশের প্রতিটি ঘরে সেরা পণ্য পৌঁছে দেওয়া
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                আমার দোকানের যাত্রা শুরু হয়েছিল একটি সহজ স্বপ্ন থেকে — বাংলাদেশের
                প্রতিটি মানুষ যেন ঘরে বসেই বিশ্বমানের কেনাকাটার অভিজ্ঞতা পেতে
                পারেন। ঢাকা থেকে শুরু করে দেশের প্রত্যন্ত অঞ্চল পর্যন্ত আমরা
                প্রতিদিন কাজ করে যাচ্ছি মানুষের জীবনকে একটু সহজ করে দিতে।
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                আমরা শুধু পণ্য বিক্রি করি না — আমরা একটি বিশ্বাসের সম্পর্ক তৈরি করি।
                প্রতিটি পণ্য যাচাই করে, প্রতিটি অর্ডার যত্নসহকারে প্যাক করে এবং
                সময়মতো ডেলিভারি নিশ্চিত করে আমরা আপনার আস্থা অর্জন করতে চাই।
              </p>

              <ul className="space-y-2 pt-2">
                {[
                  "সরাসরি উৎস থেকে সংগৃহীত পণ্য",
                  "SSLCommerz-এর মাধ্যমে ১০০% নিরাপদ পেমেন্ট",
                  "বাংলাদেশের সকল ৬৪ জেলায় ডেলিভারি",
                  "ত্রুটিপূর্ণ পণ্যে ৭ দিনের রিটার্ন নিশ্চয়তা",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual card */}
            <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-slate-900 p-8 text-white space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-gold-300" />
                </div>
                <div>
                  <p className="font-bold text-lg">আমার দোকান</p>
                  <p className="text-xs text-slate-400">বাংলাদেশের বিশ্বস্ত বাজার</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-gold-400/50 pl-4 italic">
                &ldquo;আমরা বিশ্বাস করি সৎ ব্যবসা করলে গ্রাহকের বিশ্বাস আপনাআপনিই আসে।
                তাই আমাদের প্রতিটি পদক্ষেপ স্বচ্ছ, নীতিভিত্তিক এবং গ্রাহকমুখী।&rdquo;
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="font-bold text-white">১০০% প্রিপেইড</p>
                  <p className="text-slate-400 mt-0.5">নিরাপদ অগ্রিম পেমেন্ট</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="font-bold text-white">Telegram নোটিফিকেশন</p>
                  <p className="text-slate-400 mt-0.5">তাৎক্ষণিক অর্ডার আপডেট</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="font-bold text-white">Argon2id</p>
                  <p className="text-slate-400 mt-0.5">সর্বোচ্চ নিরাপদ অ্যাকাউন্ট</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                  <p className="font-bold text-white">PostgreSQL</p>
                  <p className="text-slate-400 mt-0.5">এনক্রিপ্টেড ডেটাবেজ</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-slate-100/60 border-y border-slate-200/70">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                আমাদের মূল্যবোধ
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                আমরা যা বিশ্বাস করি
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map((v) => (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex gap-4 hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center flex-shrink-0">
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {v.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              যোগাযোগ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              আমাদের সাথে কথা বলুন
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "আমাদের ঠিকানা",
                lines: ["ধানমন্ডি, ঢাকা - ১২০৯", "বাংলাদেশ"],
              },
              {
                icon: Phone,
                title: "ফোন নম্বর",
                lines: ["+880 1700-000000", "সকাল ৯টা — রাত ১০টা"],
              },
              {
                icon: Mail,
                title: "ইমেইল",
                lines: ["support@amardokan.com", "আমরা ২৪ ঘণ্টায় উত্তর দিই"],
              },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mx-auto mb-4">
                  <c.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-2">
                  {c.title}
                </h3>
                {c.lines.map((l) => (
                  <p key={l} className="text-xs text-slate-500">
                    {l}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-800 text-white text-sm font-semibold hover:bg-brand-700 transition-colors"
            >
              এখনই কেনাকাটা শুরু করুন →
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
