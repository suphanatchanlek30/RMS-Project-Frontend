"use client";

import { useRouter } from "next/navigation";
import CashierHeader from "../common/cashier-header";

type BillItem = {
  name: string;
  qty: number;
  price: number;
};

const billItems: BillItem[] = [
  {
    name: "กะเพรา (หมูสับ / ไก่ / หมูกรอบ / กะหล่ำ) ราดข้าว",
    qty: 1,
    price: 50,
  },
  {
    name: "กะเพรา (หมูสับ / ไก่ / หมูกรอบ / กะหล่ำ) ราดข้าว",
    qty: 1,
    price: 50,
  },
  {
    name: "น้ำเปล่า (เย็น / น้ำแข็งเปล่า)",
    qty: 2,
    price: 10,
  },
];

export default function CashierCheckBillPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const tableName = `T${String(tableId).padStart(2, "0")}`;
  const now = new Date();
  const hour = now.getHours() % 12 || 12;
  const minute = String(now.getMinutes()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const timeLabel = `${tableName} : ${hour}.${minute} ${ampm}`;
  const totalQty = billItems.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = billItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-10 px-4">
        <div className="bg-[#e5e5e5] max-w-[680px] w-full rounded-3xl shadow-2xl p-8">
          <div className="text-lg font-semibold mb-6">{timeLabel}</div>

          <div className="space-y-4">
            {billItems.map((item, index) => (
              <div key={index} className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-red-200 text-red-800 flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-1">x{item.qty}</div>
                </div>
                <div className="text-right font-semibold text-sm sm:text-base">{item.price.toFixed(2)}</div>
              </div>
            ))}

            <div className="border-t border-gray-300 pt-4 mt-2 flex items-center justify-between text-base sm:text-lg font-semibold">
              <span>Total</span>
              <div className="flex items-center gap-8">
                <span className="text-sm text-gray-500">x{totalQty}</span>
                <span>{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <button
                onClick={() => router.back()}
                className="bg-white px-10 py-3 rounded-3xl text-2xl font-bold shadow-lg"
              >
                Cash
              </button>
              <button
                onClick={() => router.push(`/cashier/table/${tableId}/qr`)}
                className="bg-white px-10 py-3 rounded-3xl text-2xl font-bold shadow-lg"
              >
                Qr Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
