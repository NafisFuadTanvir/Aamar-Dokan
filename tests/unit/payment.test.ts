import { describe, it, expect } from "vitest";
import { MockPaymentAdapter } from "@/lib/payment/mock";
import { SSLCommerzAdapter } from "@/lib/payment/sslcommerz";

describe("Payment Gateway Adapter Security", () => {
  it("prohibits MockPaymentAdapter in production environment", () => {
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "production";

    expect(() => {
      new MockPaymentAdapter();
    }).toThrow(/strictly prohibited in production/);

    (process.env as any).NODE_ENV = originalEnv;
  });

  it("reports NOT_CONFIGURED when SSLCommerz credentials are empty", () => {
    delete process.env.SSLCOMMERZ_STORE_ID;
    delete process.env.SSLCOMMERZ_STORE_PASSWORD;

    const adapter = new SSLCommerzAdapter();
    expect(adapter.getConfigStatus()).toBe("NOT_CONFIGURED");
  });
});
