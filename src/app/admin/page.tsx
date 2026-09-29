import React from "react";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Send,
  ArrowRight,
  Plus,
} from "lucide-react";

export const revalidate = 0; // Live admin dashboard

export default async function AdminDashboardPage() {
  let totalRevenuePoisha = BigInt(0);
  let totalOrdersCount = 0;
  let paidOrdersCount = 0;
  let pendingNotificationCount = 0;
  let recentOrders: any[] = [];
  let productCount = 0;

  try {
    const [
      ordersCount,
      paidOrders,
      pendingNotifs,
      orders,
      productsTotal,
      paidRevenueAggregate,
    ] = await Promise.all([
      db.order.count(),
      db.order.count({ where: { paymentStatus: "PAID" } }),
      db.notificationOutbox.count({ where: { status: "PENDING" } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
      db.product.count(),
      db.order.aggregate({
        where: { paymentStatus: "PAID" },
        _sum: { totalPoisha: true },
      }),
    ]);

    totalOrdersCount = ordersCount;
    paidOrdersCount = paidOrders;
    pendingNotificationCount = pendingNotifs;
    recentOrders = orders;
    productCount = productsTotal;
    totalRevenuePoisha = paidRevenueAggregate._sum?.totalPoisha || BigInt(0);
  } catch (e) {
    // Database fallback
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-bengali">
            ড্যাশবোর্ড ওভারভিউ
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            রিয়েলটাইম বিক্রয়, অর্ডার ও নোটিফিকেশন পর্যবেক্ষণ করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button variant="gold" size="sm" className="gap-1.5 font-bold">
              <Plus className="w-4 h-4" />
              <span>নতুন পণ্য যোগ করুন</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">মোট বিক্রয় (PAID)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {formatPrice(totalRevenuePoisha)}
          </div>
          <span className="text-[11px] text-emerald-400 block">
            {paidOrdersCount}টি যাচাইকৃত পেইড অর্ডার
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">মোট অর্ডার সংখ্যা</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {totalOrdersCount}
          </div>
          <span className="text-[11px] text-slate-400 block">
            সকল অর্ডার হিস্ট্রি
          </span>
        </div>

        {/* Pending Telegram Notifications */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">টেলিগ্রাম নোটিফিকেশন</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {pendingNotificationCount}
          </div>
          <span className="text-[11px] text-cyan-400 block">
            আউটবক্সে অপেক্ষমান মেসেজ
          </span>
        </div>

        {/* Product Count */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">মোট পণ্য সংখ্যা</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white">
            {productCount}
          </div>
          <span className="text-[11px] text-slate-400 block">
            ক্যাটালগ পণ্যসমূহ
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">
            সাম্প্রতিক অর্ডারসমূহ
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
          >
            <span>সকল অর্ডার</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            এখনও কোনো অর্ডার রেকর্ড নেই।
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">অর্ডার নম্বর</th>
                  <th className="p-3">গ্রাহক</th>
                  <th className="p-3">জেলা</th>
                  <th className="p-3">পেমেন্ট</th>
                  <th className="p-3">স্ট্যাটাস</th>
                  <th className="p-3">মোট টাকা</th>
                  <th className="p-3">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-mono font-bold text-white">
                      {o.orderNumber}
                    </td>
                    <td className="p-3">{o.customerName}</td>
                    <td className="p-3">{o.district}</td>
                    <td className="p-3">
                      <Badge
                        variant={o.paymentStatus === "PAID" ? "success" : "warning"}
                      >
                        {o.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant="info">{o.orderStatus}</Badge>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {formatPrice(o.totalPoisha)}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-gold-400 hover:underline"
                      >
                        বিস্তারিত →
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
