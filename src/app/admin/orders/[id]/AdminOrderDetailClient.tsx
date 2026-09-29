"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Truck,
  User,
  CreditCard,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export function AdminOrderDetailClient({ order }: { order: any }) {
  const [currentOrderStatus, setCurrentOrderStatus] = useState(order.orderStatus);
  const [currentPaymentStatus, setCurrentPaymentStatus] = useState(order.paymentStatus);

  // Manual Verify Form
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [tranRef, setTranRef] = useState("");
  const [verifyMethod, setVerifyMethod] = useState("BKASH");
  const [verifyReason, setVerifyReason] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  // Status update
  const [newStatus, setNewStatus] = useState(order.orderStatus);
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  const handleManualVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);

    if (!tranRef.trim() || !verifyReason.trim()) {
      setVerifyError("ট্রানজ্যাকশন আইডি ও ভেরিফিকেশনের কারণ লিখুন।");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionReference: tranRef.trim(),
          method: verifyMethod,
          adminReason: verifyReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "পেমেন্ট ভেরিফাই করতে সমস্যা হয়েছে।");
      }

      setCurrentPaymentStatus("PAID");
      setCurrentOrderStatus("PAID");
      setShowVerifyModal(false);
      window.location.reload();
    } catch (err: any) {
      setVerifyError(err.message || "ত্রুটি ঘটেছে।");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusSuccess(null);
    setIsUpdatingStatus(true);

    try {
      const res = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, note: statusNote }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "স্ট্যাটাস পরিবর্তন করতে সমস্যা হয়েছে।");
      }

      setCurrentOrderStatus(newStatus);
      setStatusSuccess(data.message);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Details & Items */}
      <div className="lg:col-span-8 space-y-6">
        {/* Customer & Address Card */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" />
            <span>গ্রাহক ও ডেলিভারি বিবরণ</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400">নাম:</span>
              <p className="font-bold text-white text-sm">{order.customerName}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">মোবাইল নম্বর:</span>
              <p className="font-bold text-white font-mono">{order.customerPhone}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">ইমেইল:</span>
              <p className="text-slate-300">{order.customerEmail || "প্রদান করা হয়নি"}</p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400">ডেলিভারি জেলা:</span>
              <p className="font-bold text-white">{order.district}</p>
            </div>
            <div className="sm:col-span-2 space-y-1">
              <span className="text-slate-400">সম্পূর্ণ ডেলিভারি ঠিকানা:</span>
              <p className="text-slate-200">
                {order.addressLine}, {order.areaOrThana}, {order.district}{" "}
                {order.postalCode ? `(${order.postalCode})` : ""}
              </p>
            </div>
            {order.customerNote && (
              <div className="sm:col-span-2 p-3 bg-slate-900 rounded-xl text-slate-300">
                <span className="font-semibold text-gold-400">গ্রাহকের নোট:</span>{" "}
                {order.customerNote}
              </div>
            )}
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            অর্ডারকৃত পণ্যসমূহ
          </h2>

          <div className="divide-y divide-slate-800 text-xs">
            {order.items.map((it: any) => (
              <div key={it.id} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                <div>
                  <p className="font-bold text-white">{it.productNameSnapshot}</p>
                  {it.variantSnapshot && (
                    <span className="text-brand-400 bg-brand-950/80 px-2 py-0.5 rounded text-[11px] font-semibold border border-brand-800">
                      ভ্যারিয়েন্ট: {it.variantSnapshot}
                    </span>
                  )}
                  <span className="block text-slate-400 mt-0.5">
                    {it.quantity} টি × {formatPrice(it.unitPricePoisha)}
                  </span>
                </div>
                <div className="font-bold text-white text-sm">
                  {formatPrice(it.lineTotalPoisha)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>উপমোট (Subtotal)</span>
              <span>{formatPrice(order.subtotalPoisha)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>ডেলিভারি চার্জ</span>
              <span>{formatPrice(order.deliveryFeePoisha)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>সর্বমোট প্রদেয়</span>
              <span className="text-emerald-400">{formatPrice(order.totalPoisha)}</span>
            </div>
          </div>
        </div>

        {/* Payment History Card */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>পেমেন্ট হিস্ট্রি ও ট্রানজ্যাকশন</span>
            </span>
            <Badge variant={currentPaymentStatus === "PAID" ? "success" : "warning"}>
              {currentPaymentStatus}
            </Badge>
          </h2>

          {order.payments.length === 0 ? (
            <p className="text-xs text-slate-500">কোনো পেমেন্ট রেকর্ড নেই।</p>
          ) : (
            <div className="space-y-3 text-xs">
              {order.payments.map((p: any) => (
                <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">
                      {p.provider} {p.method ? `(${p.method})` : ""}
                    </span>
                    <Badge variant={p.status === "SUCCEEDED" ? "success" : "warning"}>
                      {p.status}
                    </Badge>
                  </div>
                  {p.providerTransactionId && (
                    <p className="text-slate-300 font-mono">
                      ট্রানজ্যাকশন আইডি: {p.providerTransactionId}
                    </p>
                  )}
                  {p.verifiedAt && (
                    <p className="text-slate-400 text-[11px]">
                      যাচাইকৃত সময়: {new Date(p.verifiedAt).toLocaleString("en-BD")}
                    </p>
                  )}
                  {p.rawResponseSummary && (
                    <p className="text-slate-500 text-[10px] truncate">
                      সামারি: {p.rawResponseSummary}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Actions & Notifications */}
      <div className="lg:col-span-4 space-y-6">
        {/* Manual Verification Action (if unpaid) */}
        {currentPaymentStatus !== "PAID" && (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
            <h2 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>ম্যানুয়াল পেমেন্ট ভেরিফিকেশন</span>
            </h2>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              গ্রাহক সরাসরি bKash/Nagad পেমেন্ট করে থাকলে অ্যাডমিন হিসেবে অডিট লগসহ ম্যানুয়ালি যাচাই করতে পারেন।
            </p>
            <Button
              variant="gold"
              onClick={() => setShowVerifyModal(true)}
              className="w-full text-xs font-bold"
            >
              ম্যানুয়ালি ভেরিফাই করুন
            </Button>
          </div>
        )}

        {/* Update Fulfillment Status */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
            অর্ডার স্ট্যাটাস পরিবর্তন
          </h2>

          {statusSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{statusSuccess}</span>
            </div>
          )}

          <form onSubmit={handleStatusUpdate} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400">বর্তমান স্ট্যাটাস:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-900 px-3 text-white focus:outline-none"
              >
                <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="PACKED">PACKED</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">অ্যাডমিন নোট (ঐচ্ছিক):</label>
              <textarea
                rows={2}
                placeholder="যেমন: কুরিয়ারে বুকিং সম্পন্ন, ট্র্যাকিং কোড #১২৩৪"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-white"
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isUpdatingStatus}
              className="w-full text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              স্ট্যাটাস আপডেট করুন
            </Button>
          </form>
        </div>

        {/* Telegram Notification Status for this order */}
        <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-cyan-400" />
            <span>টেলিগ্রাম নোটিফিকেশন লগ</span>
          </h2>

          {order.notifications.length === 0 ? (
            <p className="text-xs text-slate-500">
              পেমেন্ট সফল হওয়ার পর টেলিগ্রাম নোটিফিকেশন স্বয়ংক্রিয়ভাবে কিউতে যুক্ত হবে।
            </p>
          ) : (
            <div className="space-y-3 text-xs">
              {order.notifications.map((n: any) => (
                <div key={n.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-white">
                      চ্যানেল: {n.channel}
                    </span>
                    <Badge variant={n.status === "SENT" ? "success" : n.status === "NOT_CONFIGURED" ? "warning" : "danger"}>
                      {n.status}
                    </Badge>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    প্রচেষ্টা সংখ্যা: {n.attemptCount}/{n.maxAttempts}
                  </p>
                  {n.lastError && (
                    <p className="text-red-400 text-[11px] leading-relaxed">
                      ত্রুটি: {n.lastError}
                    </p>
                  )}
                  {n.sentAt && (
                    <p className="text-emerald-400 text-[11px]">
                      পাঠানো হয়েছে: {new Date(n.sentAt).toLocaleString("en-BD")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                ম্যানুয়াল পেমেন্ট যাচাইকরণ
              </h3>
              <button
                onClick={() => setShowVerifyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {verifyError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400">
                {verifyError}
              </div>
            )}

            <form onSubmit={handleManualVerify} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  পেমেন্ট মাধ্যম *
                </label>
                <select
                  value={verifyMethod}
                  onChange={(e) => setVerifyMethod(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-white"
                >
                  <option value="BKASH">bKash</option>
                  <option value="NAGAD">Nagad</option>
                  <option value="ROCKET">Rocket</option>
                  <option value="CARD">Bank Card</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  ট্রানজ্যাকশন আইডি (TrxID) *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 9J47AB12CD"
                  value={tranRef}
                  onChange={(e) => setTranRef(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-700 bg-slate-950 px-3 text-white"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">
                  অ্যাডমিন যাচাইকরণের কারণ (Audit Reason) *
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: মার্চেন্ট বিকাশ স্টেটমেন্টে টাকা জমা পাওয়া গেছে"
                  value={verifyReason}
                  onChange={(e) => setVerifyReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowVerifyModal(false)}
                  className="text-slate-400"
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  variant="gold"
                  isLoading={isVerifying}
                  className="font-bold"
                >
                  পেমেন্ট নিশ্চিত করুন
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
