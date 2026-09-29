import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { ShoppingBag, ArrowRight } from "lucide-react";

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: any[] = [];

  try {
    categories = await db.category.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { products: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: { sortOrder: "asc" },
    });
  } catch (e) {
    // DB fallback
  }

  const list =
    categories.length > 0
      ? categories
      : [
          { id: "c1", name: "অর্গানিক ফুড ও মধু", slug: "organic-food", _count: { products: 12 } },
          { id: "c2", name: "হস্তশিল্প ও নকশিকাঁথা", slug: "handicrafts", _count: { products: 8 } },
          { id: "c3", name: "প্রাকৃতিক রূপচর্চা", slug: "natural-beauty", _count: { products: 6 } },
          { id: "c4", name: "ঐতিহ্যবাহী পোশাক ও উপহার", slug: "gifts-lifestyle", _count: { products: 10 } },
        ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            কালেকশন
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            পণ্য ক্যাটাগরি সমূহ
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            আপনার পছন্দের বিভাগ অনুযায়ী সেরা মানের পণ্য সহজে খুঁজে নিন
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {list.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:border-brand-600 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-brand-700 group-hover:text-white transition-all duration-300">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition">
                {cat.name}
              </h2>
              <span className="text-xs text-slate-400 mt-1">
                {cat._count?.products || 0} টি পণ্য
              </span>
              <span className="mt-4 text-xs font-semibold text-brand-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>পণ্য দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
