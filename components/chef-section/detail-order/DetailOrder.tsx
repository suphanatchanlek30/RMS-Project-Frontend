"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { LogOut, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authSession } from '@/services/authSession';
import { chefService, type ChefOrderDetail } from '@/services/chef.service';

const Spark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0 C12 8 16 12 24 12 C16 12 12 16 12 24 C12 16 8 12 0 12 C8 12 12 8 12 0 Z"/>
  </svg>
);

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  countColor?: string;
  activeColor?: string;
}

const TabButton = ({ active, onClick, label, count, countColor = "bg-gray-200 text-gray-800", activeColor = "bg-[#d20000] text-white" }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all shadow-sm
        ${active ? `${activeColor} border-transparent` : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
    >
      <span className="font-semibold text-sm">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`flex items-center justify-center min-w-5 h-5 rounded-full text-xs font-bold px-1.5
          ${active && activeColor.includes('red') ? 'bg-white text-red-600' : countColor + (countColor.includes('yellow') ? ' text-gray-800' : ' text-white')}`}>
          {count}
        </span>
      )}
    </button>
  );
};

export default function DetailOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Order');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderDetail, setOrderDetail] = useState<ChefOrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadOrderDetail = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await chefService.getKitchenOrderById(orderId);
      if (!response.success || !response.data) {
        setErrorMessage(response.message);
        setOrderDetail(null);
        setIsLoading(false);
        return;
      }

      setOrderDetail(response.data);
      setIsLoading(false);
    };

    void loadOrderDetail();
  }, [orderId]);

  const employeeName = useMemo(() => authSession.getEmployeeProfile()?.employeeName ?? 'Chef', []);

  const allCount = orderDetail ? 1 : 0;
  const newOrdersCount = orderDetail?.status === 'new' ? 1 : 0;
  const preparingCount = orderDetail?.status === 'preparing' ? 1 : 0;
  const completedCount = orderDetail?.status === 'completed' ? 1 : 0;
  const historyCount = 0;

  const pendingItems = orderDetail?.items.filter((item) => item.itemStatus !== 'completed') ?? [];
  const completedItems = orderDetail?.items.filter((item) => item.itemStatus === 'completed') ?? [];

  const markItemReady = async (itemId: number) => {
    setErrorMessage(null);

    const response = await chefService.updateOrderItemStatus(itemId, 'READY');
    if (!response.success) {
      setErrorMessage(response.message);
      return;
    }

    setOrderDetail((current) => {
      if (!current) return current;
      return {
        ...current,
        items: current.items.map((item) =>
          item.orderItemId === itemId ? { ...item, itemStatus: 'completed' } : item
        ),
      };
    });
  };

  const handleSubmitOrder = async () => {
    if (!pendingItems.length) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const results = await Promise.all(
      pendingItems.map((item) => chefService.updateOrderItemStatus(item.orderItemId, 'READY'))
    );

    const failedResult = results.find((result) => !result.success);
    if (failedResult) {
      setErrorMessage(failedResult.message);
      setIsSubmitting(false);
      return;
    }

    setOrderDetail((current) => {
      if (!current) return current;
      return {
        ...current,
        status: 'completed',
        items: current.items.map((item) => ({ ...item, itemStatus: 'completed' })),
      };
    });
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex flex-col w-full flex-1">
        {/* Header Section */}
        <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
          
          <div className="flex items-center justify-between px-6 py-5 relative z-10">
            <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
              <span className="font-bold text-gray-800">{employeeName}</span>
            </div>
            
            <div className="flex items-center gap-6 text-white mr-2">
              <button onClick={() => router.push('/all-order')} className="hover:text-gray-300 transition-colors">
                <LogOut size={28} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white flex-1 p-6 md:p-8 flex flex-col items-center">
          {/* Tabs Group */}
          <div className="flex flex-col lg:flex-row w-full items-start lg:items-center justify-between mb-10 gap-4 overflow-x-auto pb-2 scrollbar-none">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <TabButton active={activeTab === 'All Order'} onClick={() => setActiveTab('All Order')} label="All Order" count={allCount} activeColor="bg-[#d20000] text-white" />
              <TabButton active={activeTab === 'New Order'} onClick={() => setActiveTab('New Order')} label="New Order" count={newOrdersCount} countColor="bg-[#d20000]" />
              <TabButton active={activeTab === 'Preparing'} onClick={() => setActiveTab('Preparing')} label="Preparing" count={preparingCount} countColor="bg-yellow-300" />
              <TabButton active={activeTab === 'Completed'} onClick={() => setActiveTab('Completed')} label="Completed" count={completedCount} countColor="bg-green-500" />
              <TabButton active={activeTab === 'History'} onClick={() => setActiveTab('History')} label="History" count={historyCount} />
            </div>
            
            <div className="flex shrink-0 items-center bg-[#f8f9fa] border border-gray-200 rounded-full px-5 py-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
              <span className="text-[13px] font-semibold mr-2 text-gray-800">Lastest Order</span>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </div>

          {/* Centered Detail Card */}
          <div className="flex justify-center w-full flex-1 mb-8">
            {isSubmitted ? (
              <div className="bg-[#f2f2f2] rounded-3xl p-8 w-full max-w-[450px] shadow-sm flex flex-col border border-gray-200 justify-center items-center relative overflow-hidden min-h-[450px]">
                {/* Success Animation Area */}
                <div className="flex-1 flex flex-col items-center justify-center w-full relative">
                  <div className="relative w-full h-40 flex items-center justify-center -mt-8">
                     {/* Sparks - Absolute positioning across the container */}
                     <Spark className="absolute text-[#e04040] w-6 h-6 top-8 left-[20%] opacity-80" />
                     <Spark className="absolute text-[#e04040] w-3 h-3 top-1 left-[30%] opacity-50" />
                     <Spark className="absolute text-[#cc0000] w-4 h-4 top-10 right-[35%]" />
                     <Spark className="absolute text-[#e04040] w-3 h-3 top-20 left-[15%] opacity-90" />
                     <Spark className="absolute text-[#cc0000] w-4 h-4 bottom-8 right-[25%]" />
                     <Spark className="absolute text-[#e04040] w-7 h-7 bottom-4 right-[15%] opacity-60" />
                     <div className="absolute w-1.25 h-1.25 rounded-full bg-[#f08080] top-[30%] right-[40%]" />
                     <div className="absolute w-1 h-1 rounded-full bg-[#e04040] bottom-[20%] left-[20%]" />

                     {/* Main Circle */}
                     <div className="w-24 h-24 bg-[#d20000] rounded-full flex items-center justify-center shadow-lg relative z-10 transition-transform duration-500 scale-100">
                       <Check size={48} strokeWidth={3.5} className="text-white" />
                     </div>
                  </div>
                  <h3 className="text-[15px] font-medium text-gray-800 mt-8 mb-6 text-center">Order Completed</h3>
                </div>

                <div className="w-full flex justify-center pb-2">
                  <button onClick={() => router.push('/all-order')} className="bg-[#d20000] hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded-lg transition-colors text-[14px] w-[80%] shadow-md">
                    OK
                  </button>
                </div>
              </div>
            ) : (
            <div className="bg-[#f2f2f2] rounded-3xl p-8 w-full max-w-[450px] shadow-sm flex flex-col border border-gray-200">
              {/* Order ID Tag */}
              <div className="mb-6 flex">
                <div className="bg-white px-5 py-2 rounded-lg font-bold text-[14px] shadow-sm text-gray-800">
                  {orderDetail?.tableLabel ?? orderId.toUpperCase()}
                </div>
              </div>

              {errorMessage ? (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              ) : null}

              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-xl bg-white/80" />
                  ))}
                </div>
              ) : (
                <>

              {/* Pending Items */}
              {pendingItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-[13px] text-gray-800 mb-4 ml-1">รายการที่ยังไม่ได้ทำ</h3>
                  <div className="space-y-3">
                    {pendingItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-4">
                        <button onClick={() => void markItemReady(item.orderItemId)} className="shrink-0 flex items-center justify-center w-7">
                          <div className={`w-5 h-5 rounded-full border-2 border-[#222] flex items-center justify-center bg-transparent transition-colors`}>
                          </div>
                        </button>
                        <div className="bg-white px-4 py-2.5 rounded-lg flex-1 flex justify-between gap-4 shadow-sm h-full items-center">
                          <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-medium text-gray-800 leading-snug wrap-break-word">{item.menuName}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{item.note ? `• ${item.note}` : 'กำลังเตรียม'}</span>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Items */}
              {completedItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-[13px] text-gray-800 mb-4 ml-1 mt-4">รายการที่เสร็จสิ้น</h3>
                  <div className="space-y-3">
                    {completedItems.map((item) => (
                      <div key={item.orderItemId} className="flex items-center gap-4">
                        <button className="shrink-0 flex items-center justify-center w-7">
                          <div className={`w-5 h-5 rounded-full border-2 border-[#222] flex items-center justify-center bg-transparent transition-colors`}>
                             <div className="w-2.5 h-2.5 rounded-full bg-[#222]" />
                          </div>
                        </button>
                        <div className="bg-white px-4 py-2.5 rounded-lg flex-1 flex justify-between gap-4 shadow-sm h-full items-center opacity-90">
                          <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-medium text-gray-800 leading-snug wrap-break-word">{item.menuName}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{item.note ? `• ${item.note}` : 'พร้อมเสิร์ฟ'}</span>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Order Button */}
              <div className="mt-auto flex justify-center pt-8 pb-2">
                <button onClick={() => void handleSubmitOrder()} disabled={isSubmitting || isLoading} className="bg-[#d20000] hover:bg-red-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors text-sm w-50 shadow-md disabled:cursor-not-allowed disabled:opacity-60">
                  {isSubmitting ? 'Sending...' : 'Send Order'}
                </button>
              </div>
                </>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
