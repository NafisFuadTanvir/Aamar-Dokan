import React from "react";
import { db } from "@/lib/db";
import { telegramService } from "@/lib/telegram";
import { NotificationsClient } from "./NotificationsClient";

export const revalidate = 0;

export default async function AdminNotificationsPage() {
  const telegramStatus = telegramService.getConfigStatus();

  let jobs: any[] = [];
  try {
    jobs = await db.notificationOutbox.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (e) {
    // DB fallback
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-bengali">
            টেলিগ্রাম নোটিফিকেশন আউটবক্স
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            পেইড অর্ডারের স্বয়ংক্রিয় নোটিফিকেশন লগ, রিট্রাই হিস্ট্রি এবং ডেলিভারি স্ট্যাটাস
          </p>
        </div>
      </div>

      <NotificationsClient initialJobs={jobs} telegramStatus={telegramStatus} />
    </div>
  );
}
