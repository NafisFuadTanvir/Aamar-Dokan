import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { telegramService } from "@/lib/telegram";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (telegramService.getConfigStatus() !== "READY") {
    return NextResponse.json(
      {
        error:
          "Telegram Bot credentials are not configured in the server environment (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing).",
      },
      { status: 400 }
    );
  }

  const testMessage =
    `🧪 <b>টেস্ট নোটিফিকেশন — Amar Dokan</b>\n\n` +
    `এটি একটি পরীক্ষামূলক বার্তা। আপনার টেলিগ্রাম বট সফলভাবে যুক্ত হয়েছে এবং পে-ইন নোটিফিকেশন পাঠানোর জন্য প্রস্তুত রয়েছে!\n\n` +
    `⏰ সময়: ${new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" })}`;

  const result = await telegramService.sendTextMessage(testMessage);

  if (result.success) {
    return NextResponse.json({
      success: true,
      message: "টেলিগ্রামে পরীক্ষামূলক বার্তা সফলভাবে পাঠানো হয়েছে!",
      messageId: result.messageId,
    });
  }

  return NextResponse.json(
    { error: result.error || "টেলিগ্রাম এপিআইতে বার্তা পাঠানো যায়নি।" },
    { status: 500 }
  );
}
