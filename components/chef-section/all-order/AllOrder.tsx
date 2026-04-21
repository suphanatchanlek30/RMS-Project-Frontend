"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Search, LogOut, ChevronDown } from 'lucide-react';
import OrderCard, { OrderItemProps } from './OrderCard';
import { authSession } from '@/services/authSession';
import { chefService } from '@/services/chef.service';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  countColor?: string;
  activeColor?: string;
}

const TabButton = ({ active, onClick, label, count, countColor = "bg-gray-200 text-gray-800", activeColor = "bg-red-600 text-white" }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all shadow-sm
        ${active ? `${activeColor} border-transparent` : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
    >
      <span className="font-semibold text-sm">{label}</span>
      {count > 0 && (
        <span className={`flex items-center justify-center min-w-5 h-5 rounded-full text-xs font-bold px-1.5
          ${active && activeColor.includes('red') ? 'bg-white text-red-600' : countColor + (countColor.includes('yellow') ? ' text-gray-800' : ' text-white')}`}>
          {count}
        </span>
      )}
    </button>
  );
};


export default function AllOrder() {
  const [activeTab, setActiveTab] = useState('All Order');
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await chefService.getKitchenOrders();
      if (!response.success || !response.data) {
        setErrorMessage(response.message);
        setOrders([]);
        setIsLoading(false);
        return;
      }

      setOrders(response.data);
      setIsLoading(false);
    };

    void loadOrders();
  }, []);

  const employeeName = useMemo(() => authSession.getEmployeeProfile()?.employeeName ?? 'Chef', []);

  const newOrdersCount = orders.filter(o => o.status === 'new').length;
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const historyCount = 0; // Replace when history items are available
  const allCount = orders.length;

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All Order') return true;
    if (activeTab === 'New Order') return order.status === 'new';
    if (activeTab === 'Preparing') return order.status === 'preparing';
    if (activeTab === 'Completed') return order.status === 'completed';
    if (activeTab === 'History') return false; 
    return true;
  });

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex flex-col w-full flex-1">
        {/* Header Section */}
        <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
          
          <div className="flex items-center justify-between px-6 py-5 relative z-10">
            <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
              <span suppressHydrationWarning className="font-bold text-gray-800">{employeeName}</span>
            </div>
            
            <div className="flex items-center gap-6 text-white mr-2">
              <button className="hover:text-gray-300 transition-colors">
                <Search size={28} strokeWidth={2.5} />
              </button>
              <button className="hover:text-gray-300 transition-colors">
                <LogOut size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white flex-1 p-6 md:p-8">
          {/* Tabs Group */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <TabButton active={activeTab === 'All Order'} onClick={() => setActiveTab('All Order')} label="All Order" count={allCount} activeColor="bg-[#e41616] text-white" />
              <TabButton active={activeTab === 'New Order'} onClick={() => setActiveTab('New Order')} label="New Order" count={newOrdersCount} countColor="bg-[#e41616]" />
              <TabButton active={activeTab === 'Preparing'} onClick={() => setActiveTab('Preparing')} label="Preparing" count={preparingCount} countColor="bg-yellow-300" />
              <TabButton active={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')} label="Completed" count={completedCount} countColor="bg-green-500" />
              <TabButton active={activeTab === 'History'} onClick={() => setActiveTab('History')} label="History" count={historyCount} />
            </div>
            
            <div className="flex shrink-0 items-center bg-white border border-gray-200 rounded-full px-5 py-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold mr-2 text-gray-800">Lastest Order</span>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </div>

          {/* Grid Layout Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 bg-white">
            {errorMessage ? (
              <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {isLoading ? (
              Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
              ))
            ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order.id} {...order} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <span className="text-lg font-medium">ไม่มีรายการอาหารในสถานะนี้</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
