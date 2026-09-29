import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/orders/create/route";
import { NextRequest } from "next/server";

describe("Strict COD Rejection Rule", () => {
  it("rejects order creation requests with paymentMethod='COD' with status 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod: "COD",
        customerName: "Test Customer",
        customerPhone: "01700000000",
        addressLine: "Test Address",
        areaOrThana: "Dhanmondi",
        districtId: "dhaka",
        items: [{ productId: "p1", quantity: 1 }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const body = await res.json();
    expect(body.error).toContain("ক্যাশ অন ডেলিভারি (COD) সমর্থিত নয়");
  });

  it("rejects lowercase 'cod' requests with status 400", async () => {
    const req = new NextRequest("http://localhost:3000/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentMethod: "cod",
        customerName: "Test Customer",
        customerPhone: "01700000000",
        addressLine: "Test Address",
        areaOrThana: "Dhanmondi",
        districtId: "dhaka",
        items: [{ productId: "p1", quantity: 1 }],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
