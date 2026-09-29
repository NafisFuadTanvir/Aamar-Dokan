import {
  PaymentAdapter,
  PaymentConfigStatus,
  PaymentMethod,
  PaymentSessionInit,
  PaymentSessionResult,
  PaymentVerificationResult,
} from "./types";
import { poishaToBDT, bdtToPoisha } from "@/lib/format";

export class SSLCommerzAdapter implements PaymentAdapter {
  name = "SSLCOMMERZ";
  private storeId?: string;
  private storePassword?: string;
  private isSandbox: boolean;

  constructor() {
    this.storeId = process.env.SSLCOMMERZ_STORE_ID;
    this.storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    this.isSandbox = process.env.SSLCOMMERZ_SANDBOX !== "false";
  }

  getConfigStatus(): PaymentConfigStatus {
    if (!this.storeId || !this.storePassword) {
      return "NOT_CONFIGURED";
    }
    return "READY";
  }

  private getBaseUrl(): string {
    return this.isSandbox
      ? "https://sandbox.sslcommerz.com"
      : "https://securepay.sslcommerz.com";
  }

  async createPaymentSession(
    init: PaymentSessionInit
  ): Promise<PaymentSessionResult> {
    if (this.getConfigStatus() !== "READY") {
      return {
        status: "NOT_CONFIGURED",
        errorMessage:
          "SSLCommerz পেমেন্ট গেটওয়ে কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিন সেটিংস থেকে স্টোর আইডি প্রদান করুন।",
      };
    }

    const initUrl = `${this.getBaseUrl()}/gwprocess/v4/api.php`;
    const amountBDT = poishaToBDT(init.amountPoisha);

    const formData = new URLSearchParams();
    formData.append("store_id", this.storeId!);
    formData.append("store_passwd", this.storePassword!);
    formData.append("total_amount", amountBDT.toString());
    formData.append("currency", "BDT");
    formData.append("tran_id", init.orderNumber);
    formData.append("success_url", init.successUrl);
    formData.append("fail_url", init.failUrl);
    formData.append("cancel_url", init.cancelUrl);
    formData.append("ipn_url", init.ipnUrl);

    // Customer info
    formData.append("cus_name", init.customerName);
    formData.append("cus_email", init.customerEmail || "customer@example.com");
    formData.append("cus_add1", init.deliveryAddress);
    formData.append("cus_city", init.district);
    formData.append("cus_country", "Bangladesh");
    formData.append("cus_phone", init.customerPhone);

    // Shipping info
    formData.append("shipping_method", "COURIER");
    formData.append("ship_name", init.customerName);
    formData.append("ship_add1", init.deliveryAddress);
    formData.append("ship_city", init.district);
    formData.append("ship_country", "Bangladesh");

    // Product info
    formData.append("product_name", `Order #${init.orderNumber}`);
    formData.append("product_category", "Ecommerce");
    formData.append("product_profile", "general");

    try {
      const response = await fetch(initUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      const data = await response.json();

      if (data.status === "SUCCESS" && data.GatewayPageURL) {
        return {
          status: "SUCCESS",
          redirectUrl: data.GatewayPageURL,
          sessionKey: data.sessionkey,
        };
      }

      return {
        status: "FAILED",
        errorMessage:
          data.failedreason || "পেমেন্ট গেটওয়ে সেশন তৈরি করতে ব্যর্থ হয়েছে",
      };
    } catch (error: any) {
      console.error("SSLCommerz session creation error:", error);
      return {
        status: "FAILED",
        errorMessage: error.message || "পেমেন্ট গেটওয়েতে সংযোগ করতে সমস্যা হচ্ছে",
      };
    }
  }

  async verifyPayment(
    valId: string,
    tranId?: string
  ): Promise<PaymentVerificationResult> {
    if (this.getConfigStatus() !== "READY") {
      return {
        isVerified: false,
        orderNumber: tranId || "",
        transactionId: valId,
        amountPoisha: 0,
        currency: "BDT",
        paymentMethod: "OTHER",
        verifiedAt: new Date(),
        rawSummary: "SSLCommerz not configured",
        failureReason: "Payment gateway credentials are not configured",
      };
    }

    const validatorUrl = `${this.getBaseUrl()}/validator/api/validationserverAPI.php?val_id=${encodeURIComponent(
      valId
    )}&store_id=${encodeURIComponent(
      this.storeId!
    )}&store_passwd=${encodeURIComponent(this.storePassword!)}&v=1&format=json`;

    try {
      const response = await fetch(validatorUrl);
      const data = await response.json();

      const isValid =
        (data.status === "VALID" || data.status === "VALIDATED") &&
        (!tranId || data.tran_id === tranId);

      const method = this.mapPaymentMethod(data.card_type || data.card_issuer);

      return {
        isVerified: isValid,
        orderNumber: data.tran_id || tranId || "",
        transactionId: data.bank_tran_id || data.val_id || valId,
        amountPoisha: data.amount ? Number(bdtToPoisha(parseFloat(data.amount))) : 0,
        currency: data.currency || "BDT",
        paymentMethod: method,
        verifiedAt: new Date(),
        rawSummary: JSON.stringify({
          status: data.status,
          bank_tran_id: data.bank_tran_id,
          card_type: data.card_type,
          val_id: data.val_id,
        }),
        failureReason: isValid ? undefined : data.error || "Verification failed",
      };
    } catch (error: any) {
      return {
        isVerified: false,
        orderNumber: tranId || "",
        transactionId: valId,
        amountPoisha: 0,
        currency: "BDT",
        paymentMethod: "OTHER",
        verifiedAt: new Date(),
        rawSummary: error.message,
        failureReason: "Network error during payment verification",
      };
    }
  }

  async verifyWebhook(
    payload: Record<string, any>
  ): Promise<PaymentVerificationResult | null> {
    const valId = payload.val_id;
    const tranId = payload.tran_id;

    if (!valId) {
      return null;
    }

    return this.verifyPayment(valId, tranId);
  }

  private mapPaymentMethod(cardType?: string): PaymentMethod {
    if (!cardType) return "OTHER";
    const upper = cardType.toUpperCase();
    if (upper.includes("BKASH")) return "BKASH";
    if (upper.includes("NAGAD")) return "NAGAD";
    if (upper.includes("ROCKET")) return "ROCKET";
    if (
      upper.includes("VISA") ||
      upper.includes("MASTER") ||
      upper.includes("AMEX")
    ) {
      return "CARD";
    }
    return "OTHER";
  }
}
