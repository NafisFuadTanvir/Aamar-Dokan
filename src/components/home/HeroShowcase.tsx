"use client";

import React from "react";
import Link from "next/link";
import {
  Star,
  Sparkles,
  ShieldCheck,
  Truck,
  ArrowRight,
  ShoppingBag,
  Zap,
  CheckCircle2,
  RotateCcw,
  BadgeCheck,
  Headphones,
  PackageCheck,
} from "lucide-react";

export function HeroShowcase() {
  const highlights = [
    {
      icon: ShieldCheck,
      color: "from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30",
      title: "১০০% প্রিমিয়াম ও বাছাইকৃত পণ্য",
      desc: "প্রতিটি পণ্যের গুণগত মান কঠোরভাবে পরীক্ষিত ও নিশ্চিত",
    },
    {
      icon: Truck,
      color: "from-blue-500/20 to-cyan-500/10 text-blue-400 border-blue-500/30",
      title: "সুপারফাস্ট এক্সপ্রেস ডেলিভারি",
      desc: "ঢাকা ও সমগ্র বাংলাদেশের যেকোনো প্রান্তে দ্রুততম ডেলিভারি",
    },
    {
      icon: RotateCcw,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
      title: "সহজ ও ঝামেলামুক্ত রিটার্ন পলিসি",
      desc: "পণ্য পছন্দ না হলে অথবা সমস্যা থাকলে দ্রুত সমাধান নিশ্চয়তা",
    },
    {
      icon: Headphones,
      color: "from-purple-500/20 to-pink-500/10 text-purple-400 border-purple-500/30",
      title: "২৪/৭ ডেডিকেটেড গ্রাহক সেবা",
      desc: "অর্ডার সংক্রান্ত যেকোনো সহযোগিতায় আমাদের টিম সদা প্রস্তুত",
    },
  ];

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      {/* Background ambient multi-colored aura glow */}
      <div className="animate-pulse-glow absolute -inset-4 rounded-3xl bg-gradient-to-tr from-brand-600/30 via-gold-500/20 to-emerald-500/30 blur-2xl opacity-75 pointer-events-none" />

      {/* Main Glass Showcase Container */}
      <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:border-gold-400/40">
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center justify-between pb-5 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-gold-400 via-amber-500 to-gold-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-gold-500/30">
              <ShoppingBag className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-white tracking-wide">
                  স্মার্ট অনলাইন শপিং
                </span>
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-400">
                বিশ্বস্ত ও আধুনিক কেনাকাটার ঠিকানা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>সক্রিয় স্টোর</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="relative z-10 space-y-3 mb-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group flex items-start gap-3.5 p-3 sm:p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
              >
                <div
                  className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} border flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-gold-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-300/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button inside Card */}
        <div className="relative z-10 pt-2">
          <Link href="/products" className="block">
            <button className="group relative w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-gold-400 via-amber-400 to-gold-500 hover:from-gold-300 hover:to-amber-400 shadow-xl shadow-gold-500/25 hover:shadow-gold-500/40 hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
              <PackageCheck className="w-4 h-4" />
              <span>সকল পণ্য এক্সপ্লোর করুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </Link>
        </div>
      </div>

      {/* Floating Modern Micro-Card 1: 5-Star Social Proof */}
      <div className="hidden sm:flex animate-float absolute -top-5 -left-5 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/20 shadow-xl shadow-slate-950/60">
        <div className="flex -space-x-2 overflow-hidden">
          <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center text-[11px] font-bold text-white">
            ★
          </div>
          <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[11px] font-bold text-white">
            ✓
          </div>
          <div className="inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-[11px] font-bold text-white">
            ♥
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-extrabold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>৪.৯ / ৫.০ রেটিং</span>
          </div>
          <p className="text-[10px] text-slate-300 font-medium">
            ১০,০০০+ গ্রাহকের আস্থা
          </p>
        </div>
      </div>

      {/* Floating Modern Micro-Card 2: Express Delivery Badge */}
      <div className="animate-float-delayed absolute -bottom-5 -right-2 sm:-right-4 z-20 px-4 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-gold-400/30 shadow-xl shadow-slate-950/70 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300">
          <Zap className="w-4 h-4 text-gold-400" />
        </div>
        <div>
          <p className="text-xs font-bold text-white">২৪-৪৮ ঘণ্টায় ডেলিভারি</p>
          <p className="text-[10px] text-emerald-300 font-medium">
            সারা বাংলাদেশে হোম ডেলিভারি
          </p>
        </div>
      </div>
    </div>
  );
}
