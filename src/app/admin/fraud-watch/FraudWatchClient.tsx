"use client";

import React, { useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ShieldAlert,
  Flag,
  FlagOff,
  Search,
  XCircle,
  PackageX,
  BarChart2,
  Phone,
  Mail,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  Flame,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────

export interface SuspiciousCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  status: string;
  isFlagged: boolean;
  flagReason: string | null;
  flaggedAt: string | null;
  createdAt: string;
  totalOrders: number;
  cancelledOrders: number;
  nonDeliveredOrders: number;
  deliveredOrders: number;
  cancelRate: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  recentOrders: {
    id: string;
    orderNumber: string;
    orderStatus: string;
    totalPoisha: string;
    createdAt: string;
  }[];
}

interface Props {
  initialCustomers: SuspiciousCustomer[];
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getRiskConfig(level: SuspiciousCustomer["riskLevel"]) {
  switch (level) {
    case "CRITICAL":
      return {
        label: "ক্রিটিকাল",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-400",
        dot: "bg-red-500",
        badge: "bg-red-500/20 text-red-300 border-red-500/40",
      };
    case "HIGH":
      return {
        label: "উচ্চ ঝুঁকি",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-400",
        dot: "bg-orange-500",
        badge: "bg-orange-500/20 text-orange-300 border-orange-500/40",
      };
    case "MEDIUM":
      return {
        label: "মধ্যম ঝুঁকি",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-400",
        dot: "bg-yellow-500",
        badge: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
      };
    default:
      return {
        label: "কম ঝুঁকি",
        bg: "bg-slate-800/50",
        border: "border-slate-700/30",
        text: "text-slate-400",
        dot: "bg-slate-500",
        badge: "bg-slate-700/40 text-slate-400 border-slate-600/40",
      };
  }
}

function getOrderStatusBn(status: string) {
  const map: Record<string, { label: string; color: string }> = {
    PENDING_PAYMENT: { label: "পেমেন্ট বাকি", color: "text-yellow-400" },
    PAID: { label: "পেমেন্ট হয়েছে", color: "text-blue-400" },
    PROCESSING: { label: "প্রসেসিং", color: "text-cyan-400" },
    PACKED: { label: "প্যাক করা হয়েছে", color: "text-indigo-400" },
    SHIPPED: { label: "শিপড", color: "text-purple-400" },
    DELIVERED: { label: "ডেলিভারি হয়েছে", color: "text-emerald-400" },
    CANCELLED: { label: "বাতিল", color: "text-red-400" },
    REFUND_PENDING: { label: "রিফান্ড বাকি", color: "text-amber-400" },
    REFUNDED: { label: "রিফান্ড হয়েছে", color: "text-teal-400" },
  };
  return map[status] ?? { label: status, color: "text-slate-400" };
}

// ── Flag Modal ────────────────────────────────────────────────────────────

function FlagModal({
  customer,
  onClose,
  onSuccess,
}: {
  customer: SuspiciousCustomer;
  onClose: () => void;
  onSuccess: (id: string, flagged: boolean, reason: string) => void;
}) {
  const [reason, setReason] = useState(customer.flagReason ?? "");
  const [loading, setLoading] = useState(false);
  const isUnflagging = customer.isFlagged;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/fraud-watch/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFlagged: !isUnflagging,
          flagReason: reason,
        }),
      });
      if (res.ok) {
        onSuccess(customer.id, !isUnflagging, reason);
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          {isUnflagging ? (
            <FlagOff className="w-6 h-6 text-emerald-400" />
          ) : (
            <Flag className="w-6 h-6 text-red-400" />
          )}
          <h2 className="text-lg font-bold text-white font-bengali">
            {isUnflagging ? "চিহ্ন সরিয়ে নিন" : "সন্দেহজনক হিসেবে চিহ্নিত করুন"}
          </h2>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/60 mb-4">
          <p className="text-sm font-semibold text-white">{customer.name ?? "নামহীন"}</p>
          <p className="text-xs text-slate-400">{customer.phone ?? customer.email ?? "যোগাযোগ নেই"}</p>
        </div>

        {!isUnflagging && (
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              কারণ (ঐচ্ছিক — শুধু অ্যাডমিনের জন্য)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="যেমন: ৩টি অর্ডার cancel করেছে, কখনো receive করেনি..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/60 resize-none font-bengali"
            />
          </div>
        )}

        {isUnflagging && (
          <p className="text-sm text-slate-400 mb-4 font-bengali">
            এই গ্রাহককে সন্দেহজনক তালিকা থেকে সরিয়ে নেওয়া হবে।
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm text-slate-300 font-semibold transition"
          >
            বাতিল
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${
              isUnflagging
                ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                : "bg-red-600 hover:bg-red-500 text-white"
            } disabled:opacity-50`}
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : isUnflagging ? (
              <>
                <FlagOff className="w-4 h-4" /> চিহ্ন সরান
              </>
            ) : (
              <>
                <Flag className="w-4 h-4" /> সন্দেহজনক হিসেবে চিহ্নিত করুন
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Customer Row ──────────────────────────────────────────────────────────

function CustomerRow({
  customer,
  onFlagClick,
}: {
  customer: SuspiciousCustomer;
  onFlagClick: (c: SuspiciousCustomer) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const risk = getRiskConfig(customer.riskLevel);

  return (
    <>
      <tr
        className={`border-b border-slate-800/60 transition hover:bg-slate-900/50 ${
          customer.isFlagged ? "bg-red-950/20" : ""
        }`}
      >
        {/* Customer */}
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-300 flex-shrink-0">
                {customer.name ? customer.name.charAt(0).toUpperCase() : "?"}
              </div>
              {customer.isFlagged && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <Flag className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-white text-sm truncate">
                {customer.name ?? "নামহীন গ্রাহক"}
              </div>
              {customer.phone && (
                <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                  <Phone className="w-3 h-3" />
                  <span className="font-mono">{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[160px]">{customer.email}</span>
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Risk Level */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${risk.dot} flex-shrink-0`} />
            <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${risk.badge}`}>
              {risk.label}
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">স্কোর: {customer.riskScore}</div>
        </td>

        {/* Cancelled Orders */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span className="text-lg font-bold text-red-400">{customer.cancelledOrders}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            মোট {customer.totalOrders} টির মধ্যে
          </div>
        </td>

        {/* Non-Delivered */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <PackageX className="w-4 h-4 text-orange-400 flex-shrink-0" />
            <span className="text-lg font-bold text-orange-400">{customer.nonDeliveredOrders}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">এখনো পায়নি</div>
        </td>

        {/* Cancel Rate */}
        <td className="p-4">
          <div className="relative w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                customer.cancelRate >= 70
                  ? "bg-red-500"
                  : customer.cancelRate >= 40
                  ? "bg-orange-500"
                  : "bg-yellow-500"
              }`}
              style={{ width: `${Math.min(100, customer.cancelRate)}%` }}
            />
          </div>
          <div className="text-sm font-bold text-white mt-1">{customer.cancelRate}%</div>
        </td>

        {/* Flag Status */}
        <td className="p-4">
          {customer.isFlagged ? (
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/20 text-red-300 text-[11px] font-semibold border border-red-500/30">
                <Flag className="w-3 h-3" />
                চিহ্নিত
              </span>
              {customer.flagReason && (
                <p className="text-[11px] text-slate-400 mt-1 max-w-[120px] truncate" title={customer.flagReason}>
                  {customer.flagReason}
                </p>
              )}
            </div>
          ) : (
            <span className="text-[11px] text-slate-500">—</span>
          )}
        </td>

        {/* Actions */}
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              title="অর্ডার দেখুন"
            >
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={() => onFlagClick(customer)}
              className={`p-1.5 rounded-lg transition ${
                customer.isFlagged
                  ? "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
                  : "bg-red-500/20 hover:bg-red-500/30 text-red-400"
              }`}
              title={customer.isFlagged ? "চিহ্ন সরান" : "সন্দেহজনক চিহ্নিত করুন"}
            >
              {customer.isFlagged ? (
                <FlagOff className="w-3.5 h-3.5" />
              ) : (
                <Flag className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded Orders */}
      {expanded && (
        <tr className="bg-slate-950/80">
          <td colSpan={7} className="px-6 py-4">
            <p className="text-xs font-semibold text-slate-400 mb-2 font-bengali">
              সাম্প্রতিক অর্ডারসমূহ:
            </p>
            <div className="flex flex-wrap gap-2">
              {customer.recentOrders.length > 0 ? (
                customer.recentOrders.map((o) => {
                  const st = getOrderStatusBn(o.orderStatus);
                  return (
                    <div
                      key={o.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700/50 text-xs"
                    >
                      <span className="font-mono text-slate-300">{o.orderNumber}</span>
                      <span className={`font-semibold ${st.color}`}>{st.label}</span>
                    </div>
                  );
                })
              ) : (
                <span className="text-xs text-slate-500">কোনো অর্ডার নেই</span>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export function FraudWatchClient({ initialCustomers }: Props) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "FLAGGED">("ALL");
  const [flagModal, setFlagModal] = useState<SuspiciousCustomer | null>(null);

  const handleFlagSuccess = (id: string, flagged: boolean, reason: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              isFlagged: flagged,
              flagReason: flagged ? reason : null,
              flaggedAt: flagged ? new Date().toISOString() : null,
            }
          : c
      )
    );
  };

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      if (filterRisk === "FLAGGED") return c.isFlagged;
      if (filterRisk !== "ALL" && c.riskLevel !== filterRisk) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.phone?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    });
  }, [customers, searchQuery, filterRisk]);

  // Summary stats
  const criticalCount = customers.filter((c) => c.riskLevel === "CRITICAL").length;
  const highCount = customers.filter((c) => c.riskLevel === "HIGH").length;
  const flaggedCount = customers.filter((c) => c.isFlagged).length;
  const totalCancelled = customers.reduce((s, c) => s + c.cancelledOrders, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-white font-bengali">
              ফ্রড ওয়াচ
            </h1>
          </div>
          <p className="text-xs text-slate-400 ml-11">
            সন্দেহজনক গ্রাহক — যারা বারবার অর্ডার বাতিল করে বা রিসিভ করে না
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>রিস্ক স্কোর = (বাতিল × ৩) + (নন-ডেলিভারি × ২)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">মোট সন্দেহজনক</span>
            <div className="text-2xl font-bold text-white mt-1">{customers.length}</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400/40" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-red-500/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">ক্রিটিকাল</span>
            <div className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</div>
          </div>
          <Flame className="w-8 h-8 text-red-500/30" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">চিহ্নিত গ্রাহক</span>
            <div className="text-2xl font-bold text-amber-400 mt-1">{flaggedCount}</div>
          </div>
          <Flag className="w-8 h-8 text-amber-400/30" />
        </div>
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">মোট বাতিল অর্ডার</span>
            <div className="text-2xl font-bold text-orange-400 mt-1">{totalCancelled}</div>
          </div>
          <XCircle className="w-8 h-8 text-orange-400/30" />
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, মোবাইল বা ইমেইল দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500/50"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "FLAGGED"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterRisk(f)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                filterRisk === f
                  ? f === "CRITICAL"
                    ? "bg-red-600 text-white"
                    : f === "HIGH"
                    ? "bg-orange-600 text-white"
                    : f === "MEDIUM"
                    ? "bg-yellow-600 text-slate-900"
                    : f === "FLAGGED"
                    ? "bg-amber-500 text-slate-900"
                    : "bg-slate-200 text-slate-900"
                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {f === "ALL"
                ? "সকল"
                : f === "CRITICAL"
                ? "ক্রিটিকাল"
                : f === "HIGH"
                ? "উচ্চ"
                : f === "MEDIUM"
                ? "মধ্যম"
                : "চিহ্নিত"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto opacity-60" />
            <p className="text-sm font-semibold text-slate-300 font-bengali">
              কোনো সন্দেহজনক গ্রাহক পাওয়া যায়নি
            </p>
            <p className="text-xs text-slate-500">
              এই মুহূর্তে সকল গ্রাহক স্বাভাবিক আচরণ করছেন।
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wide">
                <tr>
                  <th className="p-4">গ্রাহক</th>
                  <th className="p-4">ঝুঁকির মাত্রা</th>
                  <th className="p-4">বাতিল অর্ডার</th>
                  <th className="p-4">নন-ডেলিভারি</th>
                  <th className="p-4">বাতিলের হার</th>
                  <th className="p-4">ফ্ল্যাগ স্ট্যাটাস</th>
                  <th className="p-4">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <CustomerRow
                    key={c.id}
                    customer={c}
                    onFlagClick={setFlagModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer note */}
      <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-950/50 rounded-xl p-3 border border-slate-800">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" />
        <p>
          <strong className="text-slate-400">নোট:</strong> এখানে শুধুমাত্র রেজিস্টার্ড ব্যবহারকারীদের দেখানো হয়।
          গেস্ট অর্ডারের ক্ষেত্রে ফোন নম্বর দিয়ে অর্ডার পেজ থেকে ম্যানুয়ালি দেখতে হবে।
          চিহ্নিত গ্রাহকরা স্বাভাবিকভাবেই অর্ডার দিতে পারবে — এটি শুধু আপনার পর্যবেক্ষণের জন্য।
        </p>
      </div>

      {/* Flag Modal */}
      {flagModal && (
        <FlagModal
          customer={flagModal}
          onClose={() => setFlagModal(null)}
          onSuccess={handleFlagSuccess}
        />
      )}
    </div>
  );
}