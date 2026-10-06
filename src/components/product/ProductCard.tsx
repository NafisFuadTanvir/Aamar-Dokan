"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Eye, Leaf, CheckCircle2 } from "lucide-react";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  pricePoisha: bigint | number | string;
  compareAtPricePoisha?: bigint | number | string | null;
  hasVariants?: boolean;
  stockQuantity: number;
  imageId?: string | null;
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
}: ProductCardProps) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const isOutOfStock = stockQuantity <= 0;

  const currentPrice = Number(pricePoisha);
  const comparePrice = compareAtPricePoisha ? Number(compareAtPricePoisha) : null;
  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : null;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) {
      window.location.href = `/products/${slug}`;
      return;
    }
    setAdding(true);
    addItem({
      productId: id,
      name,
      pricePoisha: currentPrice,
      quantity: 1,
      imageId,
      maxStock: stockQuantity,
    });
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-cream-200/80 card-premium">

      {/* ── Image Zone ──────────────────────────────────────────────────────── */}
      <Link
        href={`/products/${slug}`}
        className="relative w-full overflow-hidden bg-cream-50 block"
        aria-label={name}
      >
        {imageId ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/api/images/${imageId}`}
            alt={name}
            className="w-full h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-52 w-full items-center justify-center bg-gradient-to-br from-cream-100 to-cream-200">
            <Leaf className="w-10 h-10 text-cream-400 stroke-[1.2]" />
          </div>
        )}

        {/* ── Badges ────────────────────────────────────────────────────────── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent && discountPercent > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-saffron-500 text-white text-[11px] font-black shadow-md">
              -{discountPercent}% ছাড়
            </span>
          )}
          {hasVariants && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-navy-700 text-white text-[10px] font-bold shadow-sm">
              ভ্যারিয়েন্ট
            </span>
          )}
          {isOutOfStock && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold shadow-sm">
              স্টক শেষ
            </span>
          )}
        </div>

        {/* ── Hover Overlay ─────────────────────────────────────────────────── */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/95 text-navy-800 text-xs font-bold shadow-lg backdrop-blur-sm translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
              <Eye className="w-3.5 h-3.5 text-saffron-600" />
              বিস্তারিত দেখুন
            </span>
          </div>
        </div>
      </Link>

      {/* ── Content Zone ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col p-4 gap-2.5">

        {/* Name */}
        <Link
          href={`/products/${slug}`}
          className="text-sm font-bold text-navy-900 line-clamp-2 hover:text-saffron-700 transition-colors duration-200 leading-snug"
        >
          {name}
        </Link>

        {/* Authenticity tag */}
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-herbal-500 flex-shrink-0" />
          <span className="text-[10px] text-herbal-700 font-semibold">১০০% খাঁটি ও প্রাকৃতিক</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          {hasVariants && (
            <span className="text-[10px] text-navy-500 font-medium">শুরু</span>
          )}
          <span className="text-lg font-black text-navy-900">
            {formatPrice(currentPrice)}
          </span>
          {comparePrice && comparePrice > currentPrice && (
            <span className="text-xs text-navy-400 line-through font-medium">
              {formatPrice(comparePrice)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <div className="pt-2 border-t border-cream-200">
          {hasVariants ? (
            <Link
              href={`/products/${slug}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-navy-200 py-2.5 text-xs font-bold text-navy-700 transition-all hover:border-saffron-400 hover:text-saffron-700 hover:bg-saffron-50"
            >
              অপশন নির্বাচন করুন
            </Link>
          ) : (
            <button
              onClick={handleQuickAdd}
              disabled={isOutOfStock || adding}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 active:scale-[0.97] ${
                adding
                  ? "bg-herbal-600 text-white"
                  : isOutOfStock
                  ? "bg-cream-200 text-navy-400 cursor-not-allowed"
                  : "btn-saffron"
              }`}
            >
              {adding ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>যোগ হয়েছে!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isOutOfStock ? "স্টক নেই" : "ব্যাগে যোগ করুন"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
