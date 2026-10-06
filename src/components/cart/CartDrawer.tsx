"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import gsap from "gsap";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotalPoisha } =
    useCart();

  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  // Sync mounted state with isOpen to allow exit animations
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    }
  }, [isOpen]);

  // Entrance animation when mounted & isOpen becomes true
  useEffect(() => {
    if (!mounted || !isOpen) return;

    const ctx = gsap.context(() => {
      // Backdrop fade in
      if (backdropRef.current) {
        gsap.fromTo(
          backdropRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
      }

      // Drawer slide in
      if (drawerRef.current) {
        gsap.fromTo(
          drawerRef.current,
          { x: "100%" },
          { x: "0%", duration: 0.45, ease: "power3.out" }
        );
      }

      // Stagger items
      if (itemsContainerRef.current) {
        const itemEls = itemsContainerRef.current.querySelectorAll(".cart-item-card");
        if (itemEls.length > 0) {
          gsap.fromTo(
            itemEls,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.35,
              stagger: 0.05,
              delay: 0.15,
              ease: "power2.out",
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, [mounted, isOpen]);

  // Smooth exit animation
  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        setMounted(false);
      },
    });

    if (drawerRef.current) {
      tl.to(
        drawerRef.current,
        { x: "100%", duration: 0.3, ease: "power3.in" },
        0
      );
    }

    if (backdropRef.current) {
      tl.to(
        backdropRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        0.05
      );
    }
  };

  if (!mounted && !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-cream-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cream-200 px-6 py-4 bg-cream-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-saffron-500/10 text-saffron-600 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-navy-900">
                  আপনার শপিং ব্যাগ
                </h2>
                <span className="text-[11px] text-navy-500 font-medium">
                  {items.reduce((acc, i) => acc + i.quantity, 0)}টি পণ্য যুক্ত হয়েছে
                </span>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="rounded-xl p-2 text-navy-400 hover:bg-cream-200/60 hover:text-navy-700 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div
            ref={itemsContainerRef}
            className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5"
          >
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center text-navy-400 shadow-inner">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-navy-800 font-bold text-sm">
                    আপনার ব্যাগ বর্তমানে খালি
                  </p>
                  <p className="text-xs text-navy-500 mt-1">
                    পছন্দের পণ্য যোগ করে অর্ডার সম্পন্ন করুন
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="mt-2 text-xs border-saffron-400 text-saffron-700 hover:bg-saffron-50 rounded-xl"
                >
                  কেনাকাটা শুরু করুন
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="cart-item-card flex gap-3.5 p-3.5 bg-cream-50/70 hover:bg-white rounded-2xl border border-cream-200/80 transition-all duration-200 hover:shadow-card group"
                >
                  <div className="w-16 h-16 rounded-xl bg-white border border-cream-200 overflow-hidden flex-shrink-0 relative">
                    {item.imageId ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`/api/images/${item.imageId}`}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy-400 text-xs font-semibold">
                        পণ্য
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-navy-900 truncate">
                        {item.name}
                      </h3>
                      {item.variantLabel && (
                        <span className="inline-block text-[10px] text-saffron-700 font-semibold bg-saffron-50 border border-saffron-200/60 px-1.5 py-0.5 rounded-md mt-0.5">
                          {item.variantLabel}
                        </span>
                      )}
                      <p className="text-xs font-black text-navy-900 mt-1">
                        {formatPrice(item.pricePoisha)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-cream-200/60">
                      <div className="flex items-center border border-cream-300 rounded-lg bg-white shadow-2xs">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="p-1 hover:bg-cream-100 text-navy-600 transition rounded-l-lg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-navy-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          className="p-1 hover:bg-cream-100 text-navy-600 transition rounded-r-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="text-navy-400 hover:text-red-500 transition p-1 rounded-md hover:bg-red-50"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="border-t border-cream-200 p-6 bg-cream-50/90 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-navy-600">উপমোট (Subtotal)</span>
                <span className="text-lg font-black text-navy-900">
                  {formatPrice(subtotalPoisha)}
                </span>
              </div>
              <p className="text-[11px] text-navy-500">
                * ডেলিভারি চার্জ চেকআউট পেইজে এলাকা অনুযায়ী যুক্ত হবে
              </p>
              <Link
                href="/checkout"
                onClick={handleClose}
                className="block w-full"
              >
                <Button
                  variant="primary"
                  className="w-full gap-2 btn-saffron text-white py-3.5 rounded-2xl font-bold shadow-glow-saffron"
                >
                  <span>অর্ডার সম্পন্ন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
