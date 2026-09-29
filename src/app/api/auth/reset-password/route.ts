import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();

    if (!token?.trim() || !newPassword?.trim()) {
      return NextResponse.json(
        { error: "টোকেন এবং নতুন পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "নতুন পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

    const resetRecord = await db.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRecord) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড রিসেট টোকেনটি অবৈধ বা মেয়াদোত্তীর্ণ।" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await db.$transaction([
      db.user.update({
        where: { id: resetRecord.userId },
        data: {
          passwordHash,
          mustChangePassword: false,
        },
      }),
      db.passwordResetToken.update({
        where: { id: resetRecord.id },
        data: { usedAt: new Date() },
      }),
      db.auditLog.create({
        data: {
          action: "PASSWORD_RESET_SUCCESSFUL",
          entityType: "User",
          entityId: resetRecord.userId,
          metadata: { tokenId: resetRecord.id },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে। অনুগ্রহ করে লগইন করুন।",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
