import React from 'react';
import Link from 'next/link';

export interface OrderItem {
  name: string;
  qty: number;
}

export interface OrderItemProps {
  id: string;
  status: 'new' | 'preparing' | 'completed';
  items: OrderItem[];
}

export default function OrderCard({ id, status, items }: OrderItemProps) {
  const statusColor = status === 'new' ? 'bg-red-500' : status === 'preparing' ? 'bg-yellow-400' : 'bg-green-500';

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-gray-400 text-white font-bold px-4 py-1 rounded-full text-xs">
          {id}
        </div>
        <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
      </div>

      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
        <span className="text-sm font-bold text-gray-800">รายการอาหาร</span>
        <span className="text-sm font-bold text-gray-800">จำนวน</span>
      </div>

      <div className="flex-1 space-y-3 mb-6">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start gap-4">
            <span className="text-xs text-gray-700 flex-1 leading-relaxed pr-2">{item.name}</span>
            <span className="text-xs font-semibold text-gray-900 mt-0.5">x{item.qty}</span>
          </div>
        ))}
      </div>

              <div className="mt-auto flex justify-center">
        <Link href={`/all-order/${id}`} className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors w-2/3 text-center block">
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
