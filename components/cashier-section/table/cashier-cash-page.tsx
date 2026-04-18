"use client";

import { useMemo, useState } from "react";
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

export default function CashierCashPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [paidText, setPaidText] = useState("200");

  const tableName = `T${String(tableId).padStart(2, "0")}`;
  const now = new Date();
  const hour = now.getHours() % 12 || 12;
  const minute = String(now.getMinutes()).padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const timeLabel = `${tableName} : ${hour}.${minute} ${ampm}`;
  const totalAmount = billItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  const paidAmount = Number(paidText || 0);
  const changeAmount = Math.max(0, paidAmount - totalAmount);
  const dateLabel = `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(now.getFullYear()).slice(-2)}`;

  const keypadValues = [50, 100, 500, 1000];
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL"];

  const updatePaidText = (value: string) => {
    if (value === "DEL") {
      setPaidText((prev) => prev.slice(0, -1) || "0");
      return;
    }

    if (value === ".") {
      if (paidText.includes(".")) return;
      setPaidText((prev) => (prev === "" ? "0." : `${prev}.`));
      return;
    }

    setPaidText((prev) => {
      const next = prev === "0" ? value : `${prev}${value}`;
      return next;
    });
  };

  const applyPreset = (value: number) => {
    setPaidText(String(value));
  };

  const handleConfirmPay = () => {
  router.push(`/cashier/table/${tableId}/payment-success`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-12 px-4 pb-10">
        <div className="bg-[#d7d7d7] max-w-[1040px] w-full rounded-3xl shadow-2xl p-5 mx-auto">
          <div className="grid gap-4 min-w-0 xl:grid-cols-[1.05fr_0.95fr] max-w-[900px] mx-auto">
            <div className="bg-white rounded-[2rem] p-4 shadow-lg min-w-0">
              <div className="text-center mb-6">
                <img src="/cashier-section/logo.png" alt="โลโก้ร้าน" className="mx-auto h-16 w-auto" />
                <p className="mt-3 text-xs font-semibold">สาขา ธรรมศาสตร์ ศูนย์ลอนดอน</p>
                <p className="text-xs text-gray-500">หมู่บ้านโมนาโก ซอยกะเพราความเร็วสูง</p>
                <p className="text-xs text-gray-500">ถ.สปีด แขวงผัดไทย เขตพระนคร 10110</p>
              </div>

              <div className="text-base font-semibold mb-5">{timeLabel}</div>
              <div className="space-y-4">
                {billItems.map((item, index) => (
                  <div key={index} className="flex items-start justify-between gap-4">
                    <div className="min-w-[0]">
                      <div className="font-semibold text-sm sm:text-base">{item.name}</div>
                      <div className="text-xs text-gray-500 mt-1">x{item.qty}</div>
                    </div>
<div className="text-right font-semibold text-sm sm:text-base">{(item.qty * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-5 mt-5 text-base font-bold flex items-center justify-between">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)} ฿</span>
              </div>
              <div className="text-sm font-semibold mt-2">Change {changeAmount.toFixed(2)}฿</div>
              <div className="text-xs text-gray-500 mt-3">{dateLabel}</div>
              <div className="text-xs text-center text-gray-400 mt-6">
                ******************ขอบคุณที่ใช้บริการ******************
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-5 shadow-lg">
              <div className="text-center text-xs text-gray-500 mb-5">ใส่จำนวนเงิน</div>
              <div className="mb-5 flex items-center justify-center">
                <div className="w-full max-w-[220px] rounded-3xl border border-red-500 bg-white px-3 py-2 text-center text-3xl font-bold text-black">
                  {paidText}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-4 gap-2">
                {keypadValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyPreset(value)}
                    className="rounded-full bg-gray-300 py-2 text-sm font-semibold text-black transition hover:bg-gray-400"
                  >
                    {value}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {digits.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => updatePaidText(digit)}
                    className={`rounded-xl py-4 text-xl font-bold ${digit === "DEL" ? "bg-red-600 text-white" : "bg-gray-300 text-black"}`}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => router.push(`/cashier/table/${tableId}`)}
                className="mt-5 w-full rounded-3xl bg-red-700 px-5 py-3 text-xl font-bold uppercase text-white shadow-lg"
              >
                ENTER
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
                onClick={handleConfirmPay}
                className="bg-white text-black text-2xl font-bold rounded-3xl px-24 py-4 shadow-lg hover:bg-gray-50 transition-colors"
              >
                Confirm pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
