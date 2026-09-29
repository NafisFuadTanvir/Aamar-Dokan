"use client";

import React from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  pricePoisha: bigint | number | string;
  compareAtPricePoisha?: bigint | number | string | null;
  hasVariants?: boolean;
  stockQuantity: number;
  imageId?: string | null;
  categoryName?: string | null;
}

export function ProductCard({
  id,
  name,
  slug,
  pricePoisha,
  compareAtPricePoisha,
  hasVariants = false,
  stockQuantity,
  imageId,
  categoryName,
}: ProductCardProps) {
  const { addItem } = useCart();
  const isOutOfStock = stockQuantity <= 0;

  const currentPrice = Number(pricePoisha);
  const comparePrice = compareAtPricePoisha ? Number(compareAtPricePoisha) : null;
  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      window.location.href = `/products/${slug}`;
      return;
    }
    addItem({
      productId: id,
      name,
      pricePoisha: currentPrice,
      quantity: 1,
      imageId,
      maxStock: stockQuantity,
    });
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      {/* Product Image */}
      <Link
        href={`/products/${slug}`}
        className="relative aspect-square w-full overflow-hidden bg-slate-100 block"
      >
        {imageId ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/api/images/${imageId}`}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <ShoppingBag className="w-12 h-12 stroke-[1.2]" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent && discountPercent > 0 && (
            <Badge variant="danger" className="font-bold text-[11px] shadow-sm">
              {discountPercent}% ছাড়
            </Badge>
          )}
          {hasVariants && (
            <Badge variant="info" className="font-semibold text-[10px] shadow-sm">
              ভ্যারিয়েন্ট
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="danger" className="font-bold text-[11px] shadow-sm">
              স্টক শেষ
            </Badge>
          )}
        </div>

        {/* Hover Quick View Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-md backdrop-blur-sm">
            <Eye className="w-3.5 h-3.5 text-brand-700" />
            <span>বিস্তারিত দেখুন</span>
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 mb-1">
            {categoryName}
          </span>
        )}

        <Link
          href={`/products/${slug}`}
          className="text-sm font-bold text-slate-800 line-clamp-2 hover:text-brand-700 transition"
        >
          {name}
        </Link>

        {/* Pricing */}
        <div className="mt-3 flex items-baseline gap-2">
          {hasVariants && (
            <span className="text-xs text-slate-500 font-medium">শুরু</span>
          )}
          <span className="text-base font-extrabold text-slate-900">
            {formatPrice(currentPrice)}
          </span>
          {comparePrice && comparePrice > currentPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          {hasVariants ? (
            <Link
              href={`/products/${slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 py-2.5 px-3 text-xs font-bold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <span>অপশন নির্বাচন করুন</span>
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 py-2.5 px-3 text-xs font-bold text-white transition hover:bg-brand-800 disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-brand-900/10 active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{isOutOfStock ? "স্টক নেই" : "ব্যাগে যোগ করুন"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
