/**
 * Telegram Bot API Notification Adapter & Outbox Worker
 * Replaces WhatsApp per store owner requirement.
 * Credentials stored only on server.
 */

export interface TelegramOrderPayload {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  addressLine: string;
  areaOrThana: string;
  district: string;
  items: Array<{
    name: string;
    variant?: string | null;
    quantity: number;
    lineTotalBDT: number;
  }>;
  subtotalBDT: number;
  deliveryFeeBDT: number;
  totalBDT: number;
  paymentMethod: string;
  transactionReference: string;
  verifiedAt: string;
  adminOrderUrl?: string;
}

export type TelegramConfigStatus = "NOT_CONFIGURED" | "READY" | "ERROR";

export class TelegramNotificationService {
  private botToken?: string;
  private chatId?: string;

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN;
    this.chatId = process.env.TELEGRAM_CHAT_ID;
  }

  getConfigStatus(): TelegramConfigStatus {
    if (!this.botToken || !this.chatId) {
      return "NOT_CONFIGURED";
    }
    return "READY";
  }

  formatOrderMessage(payload: TelegramOrderPayload): string {
    const itemsList = payload.items
      .map(
        (it) =>
          `  • ${it.name}${it.variant ? ` [${it.variant}]` : ""} × ${
            it.quantity
          } = ৳${it.lineTotalBDT}`
      )
      .join("\n");

    return (
      `🛍️ নতুন পেইড অর্ডার — ${payload.orderNumber}\n\n` +
      `👤 গ্রাহক: ${payload.customerName}\n` +
      `📞 ফোন: ${payload.customerPhone}\n` +
      `📍 ঠিকানা: ${payload.addressLine}, ${payload.areaOrThana}, ${payload.district}\n\n` +
      `📦 পণ্য:\n${itemsList}\n\n` +
      `💰 পণ্যের মোট:   ৳${payload.subtotalBDT}\n` +
      `🚚 ডেলিভারি চার্জ: ৳${payload.deliveryFeeBDT}\n` +
      `✅ মোট পরিশোধ:   ৳${payload.totalBDT}\n\n` +
      `💳 পেমেন্ট: ${payload.paymentMethod}\n` +
      `🔖 ট্রানজ্যাকশন: ${payload.transactionReference}\n` +
      `⏰ যাচাইয়ের সময়: ${payload.verifiedAt}\n` +
      (payload.adminOrderUrl ? `\n🔗 অ্যাডমিন লিংক: ${payload.adminOrderUrl}` : "")
    );
  }

  async sendTextMessage(text: string): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
    notConfigured?: boolean;
  }> {
    if (this.getConfigStatus() !== "READY") {
      return {
        success: false,
        notConfigured: true,
        error:
          "Telegram Bot credentials (TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID) are missing.",
      };
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: this.chatId,
          text,
          parse_mode: "HTML",
        }),
      });

      const data = await response.json();

      if (data.ok && data.result) {
        return {
          success: true,
          messageId: data.result.message_id?.toString(),
        };
      }

      return {
        success: false,
        error: data.description || "Telegram API returned an error",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Failed to connect to Telegram API",
      };
    }
  }
}

export const telegramService = new TelegramNotificationService();
