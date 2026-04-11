"use client";

import { useRouter } from "next/navigation";
import { GREEN_TABLES } from "@/lib/constants/cashier.constants";
import CashierHeader from "../common/cashier-header";

const tables = Array.from({ length: 20 }, (_, i) => {
  const id = i + 1;
  return {
    id,
    name: `T${id.toString().padStart(2, "0")}`,
    isAvailable: GREEN_TABLES.includes(id),
  };
});

export default function CashierTableGrid() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="px-10 py-6">
        <div className="w-fit mx-auto">

          {/* legend */}
          <div className="flex gap-4 mb-4">
            <div className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-1 rounded shadow-md">
              <span>Available</span>
              <span className="w-5 h-5 bg-green-500 rounded-full"></span>
            </div>

            <div className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-1 rounded shadow-md">
              <span>Not Available</span>
              <span className="w-5 h-5 bg-red-500 rounded-full"></span>
            </div>
          </div>

          {/* grid */}
          <div className="grid grid-cols-5 gap-x-10 gap-y-10">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => router.push(`/cashier/table/${t.id}`)}
                className={`w-20 h-20 rounded-lg text-black font-semibold text-xl shadow-md flex items-center justify-center ${
                  t.isAvailable
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}