import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { processTelegramOutbox } from "@/lib/telegram/outbox";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Reset job
    await db.notificationOutbox.update({
      where: { id },
      data: {
        status: "PENDING",
        attemptCount: 0,
        nextAttemptAt: null,
      },
    });

    // Run outbox
    const result = await processTelegramOutbox();

    return NextResponse.json({
      success: true,
      message: "নোটিফিকেশন পুনরায় পাঠানোর চেষ্টা করা হয়েছে।",
      result,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
