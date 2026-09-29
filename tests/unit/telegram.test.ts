import { describe, it, expect } from "vitest";
import {
  TelegramNotificationService,
  TelegramOrderPayload,
} from "@/lib/telegram";

describe("Telegram Order Notifications", () => {
  const service = new TelegramNotificationService();

  const mockPayload: TelegramOrderPayload = {
    orderId: "ord_12345",
    orderNumber: "ORD-20240929-1234",
    customerName: "তানভীর আহমেদ",
    customerPhone: "01700000000",
    addressLine: "বাড়ি ১২, রোড ৫",
    areaOrThana: "ধানমন্ডি",
    district: "ঢাকা",
    items: [
      {
        name: "সুন্দরবনের খাঁটি মধু",
        variant: "৫০০ গ্রাম",
        quantity: 2,
        lineTotalBDT: 1700,
      },
      {
        name: "সরিষার তেল",
        variant: null,
        quantity: 1,
        lineTotalBDT: 360,
      },
    ],
    subtotalBDT: 2060,
    deliveryFeeBDT: 70,
    totalBDT: 2130,
    paymentMethod: "BKASH",
    transactionReference: "9J47AB12CD",
    verifiedAt: "29/09/2024, 03:45:00 PM",
    adminOrderUrl: "http://localhost:3000/admin/orders/ord_12345",
  };

  it("formats order message with all required customer and product details", () => {
    const message = service.formatOrderMessage(mockPayload);

    // Verify presence of required fields per prompt
    expect(message).toContain("ORD-20240929-1234");
    expect(message).toContain("তানভীর আহমেদ");
    expect(message).toContain("01700000000");
    expect(message).toContain("ধানমন্ডি");
    expect(message).toContain("ঢাকা");
    expect(message).toContain("সুন্দরবনের খাঁটি মধু");
    expect(message).toContain("[৫০০ গ্রাম]");
    expect(message).toContain("সরিষার তেল");
    expect(message).toContain("৳2130");
    expect(message).toContain("BKASH");
    expect(message).toContain("9J47AB12CD");
  });

  it("correctly identifies NOT_CONFIGURED when environment variables are missing", () => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;

    const unconfiguredService = new TelegramNotificationService();
    expect(unconfiguredService.getConfigStatus()).toBe("NOT_CONFIGURED");
  });
});
