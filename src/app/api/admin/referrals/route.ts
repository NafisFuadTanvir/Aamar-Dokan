// src/app/api/admin/referrals/route.ts
// GET  /api/admin/referrals          — list all referral codes
// POST /api/admin/referrals          — create a new referral code

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null;
  }
  return session;
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const codes = await prisma.referralCode.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      code: true,
      description: true,
      discountType: true,
      discountValue: true,
      minOrderPoisha: true,
      maxUsage: true,
      usageCount: true,
      isActive: true,
      expiresAt: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  // Serialize BigInt to string
  const serialized = codes.map((c: typeof codes[number]) => ({
    ...c,
    discountValue: c.discountValue.toString(),
    minOrderPoisha: c.minOrderPoisha.toString(),
  }));

  return NextResponse.json(serialized);
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderPoisha,
    maxUsage,
    isActive,
    expiresAt,
  } = body;

  if (!code || !discountType || discountValue === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const upperCode = String(code).trim().toUpperCase();

  // Validate format: alphanumeric + hyphens, 3-20 chars
  if (!/^[A-Z0-9-]{3,20}$/.test(upperCode)) {
    return NextResponse.json(
      { error: "কোড শুধুমাত্র ইংরেজি অক্ষর, সংখ্যা এবং হাইফেন দিয়ে হবে (৩-২০ অক্ষর)" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.referralCode.create({
      data: {
        code: upperCode,
        description: description ?? null,
        discountType: discountType === "PERCENTAGE" ? "PERCENTAGE" : "FIXED",
        discountValue: BigInt(discountValue),
        minOrderPoisha: BigInt(minOrderPoisha ?? 0),
        maxUsage: maxUsage ? Number(maxUsage) : null,
        isActive: isActive !== false,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json({
      ...created,
      discountValue: created.discountValue.toString(),
      minOrderPoisha: created.minOrderPoisha.toString(),
    });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "এই কোড ইতিমধ্যে বিদ্যমান" },
        { status: 409 }
      );
    }
    console.error("[admin/referrals POST]", err);
    return NextResponse.json({ error: "সার্ভার ত্রুটি" }, { status: 500 });
  }
}
