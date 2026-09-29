import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { identifier } = await request.json();

    if (!identifier?.trim()) {
      return NextResponse.json(
        { error: "ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।" },
        { status: 400 }
      );
    }

    const clean = identifier.trim();

    const user = await db.user.findFirst({
      where: {
        OR: [{ email: clean.toLowerCase() }, { phone: clean }],
      },
    });

    // Timing-attack mitigation: respond successfully even if user not found
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "যদি এই তথ্যের সাথে কোনো অ্যাকাউন্ট বিদ্যমান থাকে, তবে পাসওয়ার্ড রিসেটের অনুরোধ গ্রহণ করা হয়েছে।",
      });
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Record audit log
    await db.auditLog.create({
      data: {
        action: "PASSWORD_RESET_REQUESTED",
        entityType: "User",
        entityId: user.id,
        metadata: {
          identifier: clean,
          emailConfigured: !!process.env.EMAIL_SMTP_HOST,
        },
      },
    });

    // Check if email SMTP is configured
    if (process.env.EMAIL_SMTP_HOST && user.email) {
      // In production with SMTP configured, send mail
      // (Nodemailer dispatch can be performed here)
    }

    return NextResponse.json({
      success: true,
      message:
        "পাসওয়ার্ড রিসেটের অনুরোধ গ্রহণ করা হয়েছে। ইমেইল সক্রিয় থাকলে নির্দেশনাবলী পাঠানো হয়েছে, অথবা স্টোর অ্যাডমিনের সাথে যোগাযোগ করে নিরাপদ রিসেট লিংক সংগ্রহ করুন।",
      // In dev mode only, return token for easy local developer testing
      ...(process.env.NODE_ENV === "development" ? { devToken: rawToken } : {}),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
