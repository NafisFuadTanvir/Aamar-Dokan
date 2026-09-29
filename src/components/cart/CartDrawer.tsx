"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotalPoisha } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-700" />
              <h2 className="text-base font-bold text-slate-800">
                আপনার শপিং ব্যাগ ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-slate-700 font-medium">
                    আপনার ব্যাগ বর্তমানে খালি
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    পছন্দের পণ্য যোগ করে অর্ডার সম্পন্ন করুন
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 text-xs"
                >
                  কেনাকাটা করুন
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || "default"}`}
                  className="flex gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0 relative">
                    {item.imageId ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={`/api/images/${item.imageId}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                        পণ্য
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                      {item.name}
                    </h3>
                    {item.variantLabel && (
                      <span className="inline-block text-xs text-brand-700 font-medium bg-brand-50 px-1.5 py-0.5 rounded mt-0.5">
                        {item.variantLabel}
                      </span>
                    )}
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatPrice(item.pricePoisha)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          className="p-1 hover:bg-slate-100 text-slate-600 transition rounded-l-lg"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-slate-800">
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
                          className="p-1 hover:bg-slate-100 text-slate-600 transition rounded-r-lg"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        className="text-slate-400 hover:text-red-500 transition p-1"
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
            <div className="border-t p-6 bg-slate-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">উপমোট (Subtotal)</span>
                <span className="text-lg font-bold text-slate-900">
                  {formatPrice(subtotalPoisha)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                * ডেলিভারি চার্জ চেকআউট পেইজে এলাকা অনুযায়ী যুক্ত হবে
              </p>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button variant="primary" className="w-full gap-2">
                  <span>চেকআউট করুন</span>
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
