import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { processTelegramOutbox } from "@/lib/telegram/outbox";
import { poishaToBDT } from "@/lib/format";

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
    const { transactionReference, method, adminReason } = await request.json();

    if (!transactionReference?.trim() || !adminReason?.trim()) {
      return NextResponse.json(
        { error: "ট্রানজ্যাকশন রেফারেন্স এবং ভেরিফিকেশন কারণ (Reason) প্রদান করা বাধ্যতামূলক।" },
        { status: 400 }
      );
    }

    const order = await db.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json(
        { error: "এই অর্ডারটি ইতোমধ্যে পেইড হিসেবে চিহ্নিত।" },
        { status: 400 }
      );
    }

    // Atomically execute manual verification with full audit trail
    await db.$transaction(async (tx) => {
      // 1. Create Payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "ADMIN_MANUAL",
          method: method || "BKASH",
          status: "SUCCEEDED",
          amountPoisha: order.totalPoisha,
          providerTransactionId: transactionReference.trim(),
          verifiedAt: new Date(),
          verificationSource: "ADMIN_MANUAL",
          idempotencyKey: `manual-verify-${order.id}-${Date.now()}`,
          rawResponseSummary: `Manual verification by admin ${(session.user as any).id}. Reason: ${adminReason.trim()}`,
        },
      });

      // 2. Update Order
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          orderStatus: "PAID",
          paidAt: new Date(),
        },
      });

      // 3. Confirm stock deduction
      for (const item of order.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        } else if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stockQuantity: { decrement: item.quantity },
              reservedQuantity: { decrement: item.quantity },
            },
          });
        }
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          actorUserId: (session.user as any).id,
          action: "PAYMENT_MANUAL_VERIFIED",
          entityType: "Order",
          entityId: order.id,
          metadata: {
            orderNumber: order.orderNumber,
            transactionReference: transactionReference.trim(),
            method,
            adminReason: adminReason.trim(),
          },
        },
      });

      // 5. Enqueue Telegram Outbox Notification
      const appUrl = process.env.APP_URL || "http://localhost:3000";
      const telegramPayload = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        addressLine: order.addressLine,
        areaOrThana: order.areaOrThana,
        district: order.district,
        items: order.items.map((it) => ({
          name: it.productNameSnapshot,
          variant: it.variantSnapshot,
          quantity: it.quantity,
          lineTotalBDT: poishaToBDT(it.lineTotalPoisha),
        })),
        subtotalBDT: poishaToBDT(order.subtotalPoisha),
        deliveryFeeBDT: poishaToBDT(order.deliveryFeePoisha),
        totalBDT: poishaToBDT(order.totalPoisha),
        paymentMethod: `${method || "BKASH"} (অ্যাডমিন ভেরিফাইড)`,
        transactionReference: transactionReference.trim(),
        verifiedAt: new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" }),
        adminOrderUrl: `${appUrl}/admin/orders/${order.id}`,
      };

      await tx.notificationOutbox.create({
        data: {
          orderId: order.id,
          channel: "TELEGRAM",
          templateKey: "ORDER_PAID_ADMIN",
          payload: telegramPayload as any,
          idempotencyKey: `order-paid:${order.id}:admin-telegram-manual`,
          status: "PENDING",
        },
      });
    });

    // Trigger Telegram outbox processing
    processTelegramOutbox().catch((err) =>
      console.error("Async telegram outbox error after manual verify:", err)
    );

    return NextResponse.json({
      success: true,
      message: "অর্ডারের পেমেন্ট সফলভাবে ম্যানুয়ালি যাচাই ও আপডেট করা হয়েছে।",
    });
  } catch (error: any) {
    console.error("Manual verify error:", error);
    return NextResponse.json(
      { error: error.message || "পেমেন্ট ভেরিফাই করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
