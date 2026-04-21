"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierFlowStorage, type StoredCheckoutRecord } from "@/services/cashierFlowStorage";
import { cashierService, type PaymentDetail, type ReceiptDetail } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";

export default function CashierPaymentSuccessPage({ tableId }: { tableId: string }) {
  const router = useRouter();
  const [checkoutRecord, setCheckoutRecord] = useState<StoredCheckoutRecord | null>(null);
  const [paymentDetail, setPaymentDetail] = useState<PaymentDetail | null>(null);
  const [receiptDetail, setReceiptDetail] = useState<ReceiptDetail | null>(null);

  useEffect(() => {
    const record = cashierFlowStorage.getCheckoutRecord(Number(tableId));
    setCheckoutRecord(record);
    if (!record) return;

    const loadDetails = async () => {
      // Always fetch receipt via the correct endpoint: GET /payments/:id/receipt
      const [pmtRes, rcptRes] = await Promise.allSettled([
        cashierService.getPaymentById(record.paymentId),
        cashierService.getReceiptByPaymentId(record.paymentId),
      ]);

      if (pmtRes.status === "fulfilled" && pmtRes.value.success && pmtRes.value.data) {
        setPaymentDetail(pmtRes.value.data);
      }
      if (rcptRes.status === "fulfilled" && rcptRes.value.success && rcptRes.value.data) {
        setReceiptDetail(rcptRes.value.data);
      } else if (record.receiptId) {
        // fallback: try by receiptId if available
        const fallback = await cashierService.getReceiptById(record.receiptId).catch(() => null);
        if (fallback?.success && fallback.data) setReceiptDetail(fallback.data);
      }
    };

    void loadDetails();
  }, [tableId]);

  const handlePrint = () => window.print();

  const handleOk = () => {
    cashierFlowStorage.clearCheckoutRecord(Number(tableId));
    router.push("/cashier");
  };

  // Resolve display values with fallback chain: API detail → checkoutRecord → "-"
  const receiptNumber =
    receiptDetail?.receiptNumber ??
    checkoutRecord?.receiptNumber ??
    "-";

  const paymentId =
    paymentDetail?.paymentId ??
    checkoutRecord?.paymentId ??
    "-";

  const paidAmount =
    paymentDetail?.totalAmount ??
    paymentDetail?.paidAmount ??
    checkoutRecord?.totalAmount ??
    checkoutRecord?.receivedAmount ??
    null;

  const changeAmount =
    paymentDetail?.changeAmount ??
    checkoutRecord?.changeAmount ??
    0;

  const receiptTotal =
    receiptDetail?.totalAmount ??
    paidAmount ??
    null;

  const tableStatus = checkoutRecord?.tableStatus ?? "AVAILABLE";

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <CashierHeader />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-3xl bg-gray-100 px-10 py-12 shadow-sm">

          {/* Success icon */}
          <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
            <span className="absolute top-2 left-4 text-red-300 text-xl">✦</span>
            <span className="absolute top-4 right-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-4 left-2 text-red-200 text-sm">✦</span>
            <span className="absolute bottom-2 right-6 text-red-300 text-xs">✦</span>
            <div className="w-20 h-20 bg-[#C0392B] rounded-full flex items-center justify-center shadow-md">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20L17 27L30 13" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <p className="mt-4 text-center text-gray-700 font-medium text-base">Payment Completed</p>

          {/* Detail card */}
          <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-sm text-black shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Receipt No.</span>
              <span className="font-bold">{receiptNumber}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Payment ID</span>
              <span className="font-bold">{paymentId}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Paid Amount</span>
              <span className="font-bold">
                {paidAmount !== null ? `${Number(paidAmount).toFixed(2)} ฿` : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Change</span>
              <span className="font-bold">{Number(changeAmount).toFixed(2)} ฿</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Receipt Total</span>
              <span className="font-bold">
                {receiptTotal !== null ? `${Number(receiptTotal).toFixed(2)} ฿` : "-"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Table Status</span>
              <span className="font-bold">{tableStatus}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 w-full">
            <button
              onClick={handlePrint}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg tracking-widest text-sm transition-colors"
            >
              PRINT RECEIPT
            </button>
            <button
              onClick={handleOk}
              className="w-full bg-[#C0392B] hover:bg-[#a93226] text-white font-bold py-3 rounded-lg text-sm transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
