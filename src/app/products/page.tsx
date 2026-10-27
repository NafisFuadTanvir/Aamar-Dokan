import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { db } from "@/lib/db";
import Link from "next/link";
import { Leaf, SlidersHorizontal } from "lucide-react";

import { expandSearchTerms } from "@/lib/search/bengaliSearch";
import { Sparkles } from "lucide-react";

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: {
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const searchQuery = searchParams.search;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 16;
  const skip = (page - 1) * pageSize;

  let whereClause: any = { status: "PUBLISHED" };
  let expandedInfo: ReturnType<typeof expandSearchTerms> | null = null;

  if (searchQuery && searchQuery.trim()) {
    expandedInfo = expandSearchTerms(searchQuery.trim());
    const terms = expandedInfo.terms;

    const orConditions: any[] = [];
    for (const term of terms) {
      if (!term) continue;
      orConditions.push({ name: { contains: term, mode: "insensitive" } });
      orConditions.push({ shortDescription: { contains: term, mode: "insensitive" } });
      orConditions.push({ description: { contains: term, mode: "insensitive" } });
      orConditions.push({ category: { name: { contains: term, mode: "insensitive" } } });
    }

    if (orConditions.length > 0) {
      whereClause.OR = orConditions;
    }
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { pricePoisha: "asc" };
  if (sort === "price-desc") orderBy = { pricePoisha: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  let products: any[] = [];
  let totalCount = 0;

  try {
    const [fetchedProducts, count] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      db.product.count({ where: whereClause }),
    ]);
    products = fetchedProducts;
    totalCount = count;
  } catch (_e) {}

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cream-200">
          <div>
            <div className="section-label mb-2 w-fit">
              <Leaf className="w-3.5 h-3.5 text-saffron-600" />
              হার্বাল কালেকশন
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
              {searchQuery
                ? `অনুসন্ধানের ফলাফল: "${searchQuery}"`
                : "সকল পণ্যসমূহ"}
            </h1>
            <p className="text-xs sm:text-sm text-navy-500 mt-1">
              মোট {totalCount}টি পণ্য পাওয়া গেছে
            </p>

            {/* Multilingual Match Badges */}
            {expandedInfo && expandedInfo.terms.length > 1 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2">
                <span className="text-[11px] font-semibold text-navy-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-saffron-500" />
                  সম্পর্কিত কীওয়ার্ড:
                </span>
                {expandedInfo.terms.slice(0, 5).map((term) => (
                  <Link
                    key={term}
                    href={`/products?search=${encodeURIComponent(term)}`}
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium transition ${
                      term.toLowerCase() === (searchQuery ?? "").toLowerCase()
                        ? "bg-saffron-100 text-saffron-800 border border-saffron-300"
                        : "bg-white border border-cream-300 text-navy-600 hover:bg-cream-100 hover:text-navy-900"
                    }`}
                  >
                    {term}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <SortSelect defaultValue={sort} />
          </div>
        </div>

        {/* Products Grid — full width, no sidebar */}
        <div className="pt-8">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 sm:p-16 bg-white rounded-3xl border border-cream-200 text-center space-y-4 card-premium">
              <div className="w-16 h-16 rounded-3xl bg-cream-100 flex items-center justify-center">
                <SlidersHorizontal className="w-8 h-8 text-cream-400" />
              </div>
              <div>
                <h3 className="text-base font-black text-navy-800">
                  কোনো পণ্য পাওয়া যায়নি
                </h3>
                <p className="text-xs text-navy-500 mt-1 max-w-md mx-auto">
                  {searchQuery
                    ? `"${searchQuery}" এর জন্য কোনো পণ্য পাওয়া যায়নি। আপনি বাংলা, ইংরেজি অথবা বাংলিশে লিখে দেখতে পারেন (যেমন: modhu, honey, সরিষার তেল, nakshi kantha)।`
                    : "শীঘ্রই নতুন পণ্য যোগ হবে"}
                </p>
              </div>

              {/* Popular quick searches */}
              <div className="pt-2">
                <p className="text-[11px] font-bold text-navy-400 mb-2 uppercase tracking-wider">
                  জনপ্রিয় অনুসন্ধান
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 max-w-md">
                  {[
                    { label: "মধু (Honey)", query: "মধু" },
                    { label: "সরিষার তেল (Mustard Oil)", query: "সরিষা" },
                    { label: "কালোজিরা (Black Seed)", query: "কালোজিরা" },
                    { label: "নকশিকাঁথা (Kantha)", query: "নকশিকাঁথা" },
                    { label: "ঘি (Ghee)", query: "ঘি" },
                    { label: "অর্গানিক ফুড", query: "organic" },
                  ].map((s) => (
                    <Link
                      key={s.query}
                      href={`/products?search=${encodeURIComponent(s.query)}`}
                      className="px-2.5 py-1 rounded-lg bg-cream-100 hover:bg-cream-200 border border-cream-300 text-[11px] font-medium text-navy-700 transition"
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>

              {searchQuery && (
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="px-5 py-2 rounded-xl btn-navy text-xs font-bold inline-block"
                  >
                    সকল পণ্য দেখুন
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  slug={p.slug}
                  pricePoisha={p.pricePoisha}
                  compareAtPricePoisha={p.compareAtPricePoisha}
                  hasVariants={p.hasVariants}
                  stockQuantity={p.stockQuantity}
                  imageId={p.images[0]?.id || null}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-cream-200">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                <Link
                  key={pNum}
                  href={`/products?page=${pNum}${searchQuery ? `&search=${searchQuery}` : ""}${sort ? `&sort=${sort}` : ""}`}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                    page === pNum
                      ? "btn-saffron"
                      : "bg-white border border-cream-200 text-navy-700 hover:bg-cream-50"
                  }`}
                >
                  {pNum}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
