// src/app/api/referral/validate/route.ts
// POST /api/referral/validate
// Public endpoint — validates a referral code and returns discount info

import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code: string = (body.code ?? "").trim().toUpperCase();
    const subtotalPoisha: number = Number(body.subtotalPoisha ?? 0);

    if (!code) {
      return NextResponse.json({ error: "কোড দিন" }, { status: 400 });
    }

    const referral = await prisma.referralCode.findUnique({
      where: { code },
    });

    if (!referral || !referral.isActive) {
      return NextResponse.json(
        { error: "অবৈধ বা মেয়াদোত্তীর্ণ কোড" },
        { status: 404 }
      );
    }

    // Expiry check
    if (referral.expiresAt && referral.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "কোডের মেয়াদ শেষ হয়ে গেছে" },
        { status: 410 }
      );
    }

    // Usage limit check
    if (referral.maxUsage !== null && referral.usageCount >= referral.maxUsage) {
      return NextResponse.json(
        { error: "এই কোডের ব্যবহারের সীমা শেষ হয়েছে" },
        { status: 410 }
      );
    }

    // Minimum order check
    if (subtotalPoisha < Number(referral.minOrderPoisha)) {
      const minBDT = (Number(referral.minOrderPoisha) / 100).toFixed(0);
      return NextResponse.json(
        {
          error: `এই কোড ব্যবহারে ন্যূনতম অর্ডার ৳${minBDT} হতে হবে`,
        },
        { status: 422 }
      );
    }

    // Calculate discount amount in poisha
    let discountPoisha: number;
    if (referral.discountType === "PERCENTAGE") {
      // discountValue is stored as basis points (100 = 1%)
      discountPoisha = Math.floor(
        (subtotalPoisha * Number(referral.discountValue)) / 10000
      );
    } else {
      // FIXED — discountValue is directly in poisha
      discountPoisha = Number(referral.discountValue);
    }

    // Never discount more than the subtotal
    discountPoisha = Math.min(discountPoisha, subtotalPoisha);

    return NextResponse.json({
      valid: true,
      code: referral.code,
      discountType: referral.discountType,
      discountValue: referral.discountValue.toString(),
      discountPoisha,
      description: referral.description,
    });
  } catch (err) {
    console.error("[referral/validate]", err);
    return NextResponse.json(
      { error: "সার্ভার ত্রুটি" },
      { status: 500 }
    );
  }
}
