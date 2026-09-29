import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = params;

  try {
    const { status, note } = await request.json();

    const allowedStatuses = [
      "PENDING_PAYMENT",
      "PAID",
      "PROCESSING",
      "PACKED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "অবৈধ অর্ডার স্ট্যাটাস।" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await db.$transaction([
      db.order.update({
        where: { id },
        data: {
          orderStatus: status,
          internalNote: note ? `${order.internalNote ? order.internalNote + "\n" : ""}[${new Date().toISOString()}] ${note}` : order.internalNote,
        },
      }),
      db.auditLog.create({
        data: {
          actorUserId: (session.user as any).id,
          action: "ORDER_STATUS_UPDATED",
          entityType: "Order",
          entityId: id,
          metadata: {
            oldStatus: order.orderStatus,
            newStatus: status,
            note,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `অর্ডার স্ট্যাটাস সফলভাবে "${status}" এ পরিবর্তিত হয়েছে।`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
