import {
  PaymentAdapter,
  PaymentConfigStatus,
  PaymentSessionInit,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";

export class MockPaymentAdapter implements PaymentAdapter {
  name = "MOCK";

  constructor() {
    // Prohibit in production strictly
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "CRITICAL SECURITY ERROR: MockPaymentAdapter is strictly prohibited in production mode!"
      );
    }
  }

  getConfigStatus(): PaymentConfigStatus {
    if (process.env.NODE_ENV === "production") {
      return "ERROR";
    }
    return "READY";
  }

  async createPaymentSession(
    init: PaymentSessionInit
  ): Promise<PaymentSessionResult> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Mock payments are disabled in production");
    }

    // In development mode, redirects to local sandbox simulator page
    const simulatorUrl = `/dev/mock-payment?orderNumber=${encodeURIComponent(
      init.orderNumber
    )}&amount=${init.amountPoisha}&successUrl=${encodeURIComponent(
      init.successUrl
    )}&failUrl=${encodeURIComponent(init.failUrl)}`;

    return {
      status: "SUCCESS",
      redirectUrl: simulatorUrl,
      sessionKey: `mock_session_${Date.now()}`,
    };
  }

  async verifyPayment(
    valId: string,
    tranId?: string
  ): Promise<PaymentVerificationResult> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Mock verification prohibited in production");
    }

    return {
      isVerified: true,
      orderNumber: tranId || "",
      transactionId: `mock_tran_${Date.now()}`,
      amountPoisha: 100000,
      currency: "BDT",
      paymentMethod: "BKASH",
      verifiedAt: new Date(),
      rawSummary: "DEV MOCK PAYMENT SUCCESSFUL",
    };
  }

  async verifyWebhook(
    payload: Record<string, any>
  ): Promise<PaymentVerificationResult | null> {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Mock webhook prohibited in production");
    }

    return {
      isVerified: true,
      orderNumber: payload.tran_id || "",
      transactionId: payload.bank_tran_id || `mock_tran_${Date.now()}`,
      amountPoisha: Number(payload.amount_poisha || 0),
      currency: "BDT",
      paymentMethod: payload.method || "BKASH",
      verifiedAt: new Date(),
      rawSummary: "DEV MOCK WEBHOOK",
    };
  }
}
