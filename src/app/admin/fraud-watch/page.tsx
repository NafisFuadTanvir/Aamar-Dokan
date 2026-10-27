import React from "react";
import { db } from "@/lib/db";
import { FraudWatchClient } from "./FraudWatchClient";

export const revalidate = 0;

export const metadata = {
  title: "ফ্রড ওয়াচ — সন্দেহজনক গ্রাহক তালিকা",
};

async function getSuspiciousCustomers() {
  const users = await db.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      isFlagged: true,
      flagReason: true,
      flaggedAt: true,
      createdAt: true,
      orders: {
        select: {
          id: true,
          orderNumber: true,
          orderStatus: true,
          totalPoisha: true,
          createdAt: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return users
    .map((u) => {
      const totalOrders = u.orders.length;
      const cancelledOrders = u.orders.filter(
        (o) => o.orderStatus === "CANCELLED"
      ).length;
      const nonDeliveredOrders = u.orders.filter(
        (o) =>
          o.orderStatus === "PACKED" ||
          o.orderStatus === "SHIPPED" ||
          o.orderStatus === "PROCESSING" ||
          o.orderStatus === "PAID"
      ).length;
      const deliveredOrders = u.orders.filter(
        (o) => o.orderStatus === "DELIVERED"
      ).length;

      const cancelRate =
        totalOrders > 0
          ? Math.round((cancelledOrders / totalOrders) * 100)
          : 0;

      const riskScore = cancelledOrders * 3 + nonDeliveredOrders * 2;

      let riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" = "LOW";
      if (riskScore >= 10) riskLevel = "CRITICAL";
      else if (riskScore >= 6) riskLevel = "HIGH";
      else if (riskScore >= 3) riskLevel = "MEDIUM";

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        status: u.status,
        isFlagged: u.isFlagged,
        flagReason: u.flagReason,
        flaggedAt: u.flaggedAt?.toISOString() ?? null,
        createdAt: u.createdAt.toISOString(),
        totalOrders,
        cancelledOrders,
        nonDeliveredOrders,
        deliveredOrders,
        cancelRate,
        riskScore,
        riskLevel,
        recentOrders: u.orders.slice(0, 5).map((o) => ({
          ...o,
          totalPoisha: o.totalPoisha.toString(),
          createdAt: o.createdAt.toISOString(),
        })),
      };
    })
    .filter(
      (u) => u.cancelledOrders >= 1 || u.nonDeliveredOrders >= 1 || u.isFlagged
    )
    .sort((a, b) => b.riskScore - a.riskScore);
}

export default async function FraudWatchPage() {
  let customers: Awaited<ReturnType<typeof getSuspiciousCustomers>> = [];
  try {
    customers = await getSuspiciousCustomers();
  } catch (e) {
    console.error("Fraud watch page error:", e);
  }

  return <FraudWatchClient initialCustomers={customers} />;
}