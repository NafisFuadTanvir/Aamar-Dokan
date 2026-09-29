import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentAdapter } from "@/lib/payment";
import { calculateDeliveryFeePoisha, BD_DISTRICTS } from "@/lib/delivery";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. COD STRICT REJECTION RULE
    if (body.paymentMethod === "COD" || body.paymentMethod === "cod") {
      return NextResponse.json(
        {
          error:
            "ক্যাশ অন ডেলিভারি (COD) সমর্থিত নয়। আমাদের সকল অর্ডার bKash, Nagad অথবা Rocket-এর মাধ্যমে অগ্রিম পরিশোধ করতে হবে।",
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      addressLine,
      areaOrThana,
      districtId,
      postalCode,
      customerNote,
      items,
      idempotencyKey,
    } = body;

    // Validate customer inputs
    if (
      !customerName?.trim() ||
      !customerPhone?.trim() ||
      !addressLine?.trim() ||
      !areaOrThana?.trim() ||
      !districtId?.trim()
    ) {
      return NextResponse.json(
        { error: "প্রয়োজনীয় নাম, ফোন এবং ঠিকানার বিবরণ পূরণ করুন।" },
        { status: 400 }
      );
    }

    // Phone format check (BD phone numbers: 01XXXXXXXXX)
    const cleanPhone = customerPhone.replace(/\s+/g, "").replace(/^(\+?88)/, "");
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return NextResponse.json(
        { error: "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "অর্ডারে কোনো পণ্য যোগ করা নেই।" },
        { status: 400 }
      );
    }

    const districtObj = BD_DISTRICTS.find((d) => d.id === districtId);
    const districtName = districtObj ? districtObj.nameBn : districtId;

    // 2. Server-Authoritative Price & Stock Calculation
    let calculatedSubtotalPoisha = BigInt(0);
    const orderItemsToCreate: any[] = [];

    for (const item of items) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!product || product.status !== "PUBLISHED") {
        return NextResponse.json(
          { error: `পণ্য "${item.name || item.productId}" বর্তমানে উপলব্ধ নেই।` },
          { status: 400 }
        );
      }

      let unitPricePoisha = product.pricePoisha;
      let variantLabel: string | null = null;
      let variantIdToSave: string | null = null;
      let availableStock = product.stockQuantity;

      if (product.hasVariants && item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant || !variant.isActive) {
          return NextResponse.json(
            { error: `নির্বাচিত পণ্য ভ্যারিয়েন্ট উপলব্ধ নেই।` },
            { status: 400 }
          );
        }
        unitPricePoisha = variant.pricePoisha;
        variantLabel = variant.label;
        variantIdToSave = variant.id;
        availableStock = variant.stockQuantity;
      }

      const qty = Math.max(1, parseInt(item.quantity || "1", 10));

      if (availableStock < qty) {
        return NextResponse.json(
          {
            error: `পণ্য "${product.name}" এর পর্যাপ্ত স্টক নেই (মজুদ আছে: ${availableStock})।`,
          },
          { status: 400 }
        );
      }

      const lineTotalPoisha = unitPricePoisha * BigInt(qty);
      calculatedSubtotalPoisha += lineTotalPoisha;

      orderItemsToCreate.push({
        productId: product.id,
        variantId: variantIdToSave,
        productNameSnapshot: product.name,
        skuSnapshot: product.sku,
        variantSnapshot: variantLabel,
        unitPricePoisha,
        quantity: qty,
        lineTotalPoisha,
      });
    }

    // Calculate delivery fee
    const deliveryFeePoishaNum = calculateDeliveryFeePoisha(districtId);
    const deliveryFeePoisha = BigInt(deliveryFeePoishaNum);
    const totalPoisha = calculatedSubtotalPoisha + deliveryFeePoisha;

    // Generate Order Number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    // 3. Atomically create Order and Payment Attempt
    const newOrder = await db.$transaction(async (tx) => {
      // Create Order
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: customerName.trim(),
          customerPhone: cleanPhone,
          customerEmail: customerEmail?.trim() || null,
          addressLine: addressLine.trim(),
          areaOrThana: areaOrThana.trim(),
          district: districtName,
          postalCode: postalCode?.trim() || null,
          subtotalPoisha: calculatedSubtotalPoisha,
          deliveryFeePoisha,
          totalPoisha,
          paymentStatus: "INITIATED",
          orderStatus: "PENDING_PAYMENT",
          customerNote: customerNote?.trim() || null,
          idempotencyKey: idempotencyKey || nanoid(16),
          items: {
            create: orderItemsToCreate,
          },
        },
      });

      // Create Payment Record
      await tx.payment.create({
        data: {
          orderId: order.id,
          provider: "SSLCOMMERZ",
          status: "INITIATED",
          amountPoisha: totalPoisha,
          idempotencyKey: `pay-${order.id}-${nanoid(8)}`,
        },
      });

      // Stock Reservation
      for (const it of orderItemsToCreate) {
        if (it.variantId) {
          await tx.productVariant.update({
            where: { id: it.variantId },
            data: { reservedQuantity: { increment: it.quantity } },
          });
        } else {
          await tx.product.update({
            where: { id: it.productId },
            data: { reservedQuantity: { increment: it.quantity } },
          });
        }
      }

      return order;
    });

    // 4. Initiate Payment Session
    const adapter = getPaymentAdapter();
    const appUrl = process.env.APP_URL || "http://localhost:3000";

    const session = await adapter.createPaymentSession({
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      amountPoisha: Number(newOrder.totalPoisha),
      customerName: newOrder.customerName,
      customerPhone: newOrder.customerPhone,
      customerEmail: newOrder.customerEmail,
      deliveryAddress: `${newOrder.addressLine}, ${newOrder.areaOrThana}`,
      district: newOrder.district,
      ipnUrl: `${appUrl}/api/webhooks/payment`,
      successUrl: `${appUrl}/orders/confirm?orderNumber=${newOrder.orderNumber}`,
      failUrl: `${appUrl}/orders/confirm?orderNumber=${newOrder.orderNumber}&status=failed`,
      cancelUrl: `${appUrl}/orders/confirm?orderNumber=${newOrder.orderNumber}&status=cancelled`,
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      orderId: newOrder.id,
      paymentStatus: session.status,
      redirectUrl: session.redirectUrl || null,
      errorMessage: session.errorMessage || null,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: error.message || "অর্ডার সম্পন্ন করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}
