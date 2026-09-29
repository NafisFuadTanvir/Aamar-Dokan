import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Package, Edit, Trash2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminProductsPage() {
  let products: any[] = [];

  try {
    products = await db.product.findMany({
      include: {
        category: true,
        variants: true,
        images: { take: 1, orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // DB fallback
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-bengali">
            পণ্য ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            মোট {products.length}টি পণ্য নিবন্ধিত রয়েছে (সর্বোচ্চ ৫০টি পণ্যের জন্য অপ্টিমাইজড)
          </p>
        </div>

        <Link href="/admin/products/new">
          <Button variant="gold" size="sm" className="gap-1.5 font-bold">
            <Plus className="w-4 h-4" />
            <span>নতুন পণ্য যোগ করুন</span>
          </Button>
        </Link>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              কোনো পণ্য যোগ করা হয়নি
            </p>
            <p className="text-xs text-slate-500">
              উপরে &quot;নতুন পণ্য যোগ করুন&quot; বাটনে ক্লিক করে প্রথম পণ্য যুক্ত করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">ছবি</th>
                  <th className="p-4">পণ্যের নাম</th>
                  <th className="p-4">ক্যাটাগরি</th>
                  <th className="p-4">মূল্য (BDT)</th>
                  <th className="p-4">স্টক</th>
                  <th className="p-4">ভ্যারিয়েন্ট</th>
                  <th className="p-4">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/40">
                    <td className="p-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden flex items-center justify-center">
                        {p.images[0] ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={`/api/images/${p.images[0].id}`}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-slate-600" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-white">
                      <div>{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {p.slug}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {p.category?.name || "সাধারণ"}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {formatPrice(p.pricePoisha)}
                    </td>
                    <td className="p-4">
                      {p.stockQuantity <= 5 ? (
                        <span className="text-amber-400 font-bold">
                          {p.stockQuantity} (কম)
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-bold">
                          {p.stockQuantity}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {p.hasVariants ? (
                        <Badge variant="info">
                          {p.variants.length} টি ভ্যারিয়েন্ট
                        </Badge>
                      ) : (
                        <span className="text-slate-500">একক পণ্য</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={p.status === "PUBLISHED" ? "success" : "default"}
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
