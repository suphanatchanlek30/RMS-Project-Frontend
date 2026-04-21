// app/(public-session)/cart/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CartItemCard } from "@/components/public-section/cart/cart-item-card";
import { useCart } from "@/components/public-section/cart-context";
import { publicService } from "@/services/public.service";
import { publicSession } from "@/services/publicSession";
import { publicOrderStorage } from "../../../../services/publicOrderStorage";

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOrder = async () => {
    const qrToken = publicSession.getQrToken();
    if (!qrToken) {
      setErrorMessage("ไม่พบ qrToken กรุณาสแกน QR ใหม่อีกครั้ง");
      return;
    }

    const validItems = items.filter((item) => typeof item.menuId === "number" && item.quantity > 0);
    if (!validItems.length) {
      setErrorMessage("ไม่พบรายการอาหารที่พร้อมส่งคำสั่งซื้อ");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await publicService.createCustomerOrder({
      qrToken,
      items: validItems.map((item) => ({
        menuId: item.menuId as number,
        quantity: item.quantity,
        options: item.selectedOptions,
        selectedOptions: item.selectedOptions,
        note: item.note,
      })),
    });

    if (!response.success || !response.data) {
      setErrorMessage(response.message);
      setIsSubmitting(false);
      return;
    }

    publicOrderStorage.setLastOrder(response.data);
    clearCart();
    router.push("/home/order-success");
    setIsSubmitting(false);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-center px-4 py-3 border-b border-gray-100 relative">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="กลับ"
          className="absolute left-4 flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h1 className="text-base font-semibold text-gray-800">Cart</h1>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-3">
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-4">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <p className="text-gray-400 text-sm">ตะกร้าว่างอยู่</p>
            <button
              onClick={() => router.push("/home/menu")}
              className="mt-3 text-sm font-semibold text-(--button-bg)"
            >
              เลือกเมนู
            </button>
          </div>
        ) : (
          items.map((item) => (
            <CartItemCard key={item.cartItemId} item={item} onRemove={removeItem} />
          ))
        )}
      </div>

      {/* Bottom sticky */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between gap-4 bg-white border-t border-gray-100 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
          <div>
            <p className="text-xs text-gray-500">ราคาทั้งหมด</p>
            <p className="text-base font-bold text-gray-900">฿{totalPrice}</p>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-(--button-bg) text-sm font-bold text-white shadow transition-colors hover:bg-(--button-bg-hover) active:scale-95"
          >
            {isSubmitting ? "กำลังส่งออเดอร์..." : "สั่งอาหาร"}
          </button>
        </div>
      )}
    </main>
  );
}
