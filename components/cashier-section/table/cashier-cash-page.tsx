"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierFlowStorage } from "@/services/cashierFlowStorage";
import { cashierService, type CheckoutSummary, type TableSession } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierCashPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [paidText, setPaidText] = useState("0");
  const [session, setSession] = useState<TableSession | null>(null);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setPaidText(String(Math.ceil(checkoutResponse.data.bill.totalAmount)));
      setIsLoading(false);
    };

    void loadCheckout();
  }, [tableId]);

  const tableName = checkoutSummary?.tableNumber ?? `T${String(tableId).padStart(2, "0")}`;
  const timeLabel = session
    ? `${tableName} : ${new Date(session.startTime).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}`
    : tableName;
  const totalAmount = checkoutSummary?.bill.totalAmount ?? 0;

  const paidAmount = Number(paidText || 0);
  const changeAmount = Math.max(0, paidAmount - totalAmount);
  const dateLabel = new Date().toLocaleDateString("th-TH");

  const keypadValues = [50, 100, 500, 1000];
  const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "DEL"];

  const updatePaidText = (value: string) => {
    if (value === "DEL") {
      setPaidText((prev) => prev.slice(0, -1) || "0");
      return;
    }

    if (value === ".") {
      if (paidText.includes(".")) return;
      setPaidText((prev) => (prev === "" ? "0." : `${prev}.`));
      return;
    }

    setPaidText((prev) => {
      const next = prev === "0" ? value : `${prev}${value}`;
      return next;
    });
  };

  const applyPreset = (value: number) => {
    setPaidText(String(value));
  };

  const handleConfirmPay = async () => {
    if (!session || !checkoutSummary) {
      setErrorMessage("ไม่พบข้อมูล session สำหรับชำระเงิน");
      return;
    }

    const cashMethod = checkoutSummary.paymentMethods.find((method) => method.methodName === "CASH");
    if (!cashMethod) {
      setErrorMessage("ไม่พบวิธีชำระเงินแบบเงินสด");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await cashierService.submitCheckout({
      sessionId: session.sessionId,
      paymentMethodId: cashMethod.paymentMethodId,
      receivedAmount: paidAmount,
    });

    if (!response.success || !response.data) {
      setErrorMessage(response.message);
      setIsSubmitting(false);
      return;
    }

    cashierFlowStorage.setCheckoutRecord(Number(tableId), response.data);
    cashierFlowStorage.clearQrSession(session.sessionId);
    setIsSubmitting(false);
    router.push(`/cashier/table/${tableId}/payment-success`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center items-center mt-12 px-4 pb-10">
        <div className="bg-[#d7d7d7] max-w-[1040px] w-full rounded-3xl shadow-2xl p-5 mx-auto">
          {errorMessage ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</div>
          ) : null}

          <div className="grid gap-4 min-w-0 xl:grid-cols-[1.05fr_0.95fr] max-w-[900px] mx-auto">
            <div className="bg-white rounded-[2rem] p-4 shadow-lg min-w-0">
              <div className="text-center mb-6">
                <img src="/cashier-section/logo.png" alt="โลโก้ร้าน" className="mx-auto h-16 w-auto" />
                <p className="mt-3 text-xs font-semibold">สาขา ธรรมศาสตร์ ศูนย์ลอนดอน</p>
                <p className="text-xs text-gray-500">หมู่บ้านโมนาโก ซอยกะเพราความเร็วสูง</p>
                <p className="text-xs text-gray-500">ถ.สปีด แขวงผัดไทย เขตพระนคร 10110</p>
              </div>

              <div className="text-base font-semibold mb-5">{timeLabel}</div>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 3 }, (_, index) => <div key={index} className="h-14 animate-pulse rounded-xl bg-black/8" />)
                ) : (
                  checkoutSummary?.bill.items.map((item) => (
                  <div key={item.orderItemId} className="flex items-start justify-between gap-4">
                    <div className="min-w-[0]">
                      <div className="font-semibold text-sm sm:text-base">{item.menuName}</div>
                      <div className="text-xs text-gray-500 mt-1">x{item.quantity}</div>
                    </div>
                    <div className="text-right font-semibold text-sm sm:text-base">{item.lineTotal.toFixed(2)}</div>
                  </div>
                ))) }
              </div>

              <div className="border-t border-gray-200 pt-5 mt-5 text-base font-bold flex items-center justify-between">
                <span>Total</span>
                <span>{totalAmount.toFixed(2)} ฿</span>
              </div>
              <div className="text-sm font-semibold mt-2">Change {changeAmount.toFixed(2)}฿</div>
              <div className="text-xs text-gray-500 mt-3">{dateLabel}</div>
              <div className="text-xs text-center text-gray-400 mt-6">
                ******************ขอบคุณที่ใช้บริการ******************
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-5 shadow-lg">
              <div className="text-center text-xs text-gray-500 mb-5">ใส่จำนวนเงิน</div>
              <div className="mb-5 flex items-center justify-center">
                <div className="w-full max-w-[220px] rounded-3xl border border-red-500 bg-white px-3 py-2 text-center text-3xl font-bold text-black">
                  {paidText}
                </div>
              </div>

              <div className="mb-5 grid grid-cols-4 gap-2">
                {keypadValues.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyPreset(value)}
                    className="rounded-full bg-gray-300 py-2 text-sm font-semibold text-black transition hover:bg-gray-400"
                  >
                    {value}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {digits.map((digit) => (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => updatePaidText(digit)}
                    className={`rounded-xl py-4 text-xl font-bold ${digit === "DEL" ? "bg-red-600 text-white" : "bg-gray-300 text-black"}`}
                  >
                    {digit}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPaidText(String(Math.ceil(totalAmount)))}
                className="mt-5 w-full rounded-3xl bg-red-700 px-5 py-3 text-xl font-bold uppercase text-white shadow-lg"
              >
                Use Exact Amount
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
                onClick={handleConfirmPay}
                disabled={isLoading || isSubmitting}
                className="bg-white text-black text-2xl font-bold rounded-3xl px-24 py-4 shadow-lg hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm pay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
