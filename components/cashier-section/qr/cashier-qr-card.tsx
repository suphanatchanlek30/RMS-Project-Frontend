"use client";

import { useRouter } from "next/navigation";
import CashierQrImage from "./cashier-qr-image";

export default function CashierQrCard({ tableId }: { tableId: string }) {
  const router = useRouter();

  return (
    <div className="bg-[var(--panel-bg)] w-[420px] rounded-xl shadow-xl p-6 text-center">

      {/* title */}
      <div className="bg-[var(--bg)] py-3 rounded-lg text-3xl font-bold mb-6">
        QrCode Order
      </div>

      {/* QR */}
      <CashierQrImage tableId={tableId} />

      {/* buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => router.back()}
          className="bg-[var(--bg)] px-8 py-2 rounded-lg font-semibold text-2xl shadow"
        >
          Back
        </button>

        <button
          className="bg-[var(--bg)] px-6 py-2 rounded-lg font-semibold text-2xl shadow"
          onClick={() => window.print()}
        >
          Print Qrcode
        </button>
      </div>

    </div>
  );
}