"use client";

import { useRouter } from "next/navigation";
import CashierHeader from "../common/cashier-header";

export default function CashierPaymentSuccessPage({
  tableId,
  customerName = "นาย XXX XXX",
}: {
  tableId: string;
  customerName?: string;
}) {
  const router = useRouter();

  const handlePrint = () => {
    window.print();
  };

  const handleOk = () => {
    router.push("/cashier");
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">

      {/* Header */}
      <div className="bg-[#7B1A1A] flex items-center justify-between px-6 py-4">
        <div className="bg-white rounded-md px-6 py-2 text-gray-800 font-medium text-sm">
          {customerName}
        </div>
        <button
          onClick={() => router.back()}
          className="text-white text-2xl font-bold"
        >
          &#x5B;&#x2192;
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-100 rounded-2xl px-16 py-12 flex flex-col items-center gap-6 shadow-sm w-[340px]">

          {/* Sparkles + Icon */}
          <div className="relative flex items-center justify-center w-36 h-36">
            {/* sparkles */}
            <span className="absolute top-2 left-4 text-red-300 text-xl">✦</span>
            <span className="absolute top-4 right-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-4 left-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-2 right-6 text-red-300 text-xs">✦</span>
            <span className="absolute top-10 left-0 text-red-100 text-xs">·</span>
            <span className="absolute top-6 right-8 text-red-100 text-xs">·</span>
            <span className="absolute bottom-6 right-0 text-red-100 text-xs">·</span>

            {/* Circle checkmark */}
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

          <p className="text-gray-700 font-medium text-base">Payment Completed</p>

          {/* Buttons */}
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