// src/app/api/admin/referrals/[id]/route.ts
// PATCH /api/admin/referrals/[id]  — toggle isActive, update fields
// DELETE /api/admin/referrals/[id] — delete (only if usageCount === 0)

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

// ── PATCH ─────────────────────────────────────────────────────────────────────
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { isActive, description, maxUsage, expiresAt } = body;

  const updated = await prisma.referralCode.update({
    where: { id: params.id },
    data: {
      ...(isActive !== undefined && { isActive }),
      ...(description !== undefined && { description }),
      ...(maxUsage !== undefined && { maxUsage: maxUsage === null ? null : Number(maxUsage) }),
      ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
    },
  });

  return NextResponse.json({
    ...updated,
    discountValue: updated.discountValue.toString(),
    minOrderPoisha: updated.minOrderPoisha.toString(),
  });
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referral = await prisma.referralCode.findUnique({
    where: { id: params.id },
  });

  if (!referral) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (referral.usageCount > 0) {
    // Soft-delete: just deactivate so historical order data is intact
    await prisma.referralCode.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ deactivated: true });
  }

  await prisma.referralCode.delete({ where: { id: params.id } });
  return NextResponse.json({ deleted: true });
}
