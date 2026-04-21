"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cashierService } from "@/services/cashier.service";
import CashierHeader from "../common/cashier-header";
import CashierOrderItem from "./cashier-order-item";

type OrderItemType = {
  name: string;
  qty: number;
  meta?: string;
};

export default function CashierOrderDetails({ tableId }: { tableId: string }) {
  const router = useRouter();

  const [pending, setPending] = useState<OrderItemType[]>([]);
  const [done, setDone] = useState<OrderItemType[]>([]);
  const [tableName, setTableName] = useState(`T${String(tableId).padStart(2, "0")}`);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const currentSessionResponse = await cashierService.getCurrentSession(Number(tableId));
      if (!currentSessionResponse.success || !currentSessionResponse.data) {
        setErrorMessage(currentSessionResponse.message);
        setPending([]);
        setDone([]);
        setIsLoading(false);
        return;
      }

      const session = currentSessionResponse.data;
      setTableName(session.tableNumber ?? `T${String(tableId).padStart(2, "0")}`);

      const ordersResponse = await cashierService.getOrdersBySession(session.sessionId);
      if (!ordersResponse.success || !ordersResponse.data) {
        setErrorMessage(ordersResponse.message);
        setPending([]);
        setDone([]);
        setIsLoading(false);
        return;
      }

      if (ordersResponse.data.length === 0) {
        setPending([]);
        setDone([]);
        setIsLoading(false);
        return;
      }

      const orderItemGroups = await Promise.all(
        ordersResponse.data.map(async (order) => {
          const itemsResponse = await cashierService.getOrderItems(order.orderId);
          return {
            order,
            items: itemsResponse.success && itemsResponse.data ? itemsResponse.data : [],
          };
        })
      );

      const pendingItems: OrderItemType[] = [];
      const doneItems: OrderItemType[] = [];

      orderItemGroups.forEach(({ order, items }) => {
        items.forEach((item) => {
          const normalizedItem = {
            name: item.menuName,
            qty: item.quantity,
            meta: `Order #${order.orderId} · ${item.itemStatus}`,
          };

          if (item.itemStatus === "COMPLETED") {
            doneItems.push(normalizedItem);
            return;
          }

          pendingItems.push(normalizedItem);
        });
      });

      setPending(pendingItems);
      setDone(doneItems);
      setIsLoading(false);
    };

    void fetchOrders();
  }, [tableId]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <CashierHeader />

      <div className="flex justify-center px-4 py-6 sm:px-6">
        <div className="flex h-full min-h-[560px] w-full max-w-4xl flex-col rounded-[2rem] bg-[var(--card-bg)] p-6 shadow-xl">

          <div className="bg-[var(--bg)] px-6 py-1 rounded-md w-fit mb-4 font-semibold">
            {tableName}
          </div>

          {errorMessage ? (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid flex-1 gap-6 lg:grid-cols-2">
            <section className="rounded-3xl bg-white/80 p-5 shadow-inner">
              <h2 className="mb-3 font-semibold">รายการที่ยังไม่ได้ทำ</h2>

              <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
                {isLoading ? (
                  Array.from({ length: 4 }, (_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-xl bg-black/8" />
                  ))
                ) : pending.length > 0 ? (
                  pending.map((item, index) => <CashierOrderItem key={`${item.name}-${index}`} item={item} />)
                ) : (
                  <p className="text-sm text-gray-500">ไม่มีรายการ</p>
                )}
              </div>
            </section>

            <section className="rounded-3xl bg-white/80 p-5 shadow-inner">
              <h2 className="mb-3 font-semibold">รายการที่เสร็จสิ้น</h2>

              <div className="flex max-h-[320px] flex-col gap-3 overflow-y-auto pr-1">
                {isLoading ? (
                  Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="h-14 animate-pulse rounded-xl bg-black/8" />
                  ))
                ) : done.length > 0 ? (
                  done.map((item, index) => <CashierOrderItem key={`${item.name}-${index}`} item={item} />)
                ) : (
                  <p className="text-sm text-gray-500">ไม่มีรายการ</p>
                )}
              </div>
            </section>
          </div>

          <div className="mt-auto">
            <button
                onClick={() => router.back()}
                className="bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white px-10 py-2 rounded-lg mx-auto block font-semibold"
            >
            Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}