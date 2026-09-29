import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "অর্ডার নম্বর এবং মোবাইল নম্বর উভয়ই প্রয়োজন" },
      { status: 400 }
    );
  }

  const cleanPhone = phone.replace(/\s+/g, "").replace(/^(\+?88)/, "");

  try {
    const order = await db.order.findFirst({
      where: {
        orderNumber,
        customerPhone: { contains: cleanPhone },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "প্রদত্ত তথ্যের সাথে কোনো অর্ডার খুঁজে পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        subtotalPoisha: order.subtotalPoisha.toString(),
        deliveryFeePoisha: order.deliveryFeePoisha.toString(),
        totalPoisha: order.totalPoisha.toString(),
        district: order.district,
        createdAt: order.createdAt,
        items: order.items.map((i) => ({
          id: i.id,
          productNameSnapshot: i.productNameSnapshot,
          variantSnapshot: i.variantSnapshot,
          quantity: i.quantity,
          unitPricePoisha: i.unitPricePoisha.toString(),
          lineTotalPoisha: i.lineTotalPoisha.toString(),
        })),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
