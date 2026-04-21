// components/public-section/cart-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { CartItem, MenuItem } from "./public-section.types";

interface CartContextValue {
  items: CartItem[];
  addItem: (
    menuItem: MenuItem,
    quantity: number,
    selectedOptions: string[],
    note: string,
    totalPrice: number
  ) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback(
    (
      menuItem: MenuItem,
      quantity: number,
      selectedOptions: string[],
      note: string,
      totalPrice: number
    ) => {
      const cartItemId = `${menuItem.id}-${Date.now()}`;
      setItems((prev) => [
        ...prev,
        { cartItemId, menuItem, quantity, selectedOptions, note, totalPrice },
      ]);
    },
    []
  );

  const removeItem = useCallback((cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalPrice = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, totalCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
