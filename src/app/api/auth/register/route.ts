import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name?.trim() || !password?.trim()) {
      return NextResponse.json(
        { error: "নাম এবং পাসওয়ার্ড প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (!email?.trim() && !phone?.trim()) {
      return NextResponse.json(
        { error: "ইমেইল অথবা মোবাইল নম্বর প্রদান করুন।" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।" },
        { status: 400 }
      );
    }

    const cleanEmail = email?.trim().toLowerCase() || null;
    const cleanPhone = phone?.trim().replace(/\s+/g, "") || null;

    // Check existing
    if (cleanEmail) {
      const existingEmail = await db.user.findUnique({
        where: { email: cleanEmail },
      });
      if (existingEmail) {
        return NextResponse.json(
          { error: "এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।" },
          { status: 400 }
        );
      }
    }

    if (cleanPhone) {
      const existingPhone = await db.user.findUnique({
        where: { phone: cleanPhone },
      });
      if (existingPhone) {
        return NextResponse.json(
          { error: "এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে।" },
          { status: 400 }
        );
      }
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        passwordHash,
        role: "CUSTOMER",
        status: "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "রেজিস্ট্রেশন সম্পন্ন করা যায়নি।" },
      { status: 500 }
    );
  }
}
