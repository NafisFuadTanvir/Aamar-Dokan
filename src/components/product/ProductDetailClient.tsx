"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import {
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Star,
  Send,
  CheckCircle2,
  Clock,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ProductReviewsSection } from "./ProductReviewsSection";

export interface VariantType {
  id: string;
  sku?: string | null;
  label: string;
  attributeName?: string | null;
  attributeValue?: string | null;
  pricePoisha: number | bigint;
  compareAtPricePoisha?: number | bigint | null;
  stockQuantity: number;
  isActive: boolean;
}

export interface ImageType {
  id: string;
  altText?: string | null;
}

export interface ReviewType {
  id: string;
  rating: number;
  title?: string | null;
  comment: string;
  createdAt: string | Date;
  user?: {
    name?: string | null;
    phone?: string | null;
    orders?: { orderNumber: string }[];
  } | null;
  isVerifiedPurchase: boolean;
  orderNumber?: string | null;
  phone?: string | null;
}

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    sku?: string | null;
    shortDescription?: string | null;
    description: string;
    pricePoisha: number | bigint;
    compareAtPricePoisha?: number | bigint | null;
    stockQuantity: number;
    hasVariants: boolean;
    category?: {
      name: string;
      slug: string;
    } | null;
    images: ImageType[];
    variants: VariantType[];
    reviews: ReviewType[];
  };
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const { addItem } = useCart();

  // Active image selection
  const [selectedImageId, setSelectedImageId] = useState<string | null>(
    product.images[0]?.id || null
  );

  // Active variant selection
  const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
    product.hasVariants && product.variants.length > 0
      ? product.variants[0]
      : null
  );

  // Quantity selection
  const [quantity, setQuantity] = useState(1);

  // Micro-interaction and Sticky Bar state & refs
  const addToCartBtnRef = useRef<HTMLButtonElement>(null);
  const buyNowBtnRef = useRef<HTMLButtonElement>(null);
  const mainActionsRef = useRef<HTMLDivElement>(null);
  const stickyBarRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Monitor scroll position to reveal sticky buy bar
  useEffect(() => {
    const handleScroll = () => {
      if (!mainActionsRef.current) return;
      const rect = mainActionsRef.current.getBoundingClientRect();
      setShowStickyBar(rect.bottom < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP animation for sticky buy bar
  useEffect(() => {
    if (!stickyBarRef.current) return;
    if (showStickyBar) {
      gsap.to(stickyBarRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.35,
        ease: "back.out(1.2)",
        display: "flex",
      });
    } else {
      gsap.to(stickyBarRef.current, {
        y: 80,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          if (stickyBarRef.current) stickyBarRef.current.style.display = "none";
        },
      });
    }
  }, [showStickyBar]);

  // ── Review state ───────────────────────────────────────────────────────────
  const [localReviews, setLocalReviews] = useState(product.reviews);

  // Compute active price & stock
  const currentPricePoisha = selectedVariant
    ? Number(selectedVariant.pricePoisha)
    : Number(product.pricePoisha);

  const comparePricePoisha = selectedVariant
    ? selectedVariant.compareAtPricePoisha
      ? Number(selectedVariant.compareAtPricePoisha)
      : null
    : product.compareAtPricePoisha
    ? Number(product.compareAtPricePoisha)
    : null;

  const currentStock = selectedVariant
    ? selectedVariant.stockQuantity
    : product.stockQuantity;

  const isOutOfStock = currentStock <= 0;

  const discountPercent =
    comparePricePoisha && comparePricePoisha > currentPricePoisha
      ? Math.round(
          ((comparePricePoisha - currentPricePoisha) / comparePricePoisha) * 100
        )
      : null;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (isOutOfStock) return;

    const targetBtn = (e?.currentTarget as HTMLElement) || addToCartBtnRef.current;
    if (targetBtn) {
      gsap
        .timeline()
        .to(targetBtn, { scale: 0.92, duration: 0.1, ease: "power1.in" })
        .to(targetBtn, { scale: 1.05, duration: 0.15, ease: "back.out(2)" })
        .to(targetBtn, { scale: 1, duration: 0.1 });
    }

    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 900);

    addItem({
      productId: product.id,
      variantId: selectedVariant?.id || null,
      name: product.name,
      variantLabel: selectedVariant?.label || null,
      pricePoisha: currentPricePoisha,
      quantity,
      imageId: selectedImageId || product.images[0]?.id || null,
      maxStock: currentStock,
    });
  };

  const handleBuyNow = (e?: React.MouseEvent) => {
    if (isOutOfStock) return;
    const targetBtn = (e?.currentTarget as HTMLElement) || buyNowBtnRef.current;
    if (targetBtn) {
      gsap.to(targetBtn, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1 });
    }
    handleAddToCart();
    window.location.href = "/checkout";
  };

  // Average rating
  const avgRating =
    localReviews.length > 0
      ? (
          localReviews.reduce((sum, r) => sum + r.rating, 0) /
          localReviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="space-y-12">
      {/* Product Top Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="w-full rounded-3xl bg-white border border-slate-200/80 overflow-hidden relative shadow-sm">
            {selectedImageId ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/images/${selectedImageId}`}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
            ) : (
              <div className="h-80 w-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                <ShoppingBag className="w-16 h-16 stroke-[1.2]" />
                <span className="text-xs font-semibold mt-2">ছবি নেই</span>
              </div>
            )}

            {discountPercent && discountPercent > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger" className="text-xs font-bold py-1 px-3 shadow-md">
                  {discountPercent}% বিশেষ ছাড়
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageId === img.id
                      ? "border-brand-700 shadow-md ring-2 ring-brand-700/20"
                      : "border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/images/${img.id}`}
                    alt={img.altText || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Controls */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          {/* Category & Title */}
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-xs font-bold uppercase tracking-wider text-brand-700 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* SKU and Review Summary */}
            <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-500">
              {product.sku && <span>SKU: {product.sku}</span>}
              {avgRating && (
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{avgRating} ({localReviews.length} রিভিউ)</span>
                </div>
              )}
            </div>
          </div>

          {/* Price Block */}
          <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-baseline gap-3">
            <span className="text-3xl font-black text-brand-900">
              {formatPrice(currentPricePoisha)}
            </span>
            {comparePricePoisha && comparePricePoisha > currentPricePoisha && (
              <span className="text-base text-slate-400 line-through">
                {formatPrice(comparePricePoisha)}
              </span>
            )}
            <span className="ml-auto">
              {isOutOfStock ? (
                <Badge variant="danger" className="font-bold">
                  স্টক শেষ
                </Badge>
              ) : currentStock <= 5 ? (
                <Badge variant="warning" className="font-bold">
                  সীমিত স্টক ({currentStock}টি বাকি)
                </Badge>
              ) : (
                <Badge variant="success" className="font-bold">
                  ইন স্টক ({currentStock}টি)
                </Badge>
              )}
            </span>
          </div>

          {/* Variants Selector */}
          {product.hasVariants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                ভ্যারিয়েন্ট নির্বাচন করুন:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const vOutOfStock = v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      disabled={vOutOfStock}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                        isSelected
                          ? "border-brand-700 bg-brand-700 text-white shadow-md shadow-brand-900/10"
                          : vOutOfStock
                          ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                          : "border-slate-300 bg-white text-slate-700 hover:border-brand-600 hover:bg-brand-50/30"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{v.label}</span>
                      <span className="text-[10px] opacity-80">
                        ({formatPrice(v.pricePoisha)})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              পরিমাণ (Quantity):
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 hover:bg-slate-100 text-slate-600 transition rounded-l-xl disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 text-sm font-bold text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="p-2.5 hover:bg-slate-100 text-slate-600 transition rounded-r-xl disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                সর্বমোট: {formatPrice(currentPricePoisha * quantity)}
              </span>
            </div>
          </div>

          {/* Call to Actions */}
          <div ref={mainActionsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              ref={addToCartBtnRef}
              variant="outline"
              size="lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full gap-2 border-saffron-500 text-saffron-700 hover:bg-saffron-50 transition-all font-bold"
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 text-herbal-600 animate-bounce" />
                  <span>যোগ করা হয়েছে!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-saffron-600" />
                  <span>কার্টে যোগ করুন</span>
                </>
              )}
            </Button>

            <Button
              ref={buyNowBtnRef}
              variant="primary"
              size="lg"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full gap-2 btn-saffron text-white font-bold shadow-glow-saffron"
            >
              <Zap className="w-4 h-4" />
              <span>এখনই কিনুন</span>
            </Button>
          </div>

          {/* Assurances */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>সারা বাংলাদেশে দ্রুততম সময়ে বিশ্বস্ত কুরিয়ারে ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-700 flex-shrink-0" />
              <span>১০০% আসল ও নিরাপদ পেমেন্ট গ্যারান্টি (bKash, Nagad, Rocket)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Reviews Section */}
      <div className="mt-12 pt-8 border-t border-slate-200 space-y-8">
        {/* Product Description */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 border-b pb-3">
            পণ্যের পূর্ণ বিবরণ
          </h2>
          <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {product.description}
          </div>
        </div>

        {/* Modern Animated Customer Reviews Section */}
        <ProductReviewsSection
          productId={product.id}
          productName={product.name}
          initialReviews={localReviews}
          avgRating={avgRating}
          onReviewsChange={setLocalReviews}
        />
      </div>

      {/* ── GSAP Floating Sticky Purchase Bar ── */}
      <div
        ref={stickyBarRef}
        style={{ transform: "translateY(80px)", opacity: 0, display: "none" }}
        className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-[620px] z-40 bg-white/95 backdrop-blur-xl border border-cream-200/90 rounded-2xl p-2.5 sm:p-3 shadow-[0_12px_40px_rgba(22,45,74,0.18)] items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-cream-100 border border-cream-200 overflow-hidden flex-shrink-0 relative">
            {selectedImageId || product.images[0]?.id ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/images/${selectedImageId || product.images[0]?.id}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <ShoppingBag className="w-5 h-5 text-navy-400 m-auto mt-3" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-navy-900 truncate max-w-[150px] sm:max-w-[260px]">
              {product.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-black text-saffron-700">
                {formatPrice(currentPricePoisha)}
              </span>
              {comparePricePoisha && comparePricePoisha > currentPricePoisha && (
                <span className="text-[10px] text-navy-400 line-through">
                  {formatPrice(comparePricePoisha)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="text-xs px-3.5 py-1.5 h-9 rounded-xl border-saffron-400 text-saffron-700 hover:bg-saffron-50 flex items-center gap-1.5 font-bold"
          >
            {isAdding ? (
              <Check className="w-3.5 h-3.5 text-herbal-600 animate-bounce" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isAdding ? "যোগ হয়েছে" : "কার্টে রাখুন"}</span>
          </Button>

          <Button
            size="sm"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className="text-xs px-4 py-1.5 h-9 rounded-xl btn-saffron text-white font-bold flex items-center gap-1.5 shadow-glow-saffron"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>এখনই কিনুন</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
