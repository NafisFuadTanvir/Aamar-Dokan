import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Eye, Calendar } from "lucide-react";

export const revalidate = 0;

interface AdminOrdersPageProps {
  searchParams: {
    status?: string;
  };
}

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const statusFilter = searchParams.status;

  let whereClause: any = {};
  if (statusFilter && statusFilter !== "ALL") {
    whereClause.orderStatus = statusFilter;
  }

  let orders: any[] = [];
  try {
    orders = await db.order.findMany({
      where: whereClause,
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    // DB fallback
  }

  const statuses = [
    { label: "সকল অর্ডার", value: "ALL" },
    { label: "পেইড (PAID)", value: "PAID" },
    { label: "পেন্ডিং পেমেন্ট", value: "PENDING_PAYMENT" },
    { label: "প্রসেসিং", value: "PROCESSING" },
    { label: "শিপড", value: "SHIPPED" },
    { label: "ডেলিভারড", value: "DELIVERED" },
    { label: "বাতিলকৃত", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-bengali">
            অর্ডার ও পেমেন্ট ব্যবস্থাপনা
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            মোট {orders.length}টি অর্ডার পাওয়া গেছে
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const isActive =
              (!statusFilter && s.value === "ALL") || statusFilter === s.value;
            return (
              <Link
                key={s.value}
                href={
                  s.value === "ALL"
                    ? "/admin/orders"
                    : `/admin/orders?status=${s.value}`
                }
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-gold-500 text-slate-950 shadow-md font-bold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {s.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-300">
              কোনো অর্ডার রেকর্ড নেই
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4">অর্ডার নম্বর</th>
                  <th className="p-4">তারিখ</th>
                  <th className="p-4">গ্রাহক ও মোবাইল</th>
                  <th className="p-4">জেলা</th>
                  <th className="p-4">পেমেন্ট</th>
                  <th className="p-4">স্ট্যাটাস</th>
                  <th className="p-4">মোট টাকা</th>
                  <th className="p-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40 transition">
                    <td className="p-4 font-mono font-bold text-white">
                      {o.orderNumber}
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(o.createdAt).toLocaleDateString("en-BD")}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">
                        {o.customerName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {o.customerPhone}
                      </div>
                    </td>
                    <td className="p-4">{o.district}</td>
                    <td className="p-4">
                      <Badge
                        variant={o.paymentStatus === "PAID" ? "success" : "warning"}
                      >
                        {o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="info">{o.orderStatus}</Badge>
                    </td>
                    <td className="p-4 font-bold text-emerald-400">
                      {formatPrice(o.totalPoisha)}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-gold-500 hover:text-slate-950 font-semibold transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>বিস্তারিত</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
