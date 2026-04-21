"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierService, type CashierTableOverviewItem } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierTableGrid() {
  const router = useRouter();
  const [tables, setTables] = useState<CashierTableOverviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadTables = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await cashierService.getTablesOverview();
      if (!response.success || !response.data) {
        setErrorMessage(response.message);
        setTables([]);
        setIsLoading(false);
        return;
      }

      const sortedTables = [...response.data].sort((left, right) => left.tableNumber.localeCompare(right.tableNumber));
      setTables(sortedTables);
      setIsLoading(false);
    };

    void loadTables();
  }, []);

  const availableCount = useMemo(
    () => tables.filter((table) => table.tableStatus === "AVAILABLE").length,
    [tables]
  );

  const occupiedCount = useMemo(
    () => tables.filter((table) => table.tableStatus !== "AVAILABLE").length,
    [tables]
  );

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="px-4 py-6 sm:px-8 xl:px-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="rounded-3xl bg-white/95 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
              <p className="text-sm font-medium text-red-700">Cashier Table Flow</p>
              <h1 className="mt-2 text-3xl font-black text-[#171717]">เปิดโต๊ะ สร้าง QR และเช็กสถานะโต๊ะจากหน้าจอเดียว</h1>
              <p className="mt-3 max-w-2xl text-sm text-black/60">
                เลือกโต๊ะเพื่อดู session ปัจจุบัน หากโต๊ะยังว่างสามารถเปิดโต๊ะแล้วเข้าสู่ flow QR ได้ทันที
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <p className="text-sm text-black/55">Available</p>
                <p className="mt-3 text-4xl font-black text-emerald-600">{availableCount}</p>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-[0_18px_60px_rgba(0,0,0,0.08)]">
                <p className="text-sm text-black/55">Occupied</p>
                <p className="mt-3 text-4xl font-black text-red-600">{occupiedCount}</p>
              </div>
            </section>
          </div>

          <div className="mb-5 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-2 font-semibold rounded-2xl shadow-md">
              <span>Available</span>
              <span className="w-5 h-5 bg-green-500 rounded-full"></span>
            </div>

            <div className="flex items-center gap-2 bg-[var(--input-bg)] px-4 py-2 font-semibold rounded-2xl shadow-md">
              <span>Not Available</span>
              <span className="w-5 h-5 bg-red-500 rounded-full"></span>
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }, (_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-3xl bg-white/70 shadow-md" />
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {tables.map((t) => (
              <button
                key={t.tableId}
                onClick={() => router.push(`/cashier/table/${t.tableId}`)}
                className={`rounded-3xl px-4 py-5 text-left text-black shadow-[0_16px_40px_rgba(0,0,0,0.12)] transition hover:-translate-y-1 ${
                  t.tableStatus === "AVAILABLE"
                    ? "bg-gradient-to-br from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600"
                    : "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-3xl font-black">{t.tableNumber}</p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-black/70">
                      {t.tableStatus}
                    </p>
                  </div>
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold text-black">
                    #{t.tableId}
                  </span>
                </div>

                <div className="mt-5 text-sm font-medium text-black/80">
                  {t.currentSession ? "มี session เปิดอยู่" : "พร้อมเปิดโต๊ะ"}
                </div>
                <div className="mt-1 text-xs text-black/65">
                  {t.currentSession ? `Session #${t.currentSession.sessionId}` : "แตะเพื่อเข้าสู่ flow โต๊ะ"}
                </div>
              </button>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}