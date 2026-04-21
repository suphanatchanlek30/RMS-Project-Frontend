"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authSession } from '@/services/authSession';
import {
  chefService,
  type ChefOrderDetail,
  type ChefItemStatus,
  type ChefItemStatusUpdate,
} from '@/services/chef.service';

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_LABEL: Record<ChefItemStatus, string> = {
  WAITING: 'รอทำ',
  PREPARING: 'กำลังทำ',
  COMPLETED: 'เสร็จแล้ว',
  CANCELLED: 'ยกเลิก',
};

const STATUS_COLOR: Record<ChefItemStatus, string> = {
  WAITING: 'bg-red-100 text-red-700 border-red-200',
  PREPARING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  COMPLETED: 'bg-green-100 text-green-700 border-green-200',
  CANCELLED: 'bg-gray-100 text-gray-400 border-gray-200',
};

const STATUS_DOT: Record<ChefItemStatus, string> = {
  WAITING: 'bg-red-500',
  PREPARING: 'bg-yellow-400',
  COMPLETED: 'bg-green-500',
  CANCELLED: 'bg-gray-300',
};

const ACTION_LABEL: Record<ChefItemStatusUpdate, string> = {
  PREPARING: 'เริ่มทำ',
  COMPLETED: 'ทำเสร็จ',
};

const ACTION_COLOR: Record<ChefItemStatusUpdate, string> = {
  PREPARING: 'bg-yellow-400 hover:bg-yellow-500 text-gray-900',
  COMPLETED: 'bg-green-500 hover:bg-green-600 text-white',
};

// ─── Spark decoration ─────────────────────────────────────────────────────────

const Spark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0 C12 8 16 12 24 12 C16 12 12 16 12 24 C12 16 8 12 0 12 C8 12 12 8 12 0 Z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function DetailOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderDetail, setOrderDetail] = useState<ChefOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await chefService.getKitchenOrderById(orderId);
      if (!response.success || !response.data) {
        setErrorMessage(response.message);
      } else {
        setOrderDetail(response.data);
      }
      setIsLoading(false);
    };
    void load();
  }, [orderId]);

  const employeeName = useMemo(
    () => authSession.getEmployeeProfile()?.employeeName ?? 'Chef',
    []
  );

  const waitingItems = orderDetail?.items.filter((i) => i.itemStatus === 'WAITING') ?? [];
  const preparingItems = orderDetail?.items.filter((i) => i.itemStatus === 'PREPARING') ?? [];
  const completedItems = orderDetail?.items.filter((i) => i.itemStatus === 'COMPLETED') ?? [];
  const cancelledItems = orderDetail?.items.filter((i) => i.itemStatus === 'CANCELLED') ?? [];

  const activeItems = [...waitingItems, ...preparingItems];
  const allDone = activeItems.length === 0 && (completedItems.length > 0 || cancelledItems.length > 0);

  /**
   * Advance a single item to its next status.
   * WAITING → PREPARING, PREPARING → COMPLETED
   */
  const handleAdvanceItem = async (orderItemId: number, current: ChefItemStatus) => {
    const nextStatus = chefService.getNextStatus(current);
    if (!nextStatus) return;

    setUpdatingItems((prev) => new Set(prev).add(orderItemId));
    setErrorMessage(null);

    const response = await chefService.updateOrderItemStatus(orderItemId, nextStatus);

    if (!response.success) {
      setErrorMessage(response.message);
    } else {
      setOrderDetail((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.orderItemId === orderItemId
              ? { ...item, itemStatus: nextStatus as ChefItemStatus }
              : item
          ),
        };
      });
    }

    setUpdatingItems((prev) => {
      const next = new Set(prev);
      next.delete(orderItemId);
      return next;
    });
  };

  /**
   * Mark ALL remaining active items as COMPLETED.
   * Respects the state machine: items go WAITING→PREPARING first if needed,
   * but we batch PREPARING→COMPLETED for items already in PREPARING.
   * WAITING items require 2 steps, so we first push them to PREPARING then COMPLETED.
   */
  const handleCompleteAll = async () => {
    const itemsToAdvance = activeItems.filter(
      (i) => i.itemStatus === 'WAITING' || i.itemStatus === 'PREPARING'
    );
    if (!itemsToAdvance.length) {
      setIsSubmitted(true);
      return;
    }

    setErrorMessage(null);

    // Step 1: move all WAITING → PREPARING
    const waitingToAdvance = itemsToAdvance.filter((i) => i.itemStatus === 'WAITING');
    if (waitingToAdvance.length) {
      const results = await Promise.all(
        waitingToAdvance.map((i) => chefService.updateOrderItemStatus(i.orderItemId, 'PREPARING'))
      );
      const fail = results.find((r) => !r.success);
      if (fail) { setErrorMessage(fail.message); return; }
      setOrderDetail((prev) => {
        if (!prev) return prev;
        const ids = new Set(waitingToAdvance.map((i) => i.orderItemId));
        return {
          ...prev,
          items: prev.items.map((item) =>
            ids.has(item.orderItemId) ? { ...item, itemStatus: 'PREPARING' as ChefItemStatus } : item
          ),
        };
      });
    }

    // Step 2: move all PREPARING → COMPLETED
    const allPreparing = itemsToAdvance.map((i) => i.orderItemId);
    const results2 = await Promise.all(
      allPreparing.map((id) => chefService.updateOrderItemStatus(id, 'COMPLETED'))
    );
    const fail2 = results2.find((r) => !r.success);
    if (fail2) { setErrorMessage(fail2.message); return; }

    setOrderDetail((prev) => {
      if (!prev) return prev;
      const ids = new Set(allPreparing);
      return {
        ...prev,
        status: 'completed',
        items: prev.items.map((item) =>
          ids.has(item.orderItemId) ? { ...item, itemStatus: 'COMPLETED' as ChefItemStatus } : item
        ),
      };
    });
    setIsSubmitted(true);
  };

  // ─── Success screen ────────────────────────────────────────────────────────

  if (isSubmitted || allDone) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col">
        <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
          <div className="flex items-center justify-between px-6 py-5 relative z-10">
            <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
              <span suppressHydrationWarning className="font-bold text-gray-800">{employeeName}</span>
            </div>
            <button onClick={() => router.push('/all-order')} className="text-white hover:text-gray-300">
              <ArrowLeft size={28} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-[#f2f2f2] rounded-3xl p-8 w-full max-w-[420px] shadow-sm border border-gray-200 flex flex-col items-center min-h-[400px] justify-center relative overflow-hidden">
            <div className="relative flex items-center justify-center w-full h-36 mb-4">
              <Spark className="absolute text-[#e04040] w-6 h-6 top-8 left-[20%] opacity-80" />
              <Spark className="absolute text-[#e04040] w-3 h-3 top-1 left-[30%] opacity-50" />
              <Spark className="absolute text-[#cc0000] w-4 h-4 top-10 right-[35%]" />
              <Spark className="absolute text-[#e04040] w-3 h-3 bottom-4 right-[15%] opacity-60" />
              <div className="w-24 h-24 bg-[#d20000] rounded-full flex items-center justify-center shadow-lg z-10">
                <Check size={48} strokeWidth={3.5} className="text-white" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-8">Order Completed</h3>
            <button
              onClick={() => router.push('/all-order')}
              className="bg-[#d20000] hover:bg-red-700 text-white font-bold py-3 px-10 rounded-lg text-sm w-[80%] shadow-md"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main detail view ──────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Header */}
      <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
        <div className="flex items-center justify-between px-6 py-5 relative z-10">
          <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
            <span suppressHydrationWarning className="font-bold text-gray-800">{employeeName}</span>
          </div>
          <button onClick={() => router.push('/all-order')} className="text-white hover:text-gray-300">
            <ArrowLeft size={28} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
        <div className="w-full max-w-[500px]">
          {/* Order ID */}
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-gray-100 px-5 py-2 rounded-lg font-bold text-sm shadow-sm text-gray-800">
              Order #{orderId}
            </div>
            {orderDetail?.tableLabel && (
              <div className="text-sm font-semibold text-gray-500">{orderDetail.tableLabel}</div>
            )}
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* WAITING items */}
              {waitingItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={14} className="text-red-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">รอทำ ({waitingItems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {waitingItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.itemStatus]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.menuName}</p>
                          {item.note && <p className="text-xs text-gray-400 mt-0.5">• {item.note}</p>}
                        </div>
                        <span className="text-sm font-bold text-gray-500 mr-2">x{item.quantity}</span>
                        <button
                          onClick={() => void handleAdvanceItem(item.orderItemId, item.itemStatus)}
                          disabled={updatingItems.has(item.orderItemId)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 ${ACTION_COLOR['PREPARING']}`}
                        >
                          {updatingItems.has(item.orderItemId) ? '...' : ACTION_LABEL['PREPARING']}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREPARING items */}
              {preparingItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ChefHat size={14} className="text-yellow-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">กำลังทำ ({preparingItems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {preparingItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-yellow-100">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.itemStatus]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{item.menuName}</p>
                          {item.note && <p className="text-xs text-gray-400 mt-0.5">• {item.note}</p>}
                        </div>
                        <span className="text-sm font-bold text-gray-500 mr-2">x{item.quantity}</span>
                        <button
                          onClick={() => void handleAdvanceItem(item.orderItemId, item.itemStatus)}
                          disabled={updatingItems.has(item.orderItemId)}
                          className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 ${ACTION_COLOR['COMPLETED']}`}
                        >
                          {updatingItems.has(item.orderItemId) ? '...' : ACTION_LABEL['COMPLETED']}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* COMPLETED items */}
              {completedItems.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">เสร็จแล้ว ({completedItems.length})</span>
                  </div>
                  <div className="space-y-2">
                    {completedItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-green-100 opacity-60">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.itemStatus]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-500 line-through truncate">{item.menuName}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-400 mr-2">x{item.quantity}</span>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg border ${STATUS_COLOR[item.itemStatus]}`}>
                          {STATUS_LABEL[item.itemStatus]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CANCELLED items */}
              {cancelledItems.length > 0 && (
                <div>
                  <div className="space-y-2">
                    {cancelledItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 opacity-40">
                        <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${STATUS_DOT[item.itemStatus]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-400 line-through truncate">{item.menuName}</p>
                        </div>
                        <span className="text-xs text-gray-400">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty */}
              {!orderDetail && !errorMessage && (
                <p className="text-center text-gray-400 py-10">ไม่พบรายการ</p>
              )}
            </div>
          )}

          {/* Complete All button */}
          {!isLoading && activeItems.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => void handleCompleteAll()}
                className="w-full bg-[#d20000] hover:bg-red-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md transition-colors"
              >
                ทำเสร็จทั้งหมด ({activeItems.length} รายการ)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
