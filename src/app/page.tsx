import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export const revalidate = 60; // ISR cache 60s

export default async function HomePage() {
  // Query featured products and categories with fallback
  let featuredProducts: any[] = [];
  let categories: any[] = [];

  try {
    featuredProducts = await db.product.findMany({
      where: {
        status: "PUBLISHED",
        isFeatured: true,
      },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
        category: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    // If no featured products found in DB yet, fetch any published products
    if (featuredProducts.length === 0) {
      featuredProducts = await db.product.findMany({
        where: { status: "PUBLISHED" },
        include: {
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
          category: true,
        },
        take: 8,
        orderBy: { createdAt: "desc" },
      });
    }

    categories = await db.category.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    // Database may not be initialized yet
  }

  // Fallback showcase items for preview before first seed
  const showcaseProducts =
    featuredProducts.length > 0
      ? featuredProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          pricePoisha: p.pricePoisha,
          compareAtPricePoisha: p.compareAtPricePoisha,
          hasVariants: p.hasVariants,
          stockQuantity: p.stockQuantity,
          imageId: p.images[0]?.id || null,
          categoryName: p.category?.name || "জেনারেল",
        }))
      : [
          {
            id: "demo-1",
            name: "খাঁটি সুন্দরবনের প্রাকৃতিক মধু (Pure Honey)",
            slug: "sundarban-pure-honey",
            pricePoisha: BigInt(85000), // 850 BDT
            compareAtPricePoisha: BigInt(99000), // 990 BDT
            hasVariants: true,
            stockQuantity: 25,
            imageId: null,
            categoryName: "অর্গানিক ফুড",
          },
          {
            id: "demo-2",
            name: "প্রিমিয়াম খাঁটি সরিষার তেল (Cold Pressed)",
            slug: "pure-mustard-oil-1l",
            pricePoisha: BigInt(36000), // 360 BDT
            compareAtPricePoisha: BigInt(40000),
            hasVariants: false,
            stockQuantity: 40,
            imageId: null,
            categoryName: "অর্গানিক ফুড",
          },
          {
            id: "demo-3",
            name: "কালিজিরা স্পেশাল সুগন্ধি চাল (Aromatic Rice)",
            slug: "kalijira-rice-5kg",
            pricePoisha: BigInt(65000), // 650 BDT
            compareAtPricePoisha: BigInt(72000),
            hasVariants: false,
            stockQuantity: 18,
            imageId: null,
            categoryName: "খাদ্যপণ্য",
          },
          {
            id: "demo-4",
            name: "হাতে তৈরি ঐতিহ্যবাহী নকশিকাঁথা (Handicraft)",
            slug: "traditional-nakshi-kantha",
            pricePoisha: BigInt(220000), // 2200 BDT
            compareAtPricePoisha: BigInt(260000),
            hasVariants: true,
            stockQuantity: 12,
            imageId: null,
            categoryName: "হস্তশিল্প",
          },
        ];

  const showcaseCategories =
    categories.length > 0
      ? categories
      : [
          { id: "c1", name: "অর্গানিক খাদ্য", slug: "organic-food" },
          { id: "c2", name: "হস্তশিল্প ও ঐতিহ্য", slug: "handicrafts" },
          { id: "c3", name: "প্রাকৃতিক প্রসাধন", slug: "natural-beauty" },
          { id: "c4", name: "চমৎকার উপহার", slug: "gifts-lifestyle" },
        ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 text-white py-16 sm:py-24">
          {/* Subtle background glow */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold-500/15 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-gold-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>১০০% খাঁটি ও গুণগত মানসম্পন্ন দেশীয় পণ্য</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                  সেরা মানের দেশীয় পণ্য,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                    সরাসরি আপনার ঠিকানায়
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                  bKash, Nagad এবং Rocket-এর মাধ্যমে দ্রুত ও ১০০% নিরাপদ অগ্রিম পেমেন্টে ঝামেলামুক্ত কেনাকাটা করুন। দ্রুত ডেলিভারি সমগ্র বাংলাদেশে।
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button
                      variant="gold"
                      size="lg"
                      className="w-full sm:w-auto gap-2 shadow-xl shadow-gold-500/20"
                    >
                      <span>এখনই কেনাকাটা করুন</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Link href="/categories" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10"
                    >
                      ক্যাটাগরি দেখুন
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center sm:text-left">
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">১০০%</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">আসল পণ্য</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">২৪-৪৮ ঘণ্টা</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">ঢাকা ডেলিভারি</p>
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-white">সুরক্ষিত</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">ডিজিটাল পেমেন্ট</p>
                  </div>
                </div>
              </div>

              {/* Hero Visual Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl bg-white/10 p-6 backdrop-blur-xl border border-white/20 shadow-2xl space-y-5">
                  <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950 flex flex-col items-center justify-center text-center p-6 border border-white/10 relative overflow-hidden">
                    <div className="w-16 h-16 rounded-2xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-300 mb-3 shadow-inner">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <span className="text-xs uppercase tracking-widest text-gold-300 font-bold">
                      Amar Dokan
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      ডিজিটাল বাংলাদেশের বিশ্বস্ত বাজার
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>বিকাশ / নগদ / রকেট সাপোর্টেড</span>
                      </span>
                      <span className="text-[10px] text-gold-300 font-bold">
                        সক্রিয়
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-200">
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>টেলিগ্রাম নোটিফিকেশন কনফার্মেশন</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold">
                        ইনস্ট্যান্ট
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                ক্যাটাগরি
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                পণ্য বিভাগসমূহ
              </h2>
            </div>
            <Link
              href="/categories"
              className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
            >
              <span>সকল ক্যাটাগরি</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {showcaseCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group relative flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:border-brand-500 hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white transition-all duration-300">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-brand-700 transition">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-slate-400 mt-1">পণ্য দেখুন →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16 bg-slate-100/60 border-y border-slate-200/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  জনপ্রিয় কালেকশন
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  সেরা পণ্যসমূহ
                </h2>
              </div>
              <Link
                href="/products"
                className="text-xs sm:text-sm font-semibold text-brand-700 hover:text-brand-800 flex items-center gap-1"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {showcaseProducts.map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>

        {/* Policy / Trust Section: Why 100% Prepaid? */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 via-brand-950 to-slate-900 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="max-w-2xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold border border-gold-400/30">
                <CreditCard className="w-3.5 h-3.5" />
                <span>অগ্রিম পেমেন্ট পলিসি</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
                কেন আমরা কেবল অগ্রিম পেমেন্টে অর্ডার গ্রহণ করি?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                জাল অর্ডার প্রতিরোধ করতে এবং প্রকৃত গ্রাহকদের কাছে দ্রুততম সময়ে সর্বোচ্চ মানের পণ্য পৌঁছে দিতে আমাদের সকল অর্ডার bKash, Nagad, অথবা Rocket-এর মাধ্যমে অগ্রিম পরিশোধ করতে হয়।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>কোনো অতিরিক্ত গোপন বা লুকানো চার্জ নেই</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>পেমেন্ট নিশ্চিত হওয়ার সাথে সাথে স্বয়ংক্রিয় অর্ডার প্রসেসিং</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে ১০০% ক্যাশব্যাক নিশ্চয়তা</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>অর্ডার ট্র্যাকিং কোড ও সরাসরি এসএমএস/নোটিফিকেশন</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              সাধারণ জিজ্ঞাসা
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span>কিভাবে পেমেন্ট সম্পন্ন করব?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                পণ্য নির্বাচন করে চেকআউট পৃষ্ঠায় আপনার নাম ও ঠিকানা প্রদান করার পর SSLCommerz গেটওয়ের মাধ্যমে আপনার bKash, Nagad বা Rocket অ্যাকাউন্ট দিয়ে সরাসরি ও নিরাপদে পেমেন্ট করতে পারবেন।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span>ক্যাশ অন ডেলিভারি (COD) কি পাওয়া যাবে?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                না, আমরা ক্যাশ অন ডেলিভারি সাপোর্ট করি না। উন্নত গ্রাহকসেবা ও নিরবচ্ছিন্ন সরবরাহ নিশ্চিত করতে শতভাগ অর্ডার অগ্রিম পরিশোধযোগ্য।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-700 flex-shrink-0" />
                <span>ডেলিভারি পেতে কতদিন সময় লাগবে?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 pl-6 leading-relaxed">
                ঢাকা শহরের ভেতরে সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে সমগ্র বাংলাদেশে ২ থেকে ৪ কার্যদিবসের মধ্যে আপনার দোরগোড়ায় ডেলিভারি পৌঁছে দেওয়া হয়।
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
