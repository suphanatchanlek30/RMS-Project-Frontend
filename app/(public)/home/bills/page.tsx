// app/(public-session)/bills/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { BillItemCard } from "@/components/public-section/bills/bill-item-card";
import type { OrderBillItem } from "@/components/public-section/public-section.types";

// Mock bill data — in a real app this would come from an API
const MOCK_BILLS: OrderBillItem[] = [
  {
    id: "bill-1",
    name: "กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว",
    options: ["หมูสับ"],
    price: 50,
    status: "preparing",
  },
];

export default function BillsPage() {
  const router = useRouter();

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
        {MOCK_BILLS.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 text-sm">ยังไม่มีรายการสั่งอาหาร</p>
          </div>
        ) : (
          MOCK_BILLS.map((bill) => (
            <BillItemCard key={bill.id} item={bill} />
          ))
        )}
      </div>
    </main>
  );
}
