"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import { Search, PackageCheck, AlertCircle, Clock, Truck, CheckCircle2 } from "lucide-react";

export default function OrderTrackPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrderData(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError("অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই প্রয়োজন।");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(
          orderNumber.trim()
        )}&phone=${encodeURIComponent(phone.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "অর্ডার খুঁজে পাওয়া যায়নি।");
      }

      setOrderData(data.order);
    } catch (err: any) {
      setError(err.message || "অনুসন্ধানে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="text-center max-w-lg mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            অর্ডার ট্র্যাকিং
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-bengali">
            আপনার অর্ডারের বর্তমান অবস্থা জানুন
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            অর্ডার কনফার্মেশনের সময় প্রাপ্ত অর্ডার নম্বর ও মোবাইল নম্বর প্রদান করুন
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="অর্ডার নম্বর *"
                placeholder="যেমন: ORD-20240929-1234"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
              />
              <Input
                label="মোবাইল নম্বর *"
                placeholder="01700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full gap-2"
            >
              <Search className="w-4 h-4" />
              <span>ট্র্যাক করুন</span>
            </Button>
          </form>

          {orderData && (
            <div className="pt-6 border-t border-slate-100 space-y-6 animate-in fade-in duration-300">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-xs text-slate-400 block">অর্ডার নং</span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    {orderData.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">স্ট্যাটাস</span>
                  <Badge variant={orderData.orderStatus === "DELIVERED" ? "success" : "info"}>
                    {orderData.orderStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">পেমেন্ট</span>
                  <Badge variant={orderData.paymentStatus === "PAID" ? "success" : "warning"}>
                    {orderData.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">মোট মূল্য</span>
                  <span className="font-bold text-brand-700 text-sm">
                    {formatPrice(orderData.totalPoisha)}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 text-xs">
                <h3 className="font-bold text-slate-800">পণ্যসমূহ:</h3>
                <div className="divide-y divide-slate-100 border rounded-2xl p-4">
                  {orderData.items.map((it: any) => (
                    <div key={it.id} className="py-2 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <span className="font-semibold text-slate-800">
                          {it.productNameSnapshot}
                        </span>
                        {it.variantSnapshot && (
                          <span className="ml-1 text-slate-500">({it.variantSnapshot})</span>
                        )}
                        <span className="block text-slate-400">পরিমাণ: {it.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(it.lineTotalPoisha)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
