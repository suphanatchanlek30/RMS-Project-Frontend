// app/(public-session)/bills/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BillItemCard } from "@/components/public-section/bills/bill-item-card";
import type { OrderBillItem } from "@/components/public-section/public-section.types";
import { publicService } from "@/services/public.service";
import { publicSession } from "@/services/publicSession";

export default function BillsPage() {
  const router = useRouter();
  const [items, setItems] = useState<OrderBillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderStatus = async () => {
      const qrToken = publicSession.getQrToken();
      if (!qrToken) {
        setErrorMessage("ไม่พบ qrToken กรุณาสแกน QR ใหม่อีกครั้ง");
        setIsLoading(false);
        return;
      }

      const response = await publicService.getCustomerOrderStatus(qrToken);
      if (!response.success || !response.data) {
        setErrorMessage(response.message);
        setIsLoading(false);
        return;
      }

      const nextItems = response.data.orders.flatMap((order) =>
        order.items.map((item) => {
          const normalizedStatus: OrderBillItem["status"] =
            item.itemStatus.toUpperCase() === "PREPARING"
              ? "preparing"
              : item.itemStatus.toUpperCase() === "READY"
                ? "ready"
                : "served";

          return {
            id: `${order.orderId}-${item.orderItemId}`,
            name: item.menuName,
            options: [],
            price: item.unitPrice * item.quantity,
            status: normalizedStatus,
          };
        })
      );

      setItems(nextItems);
      setIsLoading(false);
    };

    void loadOrderStatus();
  }, []);

  const emptyLabel = useMemo(() => {
    if (isLoading) return "กำลังโหลดรายการสั่งอาหาร";
    return "ยังไม่มีรายการสั่งอาหาร";
  }, [isLoading]);

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
        <h1 className="text-base font-semibold text-gray-800">ใบเสร็จ</h1>
      </div>

      {/* Bill items */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {errorMessage ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">{emptyLabel}</p>
          </div>
        ) : (
          items.map((bill) => (
            <BillItemCard key={bill.id} item={bill} />
          ))
        )}
      </div>
    </main>
  );
}
