import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/reviews?productId=xxx  → check if current user can review this product
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ canReview: false, reason: "not_logged_in" });
    }

    const userId = (session.user as any).id as string;
    const productId = request.nextUrl.searchParams.get("productId");

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // Check if user already reviewed this product
    const existingReview = await db.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    if (existingReview) {
      return NextResponse.json({
        canReview: false,
        reason: "already_reviewed",
        existingReview: {
          id: existingReview.id,
          rating: existingReview.rating,
          title: existingReview.title,
          comment: existingReview.comment,
          status: existingReview.status,
        },
      });
    }

    // Check if user has a delivered order containing this product
    // Match by userId or by customerEmail for verified badge
    const deliveredOrder = await db.order.findFirst({
      where: {
        orderStatus: "DELIVERED",
        items: {
          some: { productId },
        },
        OR: [
          { userId },
          { customerEmail: session.user.email ?? undefined },
        ],
      },
    });

    return NextResponse.json({
      canReview: true,
      isVerifiedPurchase: !!deliveredOrder,
      orderId: deliveredOrder?.id || null,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ canReview: false, reason: "error" });
  }
}

// POST /api/reviews  → submit a review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "রিভিউ দিতে হলে অ্যাকাউন্টে লগইন করুন।" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;
    const body = await request.json();
    const { productId, rating, title, comment } = body;

    // Validate inputs
    if (!productId || !rating || !comment?.trim()) {
      return NextResponse.json(
        { error: "পণ্য আইডি, রেটিং এবং মন্তব্য আবশ্যক।" },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5 || !Number.isInteger(ratingNum)) {
      return NextResponse.json(
        { error: "রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে।" },
        { status: 400 }
      );
    }

    // Check product exists
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true },
    });
    if (!product) {
      return NextResponse.json({ error: "পণ্য পাওয়া যায়নি।" }, { status: 404 });
    }

    // Check if user already reviewed
    const existingReview = await db.review.findUnique({
      where: { productId_userId: { productId, userId } },
    });
    if (existingReview) {
      return NextResponse.json(
        { error: "আপনি এই পণ্যে ইতিমধ্যে রিভিউ দিয়েছেন।" },
        { status: 409 }
      );
    }

    // Check if user has a delivered order with this product (verified purchase)
    const deliveredOrder = await db.order.findFirst({
      where: {
        orderStatus: "DELIVERED",
        items: { some: { productId } },
        OR: [
          { userId },
          { customerEmail: session.user.email ?? undefined },
        ],
      },
    });

    const isVerifiedPurchase = !!deliveredOrder;

    // Create review with APPROVED status so it shows immediately
    const review = await db.review.create({
      data: {
        productId,
        userId,
        rating: ratingNum,
        title: title?.trim() || null,
        comment: comment.trim(),
        isVerifiedPurchase,
        status: "APPROVED",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "আপনার রিভিউ সফলভাবে প্রকাশ করা হয়েছে!",
        reviewId: review.id,
        isVerifiedPurchase,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/reviews error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "আপনি এই পণ্যে ইতিমধ্যে রিভিউ দিয়েছেন।" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "রিভিউ জমা দেওয়া সম্ভব হয়নি। পরে আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
