// app/(public-session)/layout.tsx
import type { ReactNode } from "react";
import { CartProvider } from "@/components/public-section/cart-context";

export default function PublicSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
