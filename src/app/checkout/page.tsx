"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { BD_DISTRICTS, calculateDeliveryFeePoisha } from "@/lib/delivery";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, subtotalPoisha, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [areaOrThana, setAreaOrThana] = useState("");
  const [districtId, setDistrictId] = useState("dhaka");
  const [postalCode, setPostalCode] = useState("");
  const [customerNote, setCustomerNote] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notConfiguredNotice, setNotConfiguredNotice] = useState<string | null>(
    null
  );

  const deliveryFeePoisha = calculateDeliveryFeePoisha(districtId);
  const totalPoisha = subtotalPoisha + deliveryFeePoisha;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setNotConfiguredNotice(null);

    if (items.length === 0) {
      setErrorMessage("আপনার কার্টে কোনো পণ্য নেই।");
      return;
    }

    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !addressLine.trim() ||
      !areaOrThana.trim()
    ) {
      setErrorMessage("দয়া করে নাম, মোবাইল নম্বর এবং সম্পূর্ণ ঠিকানা প্রদান করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          addressLine,
          areaOrThana,
          districtId,
          postalCode,
          customerNote,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            name: i.name,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে।");
      }

      // If payment gateway returned redirect URL
      if (data.redirectUrl) {
        clearCart();
        window.location.href = data.redirectUrl;
      } else if (data.paymentStatus === "NOT_CONFIGURED") {
        clearCart();
        setNotConfiguredNotice(
          `আপনার অর্ডার #${data.orderNumber} সফলভাবে গ্রহণ করা হয়েছে (পেন্ডিং পেমেন্ট)। সার্ভারে পেমেন্ট গেটওয়ের ক্রেডেনশিয়াল কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিন প্যানেল থেকে কনফিগার করুন।`
        );
      } else {
        clearCart();
        window.location.href = `/orders/confirm?orderNumber=${data.orderNumber}`;
      }
    } catch (err: any) {
      setErrorMessage(err.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
            চেকআউট
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 font-bengali">
            ডেলিভারি ঠিকানা ও পেমেন্ট
          </h1>
        </div>

        {notConfiguredNotice ? (
          <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-amber-200 shadow-md text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              অর্ডার রেকর্ড সংরক্ষিত হয়েছে
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {notConfiguredNotice}
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl text-xs text-left text-slate-600 space-y-1">
              <p className="font-semibold text-slate-700">প্রয়োজনীয় পদক্ষেপ:</p>
              <p>১. `.env` ফাইলে SSLCOMMERZ_STORE_ID এবং SSLCOMMERZ_STORE_PASSWORD সেট করুন।</p>
              <p>২. অ্যাডমিন ড্যাশবোর্ড থেকে অর্ডারটি ম্যানুয়ালি পর্যালোচনা করতে পারেন।</p>
            </div>
            <Link href="/" className="inline-block mt-4">
              <Button variant="primary">হোমপেজে ফিরে যান</Button>
            </Link>
          </div>
        ) : items.length === 0 ? (
          <div className="max-w-md mx-auto p-12 bg-white rounded-3xl border border-slate-200/80 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">কার্ট খালি</h2>
            <p className="text-xs text-slate-500">
              অর্ডার সম্পন্ন করার জন্য অনুগ্রহ করে পণ্য কার্টে যোগ করুন।
            </p>
            <Link href="/products" className="inline-block">
              <Button variant="primary">পণ্য দেখুন</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form Fields Column */}
            <div className="lg:col-span-7 space-y-6">
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-700 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Contact */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                  <span>১. গ্রাহকের তথ্য</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="আপনার পূর্ণ নাম *"
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />

                  <Input
                    label="সক্রিয় মোবাইল নম্বর *"
                    placeholder="01700000000"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="ইমেইল ঠিকানা (ঐচ্ছিক)"
                  placeholder="example@mail.com"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              {/* Delivery Address */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center gap-2">
                  <span>২. ডেলিভারি ঠিকানা</span>
                </h2>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    জেলা (District) *
                  </label>
                  <select
                    value={districtId}
                    onChange={(e) => setDistrictId(e.target.value)}
                    className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/20"
                    required
                  >
                    {BD_DISTRICTS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.nameBn} ({d.nameEn}) {d.isDhaka ? "- ঢাকা (৳৭০)" : "- ঢাকার বাইরে (৳১৩০)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="থানা / এরিয়া *"
                    placeholder="যেমন: ধানমন্ডি / মিরপুর / কোতোয়ালী"
                    value={areaOrThana}
                    onChange={(e) => setAreaOrThana(e.target.value)}
                    required
                  />

                  <Input
                    label="পোস্ট কোড (ঐচ্ছিক)"
                    placeholder="যেমন: ১২০৯"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                  />
                </div>

                <Input
                  label="সম্পূর্ণ ঠিকানা (বাসা / রোড / ফ্ল্যাট নম্বর) *"
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, ব্লক বি"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  required
                />

                <Input
                  label="অর্ডার নোট / ডেলিভারি নির্দেশনা (ঐচ্ছিক)"
                  placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                />
              </div>

              {/* Prepaid Only Policy Note */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">১০০% অগ্রিম ডিজিটাল পেমেন্ট পলিসি</p>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    আমরা ক্যাশ অন ডেলিভারি (COD) প্রদান করি না। bKash, Nagad, Rocket অথবা কার্ডের মাধ্যমে সম্পূর্ণ সুরক্ষিত অগ্রিম পেমেন্টে অর্ডার নিশ্চিত হবে।
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary & Payment Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6 sticky top-24">
                <h2 className="text-base font-bold text-slate-900 border-b pb-3 flex items-center justify-between">
                  <span>অর্ডার সামারি</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} টি পণ্য
                  </span>
                </h2>

                {/* Items Mini List */}
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId || "def"}`}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1 pr-2">
                        <p className="font-semibold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-slate-400 text-[11px]">
                          {item.variantLabel ? `${item.variantLabel} | ` : ""}
                          পরিমাণ: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(item.pricePoisha * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation breakdown */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>পণ্যের উপমোট (Subtotal)</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(subtotalPoisha)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>ডেলিভারি চার্জ ({districtId === "dhaka" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"})</span>
                    <span className="font-semibold text-slate-800">
                      {formatPrice(deliveryFeePoisha)}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-slate-200 text-base font-bold text-slate-900">
                    <span>সর্বমোট প্রদেয় (Total)</span>
                    <span className="text-xl font-extrabold text-brand-700">
                      {formatPrice(totalPoisha)}
                    </span>
                  </div>
                </div>

                {/* Supported Payment Badges */}
                <div className="pt-2 text-center space-y-2">
                  <span className="text-[11px] text-slate-500 block">
                    সাপোর্টেড ডিজিটাল পেমেন্ট মাধ্যম:
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="bkash">bKash</Badge>
                    <Badge variant="nagad">Nagad</Badge>
                    <Badge variant="rocket">Rocket</Badge>
                    <Badge variant="outline">Cards</Badge>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full gap-2 text-sm font-bold bg-brand-700 hover:bg-brand-800 shadow-lg shadow-brand-900/15"
                >
                  <span>অর্ডার নিশ্চিত ও পেমেন্ট করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
