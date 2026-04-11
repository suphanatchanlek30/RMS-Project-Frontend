"use client";

import CashierAuthCard from "./cashier-auth-card";
import { CASHIER_AUTH } from "@/lib/constants/cashier-auth.constants";

export default function CashierAuthLogin() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('${CASHIER_AUTH.bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-red-900/70"></div>

      {/* content */}
      <div className="relative z-10">
        <CashierAuthCard />
      </div>
    </div>
  );
}