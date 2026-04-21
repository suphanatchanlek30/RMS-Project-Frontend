"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierFlowStorage } from "@/services/cashierFlowStorage";
import { cashierService, type CheckoutSummary, type TableSession } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierQrPaymentPage({ tableId }: { tableId: string }) {
  const router = useRouter();
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
      setIsLoading(false);
    };

    void loadCheckout();
  }, [tableId]);

  const qrMethod = useMemo(
    () => checkoutSummary?.paymentMethods.find((method) => method.methodName !== "CASH"),
    [checkoutSummary]
  );

  const paymentQrPayload = useMemo(() => {
    if (!checkoutSummary || !qrMethod) return "";
    return `RMS|QR_PAYMENT|SESSION:${checkoutSummary.sessionId}|TABLE:${checkoutSummary.tableNumber}|TOTAL:${checkoutSummary.bill.totalAmount}`;
  }, [checkoutSummary, qrMethod]);

  const handleConfirmPay = async () => {
    if (!session || !checkoutSummary || !qrMethod) {
      setErrorMessage("ไม่พบข้อมูล QR payment สำหรับ session นี้");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const response = await cashierService.submitCheckout({
      sessionId: session.sessionId,
      paymentMethodId: qrMethod.paymentMethodId,
      receivedAmount: checkoutSummary.bill.totalAmount,
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

              <div className="text-base font-semibold mb-5">
                {checkoutSummary?.tableNumber ?? `T${String(tableId).padStart(2, "0")}`} : {session ? new Date(session.startTime).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) : "-"}
              </div>
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
                <span>{(checkoutSummary?.bill.totalAmount ?? 0).toFixed(2)} ฿</span>
              </div>
              <div className="text-sm font-semibold mt-2">วิธีชำระ {qrMethod?.methodName ?? "-"}</div>
              <div className="text-xs text-gray-500 mt-3">{new Date().toLocaleDateString("th-TH")}</div>
              <div className="text-xs text-center text-gray-400 mt-6">
                ******************ขอบคุณที่ใช้บริการ******************
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-lg flex flex-col items-center justify-center gap-4">
              {paymentQrPayload ? (
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(paymentQrPayload)}`}
                  alt="QR Code ชำระเงิน"
                  className="h-[220px] w-[220px] object-contain"
                />
              ) : (
                <div className="flex h-[220px] w-[220px] items-center justify-center rounded-3xl bg-black/5 text-center text-sm text-black/45">
                  ไม่มี QR payment method จากระบบ
                </div>
              )}
              <p className="text-lg font-bold">{(checkoutSummary?.bill.totalAmount ?? 0).toFixed(2)} ฿</p>
              <p className="text-center text-xs text-black/50">QR นี้สร้างจากข้อมูล checkout เพื่อใช้กับ flow demo ของหน้า cashier</p>
            </div>

          </div>

          <div className="flex justify-center mt-6">
            <button
                onClick={handleConfirmPay}
                disabled={isLoading || isSubmitting || !qrMethod}
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
