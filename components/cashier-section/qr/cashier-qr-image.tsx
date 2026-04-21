"use client";

import { useMemo } from "react";

export default function CashierQrImage({ qrCodeUrl, qrToken }: { qrCodeUrl?: string | null; qrToken?: string | null }) {
  const qrPayload = useMemo(() => {
    if (qrToken) {
      if (typeof window === "undefined") return `/q/${qrToken}`;
      return `${window.location.origin}/q/${qrToken}`;
    }

    if (qrCodeUrl) return qrCodeUrl;
    return null;
  }, [qrCodeUrl, qrToken]);

  if (!qrPayload) {
    return (
      <div className="text-gray-500 text-sm">
        ไม่มี QR Code สำหรับโต๊ะนี้
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg w-fit mx-auto">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrPayload)}`}
        alt="qr"
      />
    </div>
  );
}