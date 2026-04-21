"use client";

import CashierHeader from "../common/cashier-header";
import CashierQrCard from "./cashier-qr-card";

export default function CashierQrPage({ tableId }: { tableId: string }) {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-16">
        <CashierQrCard tableId={tableId} />
      </div>
    </div>
  );
}