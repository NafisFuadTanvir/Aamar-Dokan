import { describe, it, expect } from "vitest";
import { parseCustomerPhone } from "@/components/product/ProductReviewsSection";

describe("Product Reviews Customer Phone Masking & Privacy Blur", () => {
  it("masks middle digits for 01323237011 accurately as requested", () => {
    const result = parseCustomerPhone("01323237011");
    // Specifically requested by user:
    // prefix: 013, middle to be blurred/hidden: 232370, suffix: 11
    expect(result.prefix).toBe("013");
    expect(result.middle).toBe("232370");
    expect(result.suffix).toBe("11");
  });

  it("handles numbers with +88 country code", () => {
    const result = parseCustomerPhone("+8801323237011");
    expect(result.prefix).toBe("013");
    expect(result.middle).toBe("232370");
    expect(result.suffix).toBe("11");
  });

  it("handles numbers with spaces or dashes", () => {
    const result = parseCustomerPhone("01712-345678");
    expect(result.prefix).toBe("017");
    expect(result.middle).toBe("123456");
    expect(result.suffix).toBe("78");
  });

  it("generates deterministic fallback for reviews without explicit phone", () => {
    const res1 = parseCustomerPhone(null, "customer-seed-1");
    const res2 = parseCustomerPhone(null, "customer-seed-1");
    expect(res1.prefix).toBe(res2.prefix);
    expect(res1.middle).toBe(res2.middle);
    expect(res1.suffix).toBe(res2.suffix);
    expect(res1.prefix.length).toBe(3);
    expect(res1.suffix.length).toBe(2);
  });
});
