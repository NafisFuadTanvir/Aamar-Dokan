"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItemType {
  productId: string;
  variantId?: string | null;
  name: string;
  variantLabel?: string | null;
  pricePoisha: number;
  quantity: number;
  imageId?: string | null;
  maxStock: number;
}

interface CartContextType {
  items: CartItemType[];
  addItem: (item: CartItemType) => void;
  removeItem: (productId: string, variantId?: string | null) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string | null
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotalPoisha: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bd_store_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  }, [items, isLoaded]);

  const addItem = (newItem: CartItemType) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (it) =>
          it.productId === newItem.productId &&
          (it.variantId || null) === (newItem.variantId || null)
      );

      if (index > -1) {
        const copy = [...prev];
        const updatedQty = Math.min(
          copy[index].quantity + newItem.quantity,
          newItem.maxStock || 99
        );
        copy[index] = { ...copy[index], quantity: updatedQty };
        return copy;
      }
      return [...prev, newItem];
    });
    setIsOpen(true);
  };

  const removeItem = (productId: string, variantId?: string | null) => {
    setItems((prev) =>
      prev.filter(
        (it) =>
          !(
            it.productId === productId &&
            (it.variantId || null) === (variantId || null)
          )
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string | null
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }
    setItems((prev) =>
      prev.map((it) => {
        if (
          it.productId === productId &&
          (it.variantId || null) === (variantId || null)
        ) {
          return { ...it, quantity: Math.min(quantity, it.maxStock || 99) };
        }
        return it;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);
  const subtotalPoisha = items.reduce(
    (sum, it) => sum + it.pricePoisha * it.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotalPoisha,
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
