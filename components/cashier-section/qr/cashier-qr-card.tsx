"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierFlowStorage } from "@/services/cashierFlowStorage";
import { cashierService, type QrSession, type TableSession } from "@/services/cashier.service";
import CashierQrImage from "./cashier-qr-image";

export default function CashierQrCard({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<TableSession | null>(null);
  const [qrSession, setQrSession] = useState<QrSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadQrFlow = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const currentSessionResponse = await cashierService.getCurrentSession(Number(tableId));
      if (!currentSessionResponse.success || !currentSessionResponse.data) {
        setErrorMessage(currentSessionResponse.message || "ไม่พบ session ที่เปิดอยู่สำหรับโต๊ะนี้");
        setIsLoading(false);
        return;
      }

      const activeSession = currentSessionResponse.data;
      setSession(activeSession);

      const storedQr = cashierFlowStorage.getQrSession(activeSession.sessionId);
      if (storedQr) {
        const isExpired = storedQr.expiredAt ? new Date(storedQr.expiredAt).getTime() <= Date.now() : false;
        if (!isExpired) {
          setQrSession(storedQr);
          setIsLoading(false);
          return;
        }

        cashierFlowStorage.clearQrSession(activeSession.sessionId);
      }

      const createQrResponse = await cashierService.createQrSession(activeSession.sessionId);
      if (!createQrResponse.success || !createQrResponse.data) {
        setErrorMessage(createQrResponse.message);
        setIsLoading(false);
        return;
      }

      cashierFlowStorage.setQrSession(createQrResponse.data);
      setQrSession(createQrResponse.data);
      setIsLoading(false);
    };

    void loadQrFlow();
  }, [tableId]);

  const tableLabel = session?.tableNumber ?? `T${String(tableId).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-xl rounded-4xl bg-(--panel-bg) p-6 text-center shadow-[0_20px_80px_rgba(0,0,0,0.18)] sm:p-8">

      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="rounded-xl bg-(--bg) px-6 py-2 text-xl font-bold">{tableLabel}</div>
        {session ? <div className="text-sm font-semibold text-white">Session #{session.sessionId}</div> : null}
      </div>

      <div className="bg-(--bg) py-3 rounded-lg text-3xl font-bold mb-6">
        QrCode Order
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-white/90 p-10 shadow-inner">
          <div className="mx-auto h-60 w-60 animate-pulse rounded-3xl bg-black/10" />
          <p className="mt-4 text-sm text-black/50">กำลังสร้าง QR จาก session ปัจจุบัน...</p>
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl bg-white/95 p-8 text-left shadow-inner">
          <p className="text-lg font-bold text-red-700">ไม่สามารถแสดง QR ได้</p>
          <p className="mt-2 text-sm text-black/65">{errorMessage}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-red-700 px-5 py-3 text-sm font-semibold text-white"
            >
              ลองใหม่
            </button>
            <button
              onClick={() => router.push(`/cashier/table/${tableId}`)}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
              กลับไปหน้าโต๊ะ
            </button>
          </div>
        </div>
      ) : (
        <>
          <CashierQrImage qrCodeUrl={qrSession?.qrCodeUrl ?? null} qrToken={qrSession?.qrToken ?? null} />
          <div className="mt-5 rounded-2xl bg-white/90 px-5 py-4 text-left text-sm text-black shadow-md">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-black/60">QR Token</span>
              <span className="font-bold text-black">{qrSession?.qrToken ?? "-"}</span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-4">
              <span className="font-semibold text-black/60">หมดอายุ</span>
              <span className="font-bold text-black">
                {qrSession?.expiredAt ? new Date(qrSession.expiredAt).toLocaleString("th-TH") : "-"}
              </span>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center gap-6 mt-6">
        <button
          onClick={() => router.back()}
          className="bg-(--bg) px-8 py-2 rounded-lg font-semibold text-2xl shadow"
        >
          Back
        </button>

        <button
          className="bg-(--bg) px-6 py-2 rounded-lg font-semibold text-2xl shadow"
          onClick={() => window.print()}
        >
          Print Qrcode
        </button>
      </div>

    </div>
  );
}