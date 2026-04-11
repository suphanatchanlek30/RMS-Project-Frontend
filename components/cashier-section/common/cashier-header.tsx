"use client";

import { LogOut } from "lucide-react";
import { CASHIER_NAME } from "@/lib/constants/cashier.constants";

export default function CashierHeader() {
  return (
    <div className="relative">

      <div
        className="px-6 py-5 flex justify-between items-center relative"
        style={{
          backgroundImage: "url('/cashier-section/header-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-red-900/70"></div>

        {/* content */}
        <div className="relative z-10 flex justify-between w-full items-center">

          <div className="bg-[var(--bg)] text-black px-6 py-2 rounded-lg shadow-md">
            {CASHIER_NAME}
          </div>

          <button className="text-white hover:scale-110 transition">
            <LogOut size={36} strokeWidth={2} />
          </button>

        </div>
      </div>

      {/* เส้นล่าง */}
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