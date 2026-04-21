"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import OrderCard from './OrderCard';
import type { OrderItemProps } from './OrderCard';
import { authSession } from '@/services/authSession';
import { chefService } from '@/services/chef.service';

const POLL_INTERVAL_MS = 15_000;

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  activeColor?: string;
  dotColor?: string;
}

const TabButton = ({
  active,
  onClick,
  label,
  count,
  activeColor = 'bg-[#e41616] text-white',
  dotColor = 'bg-gray-400',
}: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all shadow-sm
      ${active ? `${activeColor} border-transparent` : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
  >
    <span className="font-semibold text-sm">{label}</span>
    {count > 0 && (
      <span
        className={`flex items-center justify-center min-w-5 h-5 rounded-full text-xs font-bold px-1.5
          ${active ? 'bg-white text-[#e41616]' : `${dotColor} text-white`}`}
      >
        {count}
      </span>
    )}
  </button>
);

type Tab = 'All Order' | 'New Order' | 'Preparing' | 'Completed';

export default function AllOrder() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('All Order');
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const employeeName = useMemo(
    () => authSession.getEmployeeProfile()?.employeeName ?? 'Chef',
    []
  );

  const loadOrders = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMessage(null);

    const response = await chefService.getKitchenOrders();

    if (!response.success || !response.data) {
      setErrorMessage(response.message);
    } else {
      const incoming: OrderItemProps[] = response.data.map((o) => ({
        id: o.id,
        tableNumber: o.tableNumber,
        orderTime: o.orderTime,
        status: o.status,
        items: o.items.map((i) => ({ name: i.name, qty: i.qty })),
      }));

      setOrders((prev) => {
        // The kitchen API only returns WAITING/PREPARING orders.
        // Any order previously in state but now absent = completed.
        // Keep it locally as 'completed' so it stays visible in the Completed tab.
        const incomingIds = new Set(incoming.map((o) => o.id));
        const ghostCompleted = prev
          .filter((o) => !incomingIds.has(o.id))
          .map((o) => ({ ...o, status: 'completed' as const }));
        return [...incoming, ...ghostCompleted];
      });
    }

    if (!silent) setIsLoading(false);
    else setIsRefreshing(false);
  }, []);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    pollRef.current = setInterval(() => {
      void loadOrders(true);
    }, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [loadOrders]);

  const handleLogout = () => {
    authSession.clearClientAuthState();
    router.push('/auth');
  };

  const newCount = orders.filter((o) => o.status === 'new').length;
  const preparingCount = orders.filter((o) => o.status === 'preparing').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All Order') return true;
    if (activeTab === 'New Order') return order.status === 'new';
    if (activeTab === 'Preparing') return order.status === 'preparing';
    if (activeTab === 'Completed') return order.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex flex-col w-full flex-1">
        <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}
          />
          <div className="flex items-center justify-between px-6 py-5 relative z-10">
            <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
              <span suppressHydrationWarning className="font-bold text-gray-800">
                {employeeName}
              </span>
            </div>
            <div className="flex items-center gap-5 text-white">
              <button
                onClick={() => void loadOrders(true)}
                disabled={isRefreshing}
                className="hover:text-gray-300 transition-colors disabled:opacity-50"
                title="รีเฟรช"
              >
                <RefreshCw size={24} strokeWidth={2.5} className={isRefreshing ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleLogout}
                className="hover:text-gray-300 transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut size={26} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white flex-1 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <TabButton
                active={activeTab === 'All Order'}
                onClick={() => setActiveTab('All Order')}
                label="All Order"
                count={orders.length}
                activeColor="bg-[#e41616] text-white"
              />
              <TabButton
                active={activeTab === 'New Order'}
                onClick={() => setActiveTab('New Order')}
                label="New Order"
                count={newCount}
                dotColor="bg-[#e41616]"
              />
              <TabButton
                active={activeTab === 'Preparing'}
                onClick={() => setActiveTab('Preparing')}
                label="Preparing"
                count={preparingCount}
                dotColor="bg-yellow-400"
              />
              <TabButton
                active={activeTab === 'Completed'}
                onClick={() => setActiveTab('Completed')}
                label="Completed"
                count={completedCount}
                dotColor="bg-green-500"
              />
            </div>
            <div className="text-xs text-gray-400 flex-shrink-0">
              {isRefreshing ? 'กำลังรีเฟรช...' : `อัปเดตทุก ${POLL_INTERVAL_MS / 1000} วิ`}
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => <OrderCard key={order.id} {...order} />)
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400">
                <p className="text-lg font-medium">ไม่มีรายการในสถานะนี้</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
