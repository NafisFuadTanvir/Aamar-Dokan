import { PaymentAdapter } from "./types";
import { SSLCommerzAdapter } from "./sslcommerz";
import { MockPaymentAdapter } from "./mock";

export * from "./types";

export function getPaymentAdapter(): PaymentAdapter {
  // If SSLCommerz credentials are configured, use SSLCommerz
  if (
    process.env.SSLCOMMERZ_STORE_ID &&
    process.env.SSLCOMMERZ_STORE_PASSWORD
  ) {
    return new SSLCommerzAdapter();
  }

  // If in development mode and SSLCommerz is NOT configured, we can fallback to Mock in dev only
  if (process.env.NODE_ENV === "development") {
    return new MockPaymentAdapter();
  }

  // In production, always return SSLCommerzAdapter (which will report NOT_CONFIGURED safely without crash)
  return new SSLCommerzAdapter();
}
