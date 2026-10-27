import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/admin/fraud-watch/[userId] - customer flag/unflag

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId } = params;
  const body = await req.json();
  const { isFlagged, flagReason } = body as {
    isFlagged: boolean;
    flagReason?: string;
  };

  try {
    const updated = await db.user.update({
      where: { id: userId },
      data: {
        isFlagged,
        flagReason: isFlagged ? (flagReason ?? null) : null,
        flaggedAt: isFlagged ? new Date() : null,
      },
      select: {
        id: true,
        isFlagged: true,
        flagReason: true,
        flaggedAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        actorUserId: (session.user as any).id,
        action: isFlagged ? "CUSTOMER_FLAGGED" : "CUSTOMER_UNFLAGGED",
        entityType: "User",
        entityId: userId,
        metadata: { flagReason: flagReason ?? null },
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updated,
        flaggedAt: updated.flaggedAt?.toISOString() ?? null,
      },
    });
  } catch (err) {
    console.error("Flag customer error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}