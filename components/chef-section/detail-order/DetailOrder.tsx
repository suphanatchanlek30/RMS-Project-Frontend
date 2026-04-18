"use client";

import React, { useState } from 'react';
import { LogOut, ChevronDown, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Spark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0 C12 8 16 12 24 12 C16 12 12 16 12 24 C12 16 8 12 0 12 C8 12 12 8 12 0 Z"/>
  </svg>
);

const TabButton = ({ active, onClick, label, count, countColor = "bg-gray-200 text-gray-800", activeColor = "bg-[#d20000] text-white" }: any) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-5 py-2 rounded-full border transition-all shadow-sm
        ${active ? `${activeColor} border-transparent` : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
    >
      <span className="font-semibold text-sm">{label}</span>
      {count !== undefined && count > 0 && (
        <span className={`flex items-center justify-center min-w-[20px] h-[20px] rounded-full text-xs font-bold px-1.5
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

  // Hardcode counts for UI representation
  const allCount = 9;
  const newOrdersCount = 3;
  const preparingCount = 3;
  const completedCount = 3;
  const historyCount = 0;

  // Mock list items state roughly matching the image
  const [items, setItems] = useState([
    { id: 1, name: 'กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว', options: '• หมูสับ', qty: 1, done: false },
    { id: 2, name: 'กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว', options: '• หมูสับ', qty: 1, done: false },
    { id: 3, name: 'กะเพรา (หมูสับ / ไก่ / หมูกรอบ / ทะเล) ราดข้าว', options: '• หมูสับ', qty: 1, done: true },
  ]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const pendingItems = items.filter(item => !item.done);
  const completedItems = items.filter(item => item.done);

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <div className="flex flex-col w-full flex-1">
        {/* Header Section */}
        <div className="bg-[#5d1616] relative border-b-8 border-[#212121]">
          {/* Subtle noise/texture overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '4px 4px' }}></div>
          
          <div className="flex items-center justify-between px-6 py-5 relative z-10">
            <div className="bg-white rounded-md px-8 py-2.5 shadow-sm">
              <span className="font-bold text-gray-800">นาย XXX XXX</span>
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
            
            <div className="flex flex-shrink-0 items-center bg-[#f8f9fa] border border-gray-200 rounded-full px-5 py-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
              <span className="text-[13px] font-semibold mr-2 text-gray-800">Lastest Order</span>
              <ChevronDown size={18} className="text-gray-600" />
            </div>
          </div>

          {/* Centered Detail Card */}
          <div className="flex justify-center w-full flex-1 mb-8">
            {isSubmitted ? (
              <div className="bg-[#f2f2f2] rounded-[24px] p-8 w-full max-w-[450px] shadow-sm flex flex-col border border-gray-200 justify-center items-center relative overflow-hidden min-h-[450px]">
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
                     <div className="absolute w-[5px] h-[5px] rounded-full bg-[#f08080] top-[30%] right-[40%]" />
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
            <div className="bg-[#f2f2f2] rounded-[24px] p-8 w-full max-w-[450px] shadow-sm flex flex-col border border-gray-200">
              {/* Order ID Tag */}
              <div className="mb-6 flex">
                <div className="bg-white px-5 py-2 rounded-lg font-bold text-[14px] shadow-sm text-gray-800">
                  {orderId.toUpperCase()}
                </div>
              </div>

              {/* Pending Items */}
              {pendingItems.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-[13px] text-gray-800 mb-4 ml-1">รายการที่ยังไม่ได้ทำ</h3>
                  <div className="space-y-3">
                    {pendingItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <button onClick={() => toggleItem(item.id)} className="flex-shrink-0 flex items-center justify-center w-7">
                          <div className={`w-[20px] h-[20px] rounded-full border-[2px] border-[#222] flex items-center justify-center bg-transparent transition-colors`}>
                          </div>
                        </button>
                        <div className="bg-white px-4 py-2.5 rounded-lg flex-1 flex justify-between gap-4 shadow-sm h-full items-center">
                          <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-medium text-gray-800 leading-snug break-words">{item.name}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{item.options}</span>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x{item.qty}</span>
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
                      <div key={item.id} className="flex items-center gap-4">
                        <button onClick={() => toggleItem(item.id)} className="flex-shrink-0 flex items-center justify-center w-7">
                          <div className={`w-[20px] h-[20px] rounded-full border-[2px] border-[#222] flex items-center justify-center bg-transparent transition-colors`}>
                             <div className="w-[10px] h-[10px] rounded-full bg-[#222]" />
                          </div>
                        </button>
                        <div className="bg-white px-4 py-2.5 rounded-lg flex-1 flex justify-between gap-4 shadow-sm h-full items-center opacity-90">
                          <div className="flex flex-col flex-1">
                            <span className="text-[11px] font-medium text-gray-800 leading-snug break-words">{item.name}</span>
                            <span className="text-[10px] text-gray-500 mt-1">{item.options}</span>
                          </div>
                          <span className="text-[11px] font-bold text-gray-500">x{item.qty}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Send Order Button */}
              <div className="mt-auto flex justify-center pt-8 pb-2">
                <button onClick={() => setIsSubmitted(true)} className="bg-[#d20000] hover:bg-red-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors text-sm w-[200px] shadow-md">
                  Send Order
                </button>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
