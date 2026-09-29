import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/product/SortSelect";
import { db } from "@/lib/db";
import Link from "next/link";
import { Filter, SlidersHorizontal } from "lucide-react";

export const revalidate = 30;

interface ProductsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categorySlug = searchParams.category;
  const searchQuery = searchParams.search;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 16;
  const skip = (page - 1) * pageSize;

  let whereClause: any = {
    status: "PUBLISHED",
  };

  if (categorySlug) {
    whereClause.category = { slug: categorySlug };
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { pricePoisha: "asc" };
  if (sort === "price-desc") orderBy = { pricePoisha: "desc" };
  if (sort === "name") orderBy = { name: "asc" };

  let products: any[] = [];
  let totalCount = 0;
  let categories: any[] = [];

  try {
    const [fetchedProducts, count, fetchedCategories] = await Promise.all([
      db.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
        },
        orderBy,
        skip,
        take: pageSize,
      }),
      db.product.count({ where: whereClause }),
      db.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
    ]);

    products = fetchedProducts;
    totalCount = count;
    categories = fetchedCategories;
  } catch (e) {
    // Database fallback
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-bengali">
              {categorySlug
                ? categories.find((c) => c.slug === categorySlug)?.name ||
                  "ক্যাটাগরির পণ্যসমূহ"
                : searchQuery
                ? `অনুসন্ধানের ফলাফল: "${searchQuery}"`
                : "সকল পণ্যসমূহ"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              মোট {totalCount}টি পণ্য পাওয়া গেছে
            </p>
          </div>

          {/* Controls: Category Filter & Sort */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            <SortSelect defaultValue={sort} />
          </div>
        </div>

        {/* Layout: Sidebar Categories + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-700" />
                <span>ক্যাটাগরি সমূহ</span>
              </h2>

              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link
                    href="/products"
                    className={`block px-3 py-2 rounded-xl font-medium transition ${
                      !categorySlug
                        ? "bg-brand-50 text-brand-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    সকল পণ্য
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/products?category=${c.slug}`}
                      className={`block px-3 py-2 rounded-xl font-medium transition ${
                        categorySlug === c.slug
                          ? "bg-brand-50 text-brand-700 font-bold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200/80 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    কোনো পণ্য পাওয়া যায়নি
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    অন্য ফিল্টার বা ক্যাটাগরি অনুসন্ধান করে দেখতে পারেন
                  </p>
                </div>
                <Link
                  href="/products"
                  className="px-4 py-2 rounded-xl bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800 transition"
                >
                  সকল পণ্য দেখুন
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    categoryName={p.category?.name || null}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-6 border-t border-slate-200">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                  <Link
                    key={pNum}
                    href={`/products?page=${pNum}${
                      categorySlug ? `&category=${categorySlug}` : ""
                    }${searchQuery ? `&search=${searchQuery}` : ""}${
                      sort ? `&sort=${sort}` : ""
                    }`}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      page === pNum
                        ? "bg-brand-700 text-white"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pNum}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
