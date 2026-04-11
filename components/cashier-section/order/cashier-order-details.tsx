"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CashierHeader from "../common/cashier-header";
import CashierOrderItem from "./cashier-order-item";

type OrderItemType = {
  name: string;
  qty: number;
};

export default function CashierOrderDetails({ tableId }: { tableId: string }) {
  const router = useRouter();

  const [pending, setPending] = useState<OrderItemType[]>([]);
  const [done, setDone] = useState<OrderItemType[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // mock เฉพาะโต๊ะที่ "มีลูกค้า" (โต๊ะแดง เช่น T03)
        const mockDataByTable: Record<string, any> = {
          "3": {
            pending: [
              { name: "กะเพรา หมูสับ", qty: 1 },
              { name: "ข้าวผัด ไก่", qty: 2 },
            ],
            done: [
              { name: "ต้มยำกุ้ง", qty: 1 },
            ],
          },
        };

        //ถ้าโต๊ะไม่มีข้อมูล → ถือว่า "ว่าง"
        const data = mockDataByTable[tableId] || {
          pending: [],
          done: [],
        };

        // ตอนมี backend เปลี่ยนแค่นี้
        // const res = await fetch(`http://localhost:5000/orders/${tableId}`);
        // const data = await res.json();

        setPending(data.pending);
        setDone(data.done);

      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, [tableId]);

  const tableName = `T${String(tableId).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center mt-5">
        <div className="bg-[var(--card-bg)] w-[360px] h-[500px] rounded-xl shadow-md p-6 flex flex-col">

          {/* table name */}
          <div className="bg-[var(--bg)] px-6 py-1 rounded-md w-fit mb-4 font-semibold">
            {tableName}
          </div>

          {/* pending */}
          <h2 className="font-semibold mb-2">รายการที่ยังไม่ได้ทำ</h2>

          <div className="flex flex-col gap-3 mb-4 overflow-y-auto max-h-[150px] pr-1">
            {pending.length > 0 ? (
              pending.map((item, i) => (
                <CashierOrderItem key={i} item={item} />
              ))
            ) : (
              <p className="text-sm text-gray-500">ไม่มีรายการ</p>
            )}
          </div>

          {/* done */}
          <h2 className="font-semibold mb-2">รายการที่เสร็จสิ้น</h2>

          <div className="flex flex-col gap-3 mb-6 overflow-y-auto max-h-[150px] pr-1">
            {done.length > 0 ? (
              done.map((item, i) => (
                <CashierOrderItem key={i} item={item} />
              ))
            ) : (
              <p className="text-sm text-gray-500">ไม่มีรายการ</p>
            )}
          </div>

          {/* back */}
          <div className="mt-auto">
            <button
                onClick={() => router.back()}
                className="bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white px-10 py-2 rounded-lg mx-auto block font-semibold"
            >
            Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}