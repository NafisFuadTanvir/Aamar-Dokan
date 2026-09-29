import React from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Truck,
  Phone,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";

interface OrderConfirmPageProps {
  searchParams: {
    orderNumber?: string;
    status?: string;
  };
}

export default async function OrderConfirmPage({
  searchParams,
}: OrderConfirmPageProps) {
  const { orderNumber } = searchParams;

  let order: any = null;

  if (orderNumber) {
    try {
      order = await db.order.findUnique({
        where: { orderNumber },
        include: {
          items: true,
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
    } catch (e) {
      // DB connection fallback
    }
  }

  const isPaid = order?.paymentStatus === "PAID";
  const isFailed = searchParams.status === "failed";
  const isCancelled = searchParams.status === "cancelled";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-10 space-y-8">
          {/* Header Status Icon */}
          <div className="text-center space-y-3">
            {isPaid ? (
              <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
            ) : isFailed || isCancelled ? (
              <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                <XCircle className="w-10 h-10" />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-10 h-10" />
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-bengali">
              {isPaid
                ? "পেমেন্ট সফল ও অর্ডার নিশ্চিত হয়েছে!"
                : isFailed
                ? "পেমেন্ট ব্যর্থ হয়েছে"
                : isCancelled
                ? "পেমেন্ট বাতিল করা হয়েছে"
                : "অর্ডার গ্রহণ করা হয়েছে (পেমেন্ট প্রক্রিয়াধীন)"}
            </h1>

            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {isPaid
                ? "আপনার অগ্রিম পেমেন্টটি সফলভাবে যাচাই করা হয়েছে। স্টোর কর্তৃপক্ষকে টেলিগ্রামে নোটিফিকেশন পাঠানো হয়েছে।"
                : isFailed
                ? "পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
                : "আমরা আপনার অর্ডারের পেমেন্ট ভেরিফিকেশনের জন্য অপেক্ষা করছি।"}
            </p>
          </div>

          {order ? (
            <div className="space-y-6 pt-4 border-t border-slate-100">
              {/* Key Details Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs">
                <div>
                  <span className="text-slate-400 block">অর্ডার নম্বর</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {order.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">পেমেন্ট স্ট্যাটাস</span>
                  <Badge
                    variant={isPaid ? "success" : "warning"}
                    className="mt-1 font-bold"
                  >
                    {isPaid ? "পরিশোধিত (PAID)" : "অপেক্ষমান (PENDING)"}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-400 block">মোট পরিশোধ</span>
                  <span className="font-extrabold text-brand-700 text-sm">
                    {formatPrice(order.totalPoisha)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">ডেলিভারি জেলা</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {order.district}
                  </span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-700" />
                  <span>ডেলিভারি প্রাপকের ঠিকানা</span>
                </h3>
                <p className="text-slate-700 font-semibold">{order.customerName}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
                <p className="text-slate-600">
                  {order.addressLine}, {order.areaOrThana}, {order.district}
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">ক্রয়কৃত পণ্যসমূহ</h3>
                <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl p-4 text-xs">
                  {order.items.map((it: any) => (
                    <div key={it.id} className="py-2.5 flex justify-between items-center first:pt-0 last:pb-0">
                      <div>
                        <span className="font-bold text-slate-800">
                          {it.productNameSnapshot}
                        </span>
                        {it.variantSnapshot && (
                          <span className="ml-2 text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded font-medium text-[11px]">
                            {it.variantSnapshot}
                          </span>
                        )}
                        <span className="block text-slate-400 text-[11px]">
                          পরিমাণ: {it.quantity} × {formatPrice(it.unitPricePoisha)}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatPrice(it.lineTotalPoisha)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              অর্ডার নম্বর পাওয়া যায়নি।
            </div>
          )}

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-100">
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>আরও কেনাকাটা করুন</span>
              </Button>
            </Link>
            <Link href="/orders/track" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">
                অর্ডার ট্র্যাক করুন
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
