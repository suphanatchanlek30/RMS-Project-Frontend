"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierFlowStorage, type StoredCheckoutRecord } from "@/services/cashierFlowStorage";
import CashierHeader from "../common/cashier-header";

export default function CashierPaymentSuccessPage({
  tableId,
}: {
  tableId: string;
}) {
  const router = useRouter();
  const [checkoutRecord, setCheckoutRecord] = useState<StoredCheckoutRecord | null>(null);

  useEffect(() => {
    setCheckoutRecord(cashierFlowStorage.getCheckoutRecord(Number(tableId)));
  }, [tableId]);

  const handlePrint = () => {
    window.print();
  };

  const handleOk = () => {
    cashierFlowStorage.clearCheckoutRecord(Number(tableId));
    router.push("/cashier");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <CashierHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-gray-100 px-10 py-12 shadow-sm">
          <div className="relative flex items-center justify-center w-36 h-36">
            <span className="absolute top-2 left-4 text-red-300 text-xl">✦</span>
            <span className="absolute top-4 right-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-4 left-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-2 right-6 text-red-300 text-xs">✦</span>
            <span className="absolute top-10 left-0 text-red-100 text-xs">·</span>
            <span className="absolute top-6 right-8 text-red-100 text-xs">·</span>
            <span className="absolute bottom-6 right-0 text-red-100 text-xs">·</span>

            <div className="w-20 h-20 bg-[#C0392B] rounded-full flex items-center justify-center shadow-md">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M10 20L17 27L30 13"
                  stroke="white"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-center text-gray-700 font-medium text-base">Payment Completed</p>

          <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm text-black shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Receipt No.</span>
              <span className="font-bold">{checkoutRecord?.receiptNumber ?? "-"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-black/55">Payment ID</span>
              <span className="font-bold">{checkoutRecord?.paymentId ?? "-"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-black/55">Change</span>
              <span className="font-bold">{checkoutRecord ? `${checkoutRecord.changeAmount.toFixed(2)} ฿` : "-"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="text-black/55">Table Status</span>
              <span className="font-bold">{checkoutRecord?.tableStatus ?? "AVAILABLE"}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handlePrint}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg tracking-widest text-sm transition-colors"
            >
              PRINT RECIPE
            </button>
            <button
              onClick={handleOk}
              className="w-full bg-[#C0392B] hover:bg-[#a93226] text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}