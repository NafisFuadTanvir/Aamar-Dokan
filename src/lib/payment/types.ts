export type PaymentMethod = "BKASH" | "NAGAD" | "ROCKET" | "CARD" | "OTHER";

export type PaymentConfigStatus = "NOT_CONFIGURED" | "READY" | "ERROR";

export interface PaymentSessionInit {
  orderId: string;
  orderNumber: string;
  amountPoisha: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: string;
  district: string;
  ipnUrl: string;
  successUrl: string;
  failUrl: string;
  cancelUrl: string;
}

export interface PaymentSessionResult {
  status: "SUCCESS" | "FAILED" | "NOT_CONFIGURED";
  redirectUrl?: string;
  sessionKey?: string;
  errorMessage?: string;
}

export interface PaymentVerificationResult {
  isVerified: boolean;
  orderNumber: string;
  transactionId: string;
  amountPoisha: number;
  currency: string;
  paymentMethod: PaymentMethod;
  verifiedAt: Date;
  rawSummary: string;
  failureReason?: string;
}

export interface PaymentAdapter {
  name: string;
  getConfigStatus(): PaymentConfigStatus;
  createPaymentSession(init: PaymentSessionInit): Promise<PaymentSessionResult>;
  verifyPayment(valId: string, tranId?: string): Promise<PaymentVerificationResult>;
  verifyWebhook(payload: Record<string, any>): Promise<PaymentVerificationResult | null>;
}
