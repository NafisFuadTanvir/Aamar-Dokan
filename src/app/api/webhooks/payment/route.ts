import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentAdapter } from "@/lib/payment";
import { processTelegramOutbox } from "@/lib/telegram/outbox";
import { poishaToBDT } from "@/lib/format";

export async function POST(request: NextRequest) {
  try {
    let payload: Record<string, any> = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    }

    const valId = payload.val_id;
    const tranId = payload.tran_id; // Order Number

    if (!valId || !tranId) {
      return NextResponse.json(
        { error: "Invalid webhook payload: missing val_id or tran_id" },
        { status: 400 }
      );
    }

    // 1. Independent Server-Side Verification via Payment Provider API
    const adapter = getPaymentAdapter();
    const verification = await adapter.verifyPayment(valId, tranId);

    if (!verification.isVerified) {
      console.warn(`Payment verification failed for order ${tranId}: ${verification.failureReason}`);
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 }
      );
    }

    // 2. Fetch Order from Database
    const order = await db.order.findUnique({
      where: { orderNumber: tranId },
      include: { items: true, payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Idempotency: If order is already paid, do not re-process
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ message: "Order is already marked as paid" }, { status: 200 });
    }

    // 3. Atomically update Order, Payment, Stock, and create Telegram Outbox record
    await db.$transaction(async (tx) => {
      // Update Payment record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: adapter.name,
          method: verification.paymentMethod as any,
          status: "SUCCEEDED",
          amountPoisha: order.totalPoisha,
          providerTransactionId: verification.transactionId,
          verifiedAt: verification.verifiedAt,
          verificationSource: "PROVIDER_API",
          idempotencyKey: `webhook-${valId}-${Date.now()}`,
          rawResponseSummary: verification.rawSummary,
        },
      });

      // Update Order to PAID
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          orderStatus: "PAID",
          paidAt: new Date(),
        },
      });

      // Confirm stock deduction
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

      // 4. Create Transactional Outbox Job for Telegram Notification
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
        paymentMethod: verification.paymentMethod,
        transactionReference: verification.transactionId,
        verifiedAt: new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" }),
        adminOrderUrl: `${appUrl}/admin/orders/${order.id}`,
      };

      await tx.notificationOutbox.create({
        data: {
          orderId: order.id,
          channel: "TELEGRAM",
          templateKey: "ORDER_PAID_ADMIN",
          payload: telegramPayload as any,
          idempotencyKey: `order-paid:${order.id}:admin-telegram`,
          status: "PENDING",
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          action: "PAYMENT_VERIFIED_SUCCESS",
          entityType: "Order",
          entityId: order.id,
          metadata: {
            orderNumber: order.orderNumber,
            valId,
            transactionId: verification.transactionId,
            amountPoisha: order.totalPoisha.toString(),
            method: verification.paymentMethod,
          },
        },
      });
    });

    // 5. Trigger outbox processing asynchronously
    processTelegramOutbox().catch((err) =>
      console.error("Async telegram outbox error after IPN:", err)
    );

    return NextResponse.json(
      { status: "SUCCESS", message: "Payment verified and order updated" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Payment webhook handler error:", error);
    return NextResponse.json(
      { error: error.message || "Internal webhook error" },
      { status: 500 }
    );
  }
}
