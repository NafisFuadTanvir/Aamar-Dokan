"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
