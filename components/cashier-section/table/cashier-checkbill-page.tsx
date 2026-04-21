"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierService, type CheckoutSummary, type TableSession } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierCheckBillPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [session, setSession] = useState<TableSession | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCheckout = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const sessionResponse = await cashierService.getCurrentSession(Number(tableId));
      if (!sessionResponse.success || !sessionResponse.data) {
        setErrorMessage(sessionResponse.message);
        setIsLoading(false);
        return;
      }

      setSession(sessionResponse.data);

      const checkoutResponse = await cashierService.getCheckoutSummary(sessionResponse.data.sessionId);
      if (!checkoutResponse.success || !checkoutResponse.data) {
        setErrorMessage(checkoutResponse.message);
        setIsLoading(false);
        return;
      }

      setCheckoutSummary(checkoutResponse.data);
      setIsLoading(false);
    };

    void loadCheckout();
  }, [tableId]);

  const timeLabel = useMemo(() => {
    if (!session) return `T${String(tableId).padStart(2, "0")}`;
    return `${session.tableNumber ?? `T${String(tableId).padStart(2, "0")}`} · ${new Date(session.startTime).toLocaleString("th-TH")}`;
  }, [session, tableId]);

  const totalQty = useMemo(
    () => checkoutSummary?.bill.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
    [checkoutSummary]
  );

  const hasCashMethod = checkoutSummary?.paymentMethods.some((method) => method.methodName === "CASH") ?? false;
  const hasQrMethod = checkoutSummary?.paymentMethods.some((method) => method.methodName !== "CASH") ?? false;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-10 px-4">
        <div className="bg-[#e5e5e5] max-w-[680px] w-full rounded-3xl shadow-2xl p-8">
          <div className="text-lg font-semibold mb-6">{timeLabel}</div>

          {errorMessage ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="space-y-4">
            {isLoading ? (
              Array.from({ length: 3 }, (_, index) => <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/70" />)
            ) : checkoutSummary?.bill.items.length ? (
              checkoutSummary.bill.items.map((item) => (
                <div key={item.orderItemId} className="grid grid-cols-[auto_1fr_auto] gap-4 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-red-200 text-red-800 flex items-center justify-center text-2xl font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{item.menuName}</div>
                    <div className="text-xs text-gray-500 mt-1">x{item.quantity}</div>
                  </div>
                  <div className="text-right font-semibold text-sm sm:text-base">{item.lineTotal.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">ไม่มีรายการสำหรับคิดเงิน</p>
            )}

            <div className="border-t border-gray-300 pt-4 mt-2 flex items-center justify-between text-base sm:text-lg font-semibold">
              <span>Total</span>
              <div className="flex items-center gap-8">
                <span className="text-sm text-gray-500">x{totalQty}</span>
                <span>{(checkoutSummary?.bill.totalAmount ?? 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
              <button
                onClick={() => router.push(`/cashier/table/${tableId}/cash`)}
                disabled={!hasCashMethod}
                className="bg-white px-10 py-3 rounded-3xl text-2xl font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cash
              </button>
              <button
                onClick={() => router.push(`/cashier/table/${tableId}/qr-payment`)}
                disabled={!hasQrMethod}
                className="bg-white px-10 py-3 rounded-3xl text-2xl font-bold shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Qr Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
