import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { AdminOrderDetailClient } from "./AdminOrderDetailClient";
import { ArrowLeft, Clock, ShieldCheck, Truck, User, CreditCard } from "lucide-react";

export const revalidate = 0;

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = params;

  let order: any = null;
  try {
    order = await db.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "desc" } },
        notifications: { orderBy: { createdAt: "desc" } },
      },
    });
  } catch (e) {
    // DB fallback
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
        <Link
          href="/admin/orders"
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white font-mono">
              {order.orderNumber}
            </h1>
            <Badge
              variant={order.paymentStatus === "PAID" ? "success" : "warning"}
            >
              {order.paymentStatus}
            </Badge>
            <Badge variant="info">{order.orderStatus}</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            অর্ডার তৈরির সময়: {new Date(order.createdAt).toLocaleString("en-BD")}
          </p>
        </div>
      </div>

      <AdminOrderDetailClient order={order} />
    </div>
  );
}
