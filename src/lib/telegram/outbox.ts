import { db } from "@/lib/db";
import { telegramService, TelegramOrderPayload } from "./index";

export async function processTelegramOutbox() {
  const now = new Date();

  // Find up to 10 pending notification jobs
  const pendingJobs = await db.notificationOutbox.findMany({
    where: {
      channel: "TELEGRAM",
      OR: [
        { status: "PENDING" },
        { status: "RETRY_SCHEDULED", nextAttemptAt: { lte: now } },
      ],
    },
    take: 10,
    orderBy: { createdAt: "asc" },
  });

  if (pendingJobs.length === 0) {
    return { processed: 0, sent: 0, failed: 0 };
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const job of pendingJobs) {
    // Check if Telegram credentials are configured
    if (telegramService.getConfigStatus() !== "READY") {
      await db.notificationOutbox.update({
        where: { id: job.id },
        data: {
          status: "NOT_CONFIGURED",
          lastError:
            "TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in server environment. Notification saved in outbox pending configuration.",
        },
      });
      failedCount++;
      continue;
    }

    // Set job to PROCESSING
    await db.notificationOutbox.update({
      where: { id: job.id },
      data: { status: "PROCESSING" },
    });

    try {
      const payload = job.payload as unknown as TelegramOrderPayload;
      const formattedMessage = telegramService.formatOrderMessage(payload);

      const result = await telegramService.sendTextMessage(formattedMessage);

      if (result.success) {
        await db.notificationOutbox.update({
          where: { id: job.id },
          data: {
            status: "SENT",
            sentAt: new Date(),
            providerMessageId: result.messageId,
            lastError: null,
          },
        });
        sentCount++;
      } else {
        const nextAttempt = job.attemptCount + 1;
        if (nextAttempt >= job.maxAttempts) {
          await db.notificationOutbox.update({
            where: { id: job.id },
            data: {
              status: "FAILED",
              attemptCount: nextAttempt,
              lastError: result.error || "Max retry attempts exceeded",
            },
          });
          failedCount++;
        } else {
          // Bounded exponential backoff: 2^attempt minutes (1m, 2m, 4m, 8m, 16m)
          const delayMinutes = Math.pow(2, nextAttempt);
          const nextRun = new Date(Date.now() + delayMinutes * 60 * 1000);

          await db.notificationOutbox.update({
            where: { id: job.id },
            data: {
              status: "RETRY_SCHEDULED",
              attemptCount: nextAttempt,
              nextAttemptAt: nextRun,
              lastError: result.error,
            },
          });
        }
      }
    } catch (err: any) {
      await db.notificationOutbox.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          lastError: err.message,
        },
      });
      failedCount++;
    }
  }

  return { processed: pendingJobs.length, sent: sentCount, failed: failedCount };
}
