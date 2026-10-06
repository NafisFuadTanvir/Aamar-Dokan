"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Tag,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  TrendingUp,
  Clock,
  Percent,
  BadgeDollarSign,
  RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/format";

// ── Types ──────────────────────────────────────────────────────────────────────

type DiscountType = "FIXED" | "PERCENTAGE";

interface ReferralCode {
  id: string;
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: string; // BigInt serialised as string
  minOrderPoisha: string;
  maxUsage: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  _count: { orders: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDiscountLabel(code: ReferralCode): string {
  if (code.discountType === "PERCENTAGE") {
    const pct = Number(code.discountValue) / 100;
    return `${pct}% ছাড়`;
  }
  return `${formatPrice(Number(code.discountValue))} ছাড়`;
}

function formatExpiry(expiresAt: string | null): string {
  if (!expiresAt) return "মেয়াদ নেই";
  const d = new Date(expiresAt);
  return d.toLocaleDateString("bn-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}

// ── Create Modal ──────────────────────────────────────────────────────────────

interface CreateModalProps {
  onClose: () => void;
  onCreated: () => void;
}

function CreateModal({ onClose, onCreated }: CreateModalProps) {
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<DiscountType>("FIXED");
  const [discountValue, setDiscountValue] = useState("");
  const [minOrder, setMinOrder] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || !discountValue.trim()) {
      setError("কোড এবং ছাড়ের পরিমাণ আবশ্যক।");
      return;
    }

    const dvNum = Number(discountValue);
    if (isNaN(dvNum) || dvNum <= 0) {
      setError("ছাড়ের পরিমাণ সঠিকভাবে দিন।");
      return;
    }
    if (discountType === "PERCENTAGE" && dvNum > 10000) {
      setError("শতকরা ছাড় ১০০% (10000 basis points) এর বেশি হতে পারবে না।");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          description: description.trim() || null,
          discountType,
          discountValue: discountType === "PERCENTAGE"
            ? Math.round(dvNum * 100) // convert percent to basis points
            : Math.round(dvNum * 100), // convert BDT to poisha
          minOrderPoisha: minOrder ? Math.round(Number(minOrder) * 100) : 0,
          maxUsage: maxUsage ? Number(maxUsage) : null,
          expiresAt: expiresAt || null,
          isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "সার্ভার ত্রুটি");
        return;
      }
      onCreated();
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-gold-400" />
            </div>
            <h2 className="text-base font-bold text-white">নতুন রেফারেল কোড</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              কোড <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))}
              placeholder="যেমন: SAVE20, EID50, SUMMER25"
              maxLength={20}
              className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm font-mono tracking-wider text-white placeholder:text-slate-500 placeholder:font-sans placeholder:tracking-normal focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
            <p className="text-[10px] text-slate-500">শুধু A-Z, 0-9 এবং হাইফেন, ৩-২০ অক্ষর</p>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">বিবরণ (ঐচ্ছিক)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="যেমন: ঈদ বিশেষ অফার ২০২৫"
              className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                ছাড়ের ধরন <span className="text-red-400">*</span>
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as DiscountType)}
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              >
                <option value="FIXED">নির্দিষ্ট পরিমাণ (BDT)</option>
                <option value="PERCENTAGE">শতকরা (%)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {discountType === "FIXED" ? "পরিমাণ (৳)" : "শতকরা হার (%)"}{" "}
                <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                max={discountType === "PERCENTAGE" ? 100 : undefined}
                step={discountType === "PERCENTAGE" ? "0.01" : "1"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "FIXED" ? "যেমন: 100" : "যেমন: 10"}
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
          </div>

          {/* Min Order + Max Usage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                ন্যূনতম অর্ডার (৳)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                placeholder="০ = কোনো সীমা নেই"
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                সর্বোচ্চ ব্যবহার
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="খালি = সীমাহীন"
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
          </div>

          {/* Expiry + Active */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">মেয়াদ শেষের তারিখ</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">স্ট্যাটাস</label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 w-full h-10 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-emerald-600 bg-emerald-900/30 text-emerald-300"
                    : "border-slate-700 bg-slate-800 text-slate-400"
                }`}
              >
                {isActive ? (
                  <ToggleRight className="w-5 h-5" />
                ) : (
                  <ToggleLeft className="w-5 h-5" />
                )}
                {isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl bg-gold-500 text-slate-950 text-sm font-bold hover:bg-gold-400 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              কোড তৈরি করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────

interface EditModalProps {
  code: ReferralCode;
  onClose: () => void;
  onUpdated: () => void;
}

function EditModal({ code, onClose, onUpdated }: EditModalProps) {
  const [description, setDescription] = useState(code.description ?? "");
  const [maxUsage, setMaxUsage] = useState(code.maxUsage?.toString() ?? "");
  const [expiresAt, setExpiresAt] = useState(
    code.expiresAt ? code.expiresAt.split("T")[0] : ""
  );
  const [isActive, setIsActive] = useState(code.isActive);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/referrals/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: description.trim() || null,
          maxUsage: maxUsage ? Number(maxUsage) : null,
          expiresAt: expiresAt || null,
          isActive,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "আপডেট ব্যর্থ হয়েছে।");
        return;
      }
      onUpdated();
    } catch {
      setError("নেটওয়ার্ক সমস্যা।");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">কোড সম্পাদনা</h2>
            <p className="text-xs text-gold-400 font-mono mt-0.5">{code.code}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-xs text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">বিবরণ</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="কোডের বিবরণ লিখুন"
              className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">সর্বোচ্চ ব্যবহার</label>
              <input
                type="number"
                min={code.usageCount > 0 ? code.usageCount : 1}
                value={maxUsage}
                onChange={(e) => setMaxUsage(e.target.value)}
                placeholder="সীমাহীন"
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white placeholder:text-slate-500 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">মেয়াদ শেষের তারিখ</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-700 bg-slate-800 px-3 text-sm text-white focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">স্ট্যাটাস</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 w-full h-10 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                isActive
                  ? "border-emerald-600 bg-emerald-900/30 text-emerald-300"
                  : "border-slate-700 bg-slate-800 text-slate-400"
              }`}
            >
              {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-xl bg-gold-500 text-slate-950 text-sm font-bold hover:bg-gold-400 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              সংরক্ষণ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminReferralsPage() {
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editCode, setEditCode] = useState<ReferralCode | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchCodes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/referrals");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCodes(data);
    } catch {
      showToast("error", "ডেটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  function showToast(type: "success" | "error", text: string) {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  }

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDelete = async (id: string) => {
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/referrals/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        showToast("error", data.error || "মুছতে সমস্যা হয়েছে।");
        return;
      }
      showToast(
        "success",
        data.deleted
          ? "কোড সফলভাবে মুছে ফেলা হয়েছে।"
          : "কোড নিষ্ক্রিয় করা হয়েছে (অর্ডারে ব্যবহৃত হওয়ায় ডেটা সংরক্ষিত)।"
      );
      fetchCodes();
    } catch {
      showToast("error", "নেটওয়ার্ক সমস্যা।");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (code: ReferralCode) => {
    setTogglingId(code.id);
    // Optimistic update
    setCodes((prev) =>
      prev.map((c) => (c.id === code.id ? { ...c, isActive: !c.isActive } : c))
    );
    try {
      const res = await fetch(`/api/admin/referrals/${code.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !code.isActive }),
      });
      if (!res.ok) throw new Error();
      showToast(
        "success",
        !code.isActive ? "কোড সক্রিয় করা হয়েছে।" : "কোড নিষ্ক্রিয় করা হয়েছে।"
      );
    } catch {
      // Revert optimistic update on error
      setCodes((prev) =>
        prev.map((c) => (c.id === code.id ? { ...c, isActive: code.isActive } : c))
      );
      showToast("error", "স্ট্যাটাস পরিবর্তন ব্যর্থ হয়েছে।");
    } finally {
      setTogglingId(null);
    }
  };

  // Stats
  const totalActive = codes.filter((c) => c.isActive && !isExpired(c.expiresAt)).length;
  const totalUsage = codes.reduce((s, c) => s + c.usageCount, 0);
  const totalOrders = codes.reduce((s, c) => s + c._count.orders, 0);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold transition-all ${
            toastMsg.type === "success"
              ? "bg-emerald-900 border border-emerald-700 text-emerald-200"
              : "bg-red-900 border border-red-700 text-red-200"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {toastMsg.text}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-bengali">
            রেফারেল কোড ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            ডিসকাউন্ট কোড তৈরি, পরিচালনা ও পর্যবেক্ষণ করুন
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCodes}
            className="p-2 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="রিফ্রেশ"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gold-500 text-slate-950 text-sm font-bold hover:bg-gold-400 transition shadow-lg shadow-gold-900/20"
          >
            <Plus className="w-4 h-4" />
            নতুন কোড তৈরি করুন
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
            <Tag className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalActive}</p>
            <p className="text-xs text-slate-400">সক্রিয় কোড</p>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalUsage}</p>
            <p className="text-xs text-slate-400">মোট ব্যবহার</p>
          </div>
        </div>
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <BadgeDollarSign className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalOrders}</p>
            <p className="text-xs text-slate-400">সংযুক্ত অর্ডার</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center">
            <Loader2 className="w-8 h-8 text-slate-500 animate-spin mx-auto" />
            <p className="text-xs text-slate-500 mt-3">লোড হচ্ছে...</p>
          </div>
        ) : codes.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Tag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">কোনো রেফারেল কোড নেই</p>
            <p className="text-xs text-slate-500">
              উপরে &quot;নতুন কোড তৈরি করুন&quot; বাটনে ক্লিক করুন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">কোড</th>
                  <th className="p-4">ছাড়</th>
                  <th className="p-4">ন্যূনতম অর্ডার</th>
                  <th className="p-4">ব্যবহার</th>
                  <th className="p-4">মেয়াদ</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {codes.map((c) => {
                  const expired = isExpired(c.expiresAt);
                  const exhausted = c.maxUsage !== null && c.usageCount >= c.maxUsage;
                  return (
                    <tr key={c.id} className="hover:bg-slate-900/40 transition">
                      {/* Code */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white tracking-wider text-sm">
                            {c.code}
                          </span>
                          <button
                            onClick={() => handleCopy(c.code, c.id)}
                            className="text-slate-500 hover:text-gold-400 transition"
                            title="কপি করুন"
                          >
                            {copiedId === c.id ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {c.description && (
                          <p className="text-[10px] text-slate-500 mt-0.5 max-w-[180px] truncate">
                            {c.description}
                          </p>
                        )}
                      </td>

                      {/* Discount */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          {c.discountType === "PERCENTAGE" ? (
                            <Percent className="w-3.5 h-3.5 text-gold-400" />
                          ) : (
                            <BadgeDollarSign className="w-3.5 h-3.5 text-gold-400" />
                          )}
                          <span className="font-bold text-gold-300">
                            {formatDiscountLabel(c)}
                          </span>
                        </div>
                      </td>

                      {/* Min Order */}
                      <td className="p-4 text-slate-400">
                        {Number(c.minOrderPoisha) > 0
                          ? formatPrice(Number(c.minOrderPoisha))
                          : "—"}
                      </td>

                      {/* Usage */}
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <span
                            className={`font-bold ${exhausted ? "text-red-400" : "text-white"}`}
                          >
                            {c.usageCount}
                          </span>
                          {c.maxUsage !== null && (
                            <span className="text-slate-500">/ {c.maxUsage}</span>
                          )}
                        </div>
                        {exhausted && (
                          <span className="text-[10px] text-red-400">সীমা শেষ</span>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <Clock
                            className={`w-3.5 h-3.5 ${expired ? "text-red-400" : "text-slate-500"}`}
                          />
                          <span className={expired ? "text-red-400" : "text-slate-400"}>
                            {formatExpiry(c.expiresAt)}
                          </span>
                        </div>
                        {expired && (
                          <span className="text-[10px] text-red-400">মেয়াদ শেষ</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(c)}
                          disabled={togglingId === c.id}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition disabled:opacity-70 ${
                            c.isActive && !expired
                              ? "bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900/60"
                              : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                          }`}
                        >
                          {togglingId === c.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : c.isActive && !expired ? (
                            <ToggleRight className="w-3.5 h-3.5" />
                          ) : (
                            <ToggleLeft className="w-3.5 h-3.5" />
                          )}
                          {c.isActive && !expired ? "সক্রিয়" : "নিষ্ক্রিয়"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditCode(c)}
                            className="px-3 h-8 rounded-lg border border-slate-700 text-slate-300 text-xs font-semibold hover:bg-slate-800 hover:text-white transition"
                          >
                            সম্পাদনা
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(c.id)}
                            disabled={deletingId === c.id}
                            className="w-8 h-8 rounded-lg border border-red-800/50 text-red-400 hover:bg-red-900/30 hover:text-red-300 transition flex items-center justify-center disabled:opacity-50"
                            title="মুছুন"
                          >
                            {deletingId === c.id ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            showToast("success", "নতুন রেফারেল কোড তৈরি হয়েছে!");
            fetchCodes();
          }}
        />
      )}
      {editCode && (
        <EditModal
          code={editCode}
          onClose={() => setEditCode(null)}
          onUpdated={() => {
            setEditCode(null);
            showToast("success", "কোড সফলভাবে আপডেট হয়েছে।");
            fetchCodes();
          }}
        />
      )}

      {/* ── Delete Confirm Modal ── */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-900/30 border border-red-700/50 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-white">কোড মুছবেন?</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  যদি এই কোড কোনো অর্ডারে ব্যবহৃত হয়ে থাকে,
                  তাহলে হার্ড ডিলিট না হয়ে শুধু নিষ্ক্রিয় করা হবে।
                  নতুন কোড হলে স্থায়ীভাবে মুছে ফেলা হবে।
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 h-10 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 transition"
                >
                  বাতিল
                </button>
                <button
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={!!deletingId}
                  className="flex-1 h-10 rounded-xl bg-red-700 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletingId ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  হ্যাঁ, মুছুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
