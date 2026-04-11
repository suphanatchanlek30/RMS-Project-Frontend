"use client";

import { LogOut } from "lucide-react";
import { CASHIER_NAME } from "@/lib/constants/cashier.constants";

export default function CashierHeader() {
  return (
    <div className="relative">
      <div
        className="px-6 py-5 flex justify-between items-center"
        style={{
          background: `
            linear-gradient(var(--panel-bg), var(--panel-bg)),
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,0.05) 0px,
              rgba(255,255,255,0.05) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(0,0,0,0.08) 0px,
              rgba(0,0,0,0.08) 1px,
              transparent 1px,
              transparent 3px
            )
          `,
        }}
      >
        <div className="bg-[var(--bg)] text-black px-6 py-2 rounded-lg shadow-md">
          {CASHIER_NAME}
        </div>

        <button className="text-white hover:scale-110 transition">
          <LogOut size={36} strokeWidth={2} />
        </button>
      </div>

      <div
        className="w-full h-3"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 2px, #1a1a1a 4px)",
        }}
      />
    </div>
  );
}