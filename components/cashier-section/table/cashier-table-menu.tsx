"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import CashierHeader from "../common/cashier-header";

export default function CashierTableMenu({ tableId }: { tableId: string }) {
  const router = useRouter();

  const tableName = `T${String(tableId).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-20">
        <div className="bg-[var(--panel-bg)] w-[400px] rounded-xl shadow-xl p-6 relative">

          <div className="absolute top-4 left-6 bg-[var(--bg)] px-10 py-1 rounded-md text-xl font-semibold">
            {tableName}
          </div>

          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-white"
          >
            <X size={28} />
          </button>

          <div className="flex flex-col gap-5 mt-12">
            <button className="bg-[var(--bg)] py-4 rounded-lg text-2xl font-bold shadow">
              QrCode
            </button>

            <button
              onClick={() => router.push(`/cashier/table/${tableId}/order`)}
              className="bg-[var(--bg)] py-4 rounded-lg text-2xl font-bold shadow"
            >
              Order Details
            </button>

            <button className="bg-[var(--bg)] py-4 rounded-lg text-2xl font-bold shadow">
              Check Bills
            </button>

            <button className="bg-[var(--bg)] py-2 rounded-lg text-xl font-semibold shadow w-40 mx-auto">
              Change Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}