import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// ── GET /api/admin/fraud-watch ─────────────────────────────────────────────
// সন্দেহজনক গ্রাহকদের তালিকা ফেরত দেয়
// যাদের cancel বা non-delivery order আছে তাদের দেখায়
// ──────────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const minCancelled = parseInt(searchParams.get("minCancelled") ?? "1", 10);
  const minNonDelivery = parseInt(searchParams.get("minNonDelivery") ?? "1", 10);
  const flaggedOnly = searchParams.get("flaggedOnly") === "true";

  try {
    const users = await db.user.findMany({
      where: {
        role: "CUSTOMER",
        ...(flaggedOnly ? { isFlagged: true } : {}),
      },
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

    const customersWithStats = users
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
        };
      })
      .filter((u) => {
        if (flaggedOnly) return true;
        return u.cancelledOrders >= minCancelled || u.nonDeliveredOrders >= minNonDelivery;
      })
      .sort((a, b) => b.riskScore - a.riskScore);

    return NextResponse.json({
      customers: customersWithStats,
      total: customersWithStats.length,
    });
  } catch (err) {
    console.error("Fraud watch API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
