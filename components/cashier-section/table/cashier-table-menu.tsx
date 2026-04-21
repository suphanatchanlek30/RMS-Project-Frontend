"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { authSession } from "@/services/authSession";
import { cashierService, type TableDetail, type TableSession } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierTableMenu({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [table, setTable] = useState<TableDetail | null>(null);
  const [currentSession, setCurrentSession] = useState<TableSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const numericTableId = Number(tableId);

    const loadTableContext = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const [tableResponse, sessionResponse] = await Promise.all([
        cashierService.getTableById(numericTableId),
        cashierService.getCurrentSession(numericTableId),
      ]);

      if (!tableResponse.success || !tableResponse.data) {
        setErrorMessage(tableResponse.message);
        setIsLoading(false);
        return;
      }

      setTable(tableResponse.data);
      setCurrentSession(sessionResponse.success && sessionResponse.data ? sessionResponse.data : null);
      if (!sessionResponse.success && !/ไม่มี session|ไม่พบ session/i.test(sessionResponse.message)) {
        setErrorMessage(sessionResponse.message);
      }
      setIsLoading(false);
    };

    void loadTableContext();
  }, [tableId]);

  const tableName = useMemo(() => table?.tableNumber ?? `T${String(tableId).padStart(2, "0")}`, [table?.tableNumber, tableId]);
  const canUseSessionActions = currentSession?.sessionStatus === "OPEN";

  const handleOpenTable = async () => {
    const employeeProfile = authSession.getEmployeeProfile();
    if (!employeeProfile) {
      setErrorMessage("ไม่พบข้อมูลพนักงาน กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      return;
    }

    setIsOpening(true);
    setErrorMessage(null);
    const response = await cashierService.openTableSession({
      tableId: Number(tableId),
      employeeId: employeeProfile.employeeId,
    });

    if (!response.success || !response.data) {
      setErrorMessage(response.message);
      setIsOpening(false);
      return;
    }

    setCurrentSession(response.data);
    setTable((previous) =>
      previous
        ? {
            ...previous,
            tableStatus: "OCCUPIED",
          }
        : previous
    );
    setIsOpening(false);
    router.push(`/cashier/table/${tableId}/qr`);
  };

  return (
    <div className="min-h-screen bg-(--bg)">
      <CashierHeader />

      <div className="flex justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative w-full max-w-3xl rounded-4xl bg-(--panel-bg) p-6 shadow-[0_20px_80px_rgba(0,0,0,0.18)] sm:p-8">

          <div className="absolute left-6 top-4 rounded-md bg-(--bg) px-8 py-1 text-xl font-semibold sm:left-8">
            {tableName}
          </div>

          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-white"
          >
            <X size={28} />
          </button>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-[1.75rem] bg-white/95 p-6 text-black shadow-lg">
              <p className="text-sm font-medium text-red-700">Table Overview</p>
              {isLoading ? (
                <div className="mt-4 space-y-3">
                  <div className="h-6 w-40 animate-pulse rounded bg-black/10" />
                  <div className="h-20 animate-pulse rounded-2xl bg-black/10" />
                </div>
              ) : (
                <>
                  <h2 className="mt-3 text-3xl font-black text-[#161616]">{tableName}</h2>
                  <div className="mt-5 rounded-2xl bg-black/4 p-4">
                    <p className="text-sm text-black/55">สถานะโต๊ะ</p>
                    <p className="mt-2 text-xl font-bold text-[#161616]">{table?.tableStatus ?? "UNKNOWN"}</p>
                    <p className="mt-3 text-sm text-black/60">
                      {currentSession
                        ? `Session #${currentSession.sessionId} เปิดเมื่อ ${new Date(currentSession.startTime).toLocaleString("th-TH")}`
                        : "ยังไม่มี session ที่เปิดอยู่สำหรับโต๊ะนี้"}
                    </p>
                  </div>

                  {!canUseSessionActions ? (
                    <button
                      onClick={handleOpenTable}
                      disabled={isOpening}
                      className="mt-5 w-full rounded-2xl bg-[#111111] px-5 py-4 text-lg font-bold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isOpening ? "กำลังเปิดโต๊ะ..." : "Open Table And Continue To QR"}
                    </button>
                  ) : (
                    <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                      โต๊ะนี้พร้อมสำหรับ flow QR, ดูรายการอาหาร และ checkout แล้ว
                    </div>
                  )}
                </>
              )}

              {errorMessage ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}
            </section>

            <div className="flex flex-col gap-4">
            <button
                onClick={() => router.push(`/cashier/table/${tableId}/qr`)}
                disabled={!canUseSessionActions}
                className="rounded-3xl bg-(--bg) py-5 text-2xl font-bold shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
            QrCode
            </button>

            <button
              onClick={() => router.push(`/cashier/table/${tableId}/order`)}
              disabled={!canUseSessionActions}
              className="rounded-3xl bg-(--bg) py-5 text-2xl font-bold shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Order Details
            </button>

            <button
              onClick={() => router.push(`/cashier/table/${tableId}/checkbill`)}
              disabled={!canUseSessionActions}
              className="rounded-3xl bg-(--bg) py-5 text-2xl font-bold shadow transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Check Bills
            </button>

              <div className="mx-auto mt-2 w-fit rounded-2xl border border-white/40 bg-white/20 px-5 py-3 text-center text-sm font-semibold text-white">
                {canUseSessionActions ? "Session Open" : "Waiting To Open Table"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}