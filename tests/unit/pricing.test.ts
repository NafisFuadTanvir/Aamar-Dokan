import { describe, it, expect } from "vitest";
import { poishaToBDT, bdtToPoisha, formatPrice } from "@/lib/format";
import { calculateDeliveryFeePoisha, DEFAULT_DELIVERY_FEES } from "@/lib/delivery";

describe("Pricing and Poisha Calculations", () => {
  it("converts BDT to poisha accurately without floating-point inaccuracy", () => {
    expect(bdtToPoisha(100)).toBe(BigInt(10000));
    expect(bdtToPoisha(250.5)).toBe(BigInt(25050));
    expect(bdtToPoisha(850.75)).toBe(BigInt(85075));
    expect(bdtToPoisha(0)).toBe(BigInt(0));
  });

  it("converts poisha to BDT accurately", () => {
    expect(poishaToBDT(BigInt(10000))).toBe(100);
    expect(poishaToBDT(BigInt(25050))).toBe(250.5);
    expect(poishaToBDT(85075)).toBe(850.75);
  });

  it("formats BDT currency with Bengali/English symbol nicely", () => {
    expect(formatPrice(BigInt(85000))).toBe("৳850");
    expect(formatPrice(BigInt(25050))).toBe("৳250.50");
    expect(formatPrice(0)).toBe("৳0");
  });

  it("calculates district delivery fee properly (Inside vs Outside Dhaka)", () => {
    // Dhaka
    expect(calculateDeliveryFeePoisha("dhaka")).toBe(
      DEFAULT_DELIVERY_FEES.INSIDE_DHAKA_POISHA
    );
    expect(calculateDeliveryFeePoisha("dhaka")).toBe(7000); // ৳70

    // Outside Dhaka (Chittagong, Sylhet, Bogra, etc.)
    expect(calculateDeliveryFeePoisha("chittagong")).toBe(
      DEFAULT_DELIVERY_FEES.OUTSIDE_DHAKA_POISHA
    );
    expect(calculateDeliveryFeePoisha("chittagong")).toBe(13000); // ৳130
    expect(calculateDeliveryFeePoisha("sylhet")).toBe(13000);
  });
});
