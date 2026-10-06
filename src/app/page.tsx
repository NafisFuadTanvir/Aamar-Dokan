import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { db } from "@/lib/db";
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ShoppingBag,
  HelpCircle,
  CreditCard,
  CheckCircle2,
  Leaf,
  Star,
  Truck,
  Award,
  FlaskConical,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let featuredProducts: any[] = [];

  try {
    featuredProducts = await db.product.findMany({
      where: { status: "PUBLISHED" },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      take: 8,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (_e) {}

  const showcaseProducts = featuredProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    pricePoisha: p.pricePoisha,
    compareAtPricePoisha: p.compareAtPricePoisha,
    hasVariants: p.hasVariants,
    stockQuantity: p.stockQuantity,
    imageId: p.images[0]?.id || null,
  }));


  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1">

        {/* ══════════════════════════════════════════════════
            HERO — Deep Navy + Saffron + Herbal Green
        ══════════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-navy-gradient text-white">
          {/* Ambient orbs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="animate-pulse-glow absolute -top-32 -left-32 w-[36rem] h-[36rem] rounded-full bg-saffron-500/10 blur-3xl" />
            <div
              className="animate-pulse-glow absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-herbal-500/10 blur-3xl"
              style={{ animationDelay: "2.5s" }}
            />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-saffron-600/8 blur-3xl" />
          </div>

          {/* Decorative leaf pattern (top-right) */}
          <div className="absolute top-8 right-0 opacity-5 pointer-events-none select-none text-[14rem] leading-none font-black text-herbal-400">
            🌿
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Left — Text */}
              <div className="lg:col-span-7 space-y-7 text-center lg:text-left">

                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-saffron-400/30 text-saffron-300 text-xs font-bold tracking-wide shadow-sm animate-rise-in">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-400" />
                  </span>
                  <Leaf className="w-3.5 h-3.5 text-herbal-400" />
                  <span>বাংলাদেশের #১ বিশ্বস্ত হার্বাল অনলাইন শপ</span>
                </div>

                {/* Headline with High-Contrast Crisp Modern Typography */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.2] animate-rise-in">
                  <span className="block text-white drop-shadow-[0_2px_16px_rgba(255,255,255,0.25)]">
                    প্রকৃতির সেরা শক্তি,
                  </span>
                  <span className="block mt-2.5 bg-gradient-to-r from-amber-300 via-saffron-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_4px_30px_rgba(249,115,22,0.4)]">
                    আপনার সুস্বাস্থ্যের জন্য
                  </span>
                </h1>

                {/* Subheadline with crystal-clear readability */}
                <p className="text-base sm:text-lg text-slate-100 max-w-xl mx-auto lg:mx-0 leading-[1.8] font-normal tracking-wide drop-shadow-sm">
                  ১০০% খাঁটি ও অর্গানিক সার্টিফাইড হার্বাল পণ্য — সরাসরি প্রকৃতি থেকে আপনার দোরগোড়ায়। নিরাপদ পেমেন্ট, দ্রুত ডেলিভারি।
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
                  <Link href="/products" className="w-full sm:w-auto">
                    <button className="btn-saffron w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm font-bold shadow-glow-saffron hover:scale-[1.02] active:scale-[0.98] transition-all">
                      <ShoppingBag className="w-5 h-5" />
                      <span>এখনই কেনাকাটা করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <Link href="/orders/track" className="w-full sm:w-auto">
                    <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-sm font-bold border border-white/30 text-white hover:bg-white/15 hover:border-white/50 backdrop-blur-md transition-all">
                      <Zap className="w-4 h-4 text-saffron-400" />
                      <span>অর্ডার ট্র্যাক করুন</span>
                    </button>
                  </Link>
                </div>

                {/* Stats row */}
                <div className="pt-7 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-8">
                  {[
                    { icon: ShieldCheck, val: "১০০%", label: "অর্গানিক সার্টিফাইড", color: "text-herbal-400" },
                    { icon: Zap, val: "২৪–৪৮", label: "ঘণ্টায় ডেলিভারি", color: "text-saffron-400" },
                    { icon: Star, val: "১০,০০০+", label: "সন্তুষ্ট গ্রাহক", color: "text-saffron-300" },
                  ].map(({ icon: Icon, val, label, color }) => (
                    <div key={val} className="space-y-1 text-center lg:text-left">
                      <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{val}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium leading-normal">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Trust Cards Stack */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm space-y-3.5">
                  {/* Floating trust cards with high contrast */}
                  {[
                    { icon: Leaf, title: "১০০% অর্গানিক", desc: "কোনো কৃত্রিম রং বা সংরক্ষক নেই", bg: "bg-herbal-950/40 border-herbal-500/30 text-white", iconColor: "text-herbal-400" },
                    { icon: FlaskConical, title: "ল্যাব টেস্টেড", desc: "প্রতিটি ব্যাচ সার্টিফাইড ল্যাবে পরীক্ষিত", bg: "bg-saffron-950/40 border-saffron-500/30 text-white", iconColor: "text-saffron-400" },
                    { icon: Award, title: "সেরা মান নিয়ন্ত্রণ", desc: "ISO সার্টিফাইড প্যাকেজিং ও প্রক্রিয়াজাতকরণ", bg: "bg-navy-800/60 border-sky-400/30 text-white", iconColor: "text-sky-400" },
                    { icon: Truck, title: "দ্রুত ডেলিভারি", desc: "সারা বাংলাদেশে ২৪–৭২ ঘণ্টায়", bg: "bg-amber-950/40 border-amber-400/30 text-white", iconColor: "text-amber-300" },
                  ].map((card, i) => (
                    <div
                      key={card.title}
                      className={`flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-lg ${card.bg} animate-float`}
                      style={{ animationDelay: `${i * 0.8}s`, animationDuration: `${5 + i}s` }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white tracking-wide">{card.title}</p>
                        <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            TRUST BADGE STRIP
        ══════════════════════════════════════════════════ */}
        <section className="bg-white border-y border-cream-200 py-4 overflow-hidden">
          <div className="flex items-center gap-12 animate-marquee marquee-track whitespace-nowrap">
            {[...Array(2)].map((_, rep) =>
              [
                { icon: ShieldCheck, text: "১০০% আসল ও প্রাকৃতিক পণ্য" },
                { icon: Truck, text: "সারাদেশে দ্রুত ডেলিভারি" },
                { icon: Leaf, text: "অর্গানিক সার্টিফাইড" },
                { icon: CreditCard, text: "bKash · Nagad · Rocket পেমেন্ট" },
                { icon: Award, text: "ল্যাব টেস্টেড মানসম্পন্ন পণ্য" },
                { icon: Star, text: "১০,০০০+ সন্তুষ্ট গ্রাহক" },
              ].map(({ icon: Icon, text }) => (
                <span
                  key={`${text}-${rep}`}
                  className="inline-flex items-center gap-2 text-navy-700 text-xs font-bold"
                >
                  <Icon className="w-4 h-4 text-saffron-500 flex-shrink-0" />
                  {text}
                  <span className="text-cream-400 ml-8">✦</span>
                </span>
              ))
            )}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FEATURED PRODUCTS
        ══════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
            <div>
              <div className="section-label mb-3">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                জনপ্রিয় কালেকশন
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                আমাদের সেরা পণ্যসমূহ
              </h2>
              <p className="text-sm text-navy-500 mt-2 max-w-lg">
                প্রকৃতি থেকে সংগ্রহ করা, বিশেষজ্ঞদের দ্বারা পরীক্ষিত হার্বাল পণ্য।
              </p>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-saffron-600 hover:text-saffron-700 group whitespace-nowrap"
            >
              সব পণ্য দেখুন
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {showcaseProducts.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-cream-100 flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-cream-400" />
              </div>
              <p className="text-navy-500 font-semibold">শীঘ্রই নতুন পণ্য আসছে...</p>
              <p className="text-xs text-navy-400">আমাদের কালেকশন তৈরি হচ্ছে। শীঘ্রই লাইভ হবে!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {showcaseProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="text-center mt-10">
            <Link href="/products">
              <button className="btn-navy inline-flex items-center gap-3 px-8 py-3.5 rounded-2xl text-sm font-bold">
                <ShoppingBag className="w-4 h-4 text-saffron-400" />
                সকল পণ্য দেখুন
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            WHY CHOOSE US — 3 Column Feature Grid
        ══════════════════════════════════════════════════ */}
        <section className="bg-white py-16 border-y border-cream-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="section-label mb-3 mx-auto w-fit">
                <Award className="w-3.5 h-3.5 text-saffron-600" />
                কেন আমাদের বেছে নেবেন
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
                আমাদের প্রতিশ্রুতি
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Leaf,
                  title: "১০০% প্রাকৃতিক",
                  desc: "কোনো কৃত্রিম রং, প্রিজার্ভেটিভ বা কেমিক্যাল ব্যবহার করা হয় না।",
                  bg: "bg-herbal-50",
                  iconBg: "bg-herbal-100",
                  iconColor: "text-herbal-700",
                },
                {
                  icon: FlaskConical,
                  title: "ল্যাব পরীক্ষিত",
                  desc: "প্রতিটি পণ্য সার্টিফাইড ল্যাবে মান নিয়ন্ত্রণ পরীক্ষার পর বিক্রয় করা হয়।",
                  bg: "bg-saffron-50",
                  iconBg: "bg-saffron-100",
                  iconColor: "text-saffron-700",
                },
                {
                  icon: Truck,
                  title: "দ্রুত ডেলিভারি",
                  desc: "ঢাকায় ২৪ ঘণ্টা ও সারাদেশে ৪৮–৭২ ঘণ্টার মধ্যে ডেলিভারি নিশ্চিত।",
                  bg: "bg-navy-50",
                  iconBg: "bg-navy-100",
                  iconColor: "text-navy-700",
                },
                {
                  icon: ShieldCheck,
                  title: "১০০% মানি-ব্যাক",
                  desc: "পণ্যে কোনো সমস্যা হলে বিনা প্রশ্নে সম্পূর্ণ অর্থ ফেরত দেওয়া হবে।",
                  bg: "bg-cream-50",
                  iconBg: "bg-cream-200",
                  iconColor: "text-navy-700",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`${item.bg} rounded-3xl p-6 border border-cream-200/80 card-premium group cursor-default`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300`}>
                    <item.icon className={`w-6 h-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="text-sm font-black text-navy-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-navy-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            PREPAYMENT POLICY SECTION
        ══════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-navy-gradient p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-navy-900/30">
            {/* Decorative orbs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-48 h-48 rounded-full bg-herbal-500/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left text */}
              <div className="space-y-5">
                <div className="section-label bg-saffron-500/15 border-saffron-400/30 text-saffron-300 w-fit">
                  <CreditCard className="w-3.5 h-3.5" />
                  অগ্রিম পেমেন্ট পলিসি
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  কেন আমরা শতভাগ অগ্রিম পেমেন্টে অর্ডার নিই?
                </h2>
                <p className="text-sm text-navy-300 leading-relaxed">
                  ভুয়া অর্ডার প্রতিরোধ করতে এবং আপনার কাছে দ্রুততম সময়ে সর্বোচ্চ মানের পণ্য পৌঁছে দিতে bKash, Nagad বা Rocket-এ অগ্রিম পেমেন্ট নেওয়া হয়।
                </p>
              </div>

              {/* Right checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "কোনো লুকানো ডেলিভারি চার্জ নেই",
                  "পেমেন্টের সাথে সাথে প্যাকেজিং শুরু",
                  "ত্রুটিপূর্ণ পণ্যে ১০০% ক্যাশব্যাক",
                  "লাইভ অর্ডার ট্র্যাকিং সুবিধা",
                  "SMS ও ইমেইল নোটিফিকেশন",
                  "বিশ্বস্ত কুরিয়ার পার্টনার",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2.5 bg-white/5 rounded-xl p-3 border border-white/8">
                    <CheckCircle2 className="w-4 h-4 text-herbal-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-navy-200 font-medium leading-snug">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════
            FAQ
        ══════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 bg-white border-t border-cream-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="section-label mb-3 mx-auto w-fit">
                <HelpCircle className="w-3.5 h-3.5 text-saffron-600" />
                সাধারণ জিজ্ঞাসা
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900">
                প্রায়ই জিজ্ঞেস করা প্রশ্ন
              </h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "কিভাবে পেমেন্ট সম্পন্ন করব?",
                  a: "চেকআউট পৃষ্ঠায় আপনার তথ্য দেওয়ার পর SSLCommerz গেটওয়ের মাধ্যমে bKash, Nagad বা Rocket দিয়ে সরাসরি পেমেন্ট করতে পারবেন।",
                },
                {
                  q: "ক্যাশ অন ডেলিভারি কি আছে?",
                  a: "না, আমরা ক্যাশ অন ডেলিভারি সমর্থন করি না। সেরা সেবা ও মান নিশ্চিত করতে শতভাগ অগ্রিম পেমেন্ট প্রয়োজন।",
                },
                {
                  q: "ডেলিভারি পেতে কতদিন সময় লাগে?",
                  a: "ঢাকার ভেতরে ২৪–৪৮ ঘণ্টা, সারাদেশে ৩–৫ কার্যদিবসের মধ্যে পৌঁছে দেওয়া হয়।",
                },
                {
                  q: "পণ্য কি সত্যিই অর্গানিক ও পরীক্ষিত?",
                  a: "হ্যাঁ! আমাদের প্রতিটি পণ্য সরাসরি প্রাকৃতিক উৎস থেকে সংগ্রহ করা এবং সার্টিফাইড ল্যাবে মান পরীক্ষার পর প্যাকেজিং করা হয়।",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="p-5 sm:p-6 rounded-2xl bg-cream-50 border border-cream-200 hover:border-saffron-300 hover:shadow-card transition-all duration-200 group"
                >
                  <h3 className="text-sm font-black text-navy-900 flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-saffron-100 text-saffron-700 text-xs font-black flex items-center justify-center group-hover:bg-saffron-500 group-hover:text-white transition-colors">
                      {i + 1}
                    </span>
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-navy-600 pl-9 mt-2.5 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
