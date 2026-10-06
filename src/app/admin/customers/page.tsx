import React from "react";
import { db } from "@/lib/db";
import { CustomerListClient, SerializedCustomer } from "./CustomerListClient";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  let serializedCustomers: SerializedCustomer[] = [];

  try {
    const users = await db.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            totalPoisha: true,
            paymentStatus: true,
            orderStatus: true,
          },
        },
        addresses: {
          select: {
            id: true,
            recipientName: true,
            phone: true,
            addressLine: true,
            areaOrThana: true,
            district: true,
          },
          orderBy: { isDefault: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    serializedCustomers = users.map((u) => {
      // Calculate total spent on PAID orders (or all non-cancelled orders)
      const totalSpent = u.orders
        .filter((o) => o.paymentStatus === "PAID")
        .reduce((sum, o) => sum + o.totalPoisha, BigInt(0));

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        status: u.status,
        createdAt: u.createdAt.toISOString(),
        lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
        ordersCount: u.orders.length,
        totalSpentPoisha: totalSpent.toString(),
        addresses: u.addresses,
      };
    });
  } catch (e) {
    console.error("Admin customers fetch error:", e);
  }

  return <CustomerListClient initialCustomers={serializedCustomers} />;
}
