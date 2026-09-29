import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  let dbStatus = "disconnected";
  try {
    // Simple query to verify DB connection
    await db.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch (error) {
    dbStatus = "unavailable";
  }

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      services: {
        payment: process.env.SSLCOMMERZ_STORE_ID ? "configured" : "not_configured",
        telegram: process.env.TELEGRAM_BOT_TOKEN ? "configured" : "not_configured",
        email: process.env.EMAIL_SMTP_HOST ? "configured" : "not_configured",
      },
    },
    { status: 200 }
  );
}
