import React from 'react';
import Link from 'next/link';

export interface OrderItem {
  name: string;
  qty: number;
}

export interface OrderItemProps {
  id: string;
  tableNumber?: string;
  orderTime?: string;
  status: 'new' | 'preparing' | 'completed';
  items: OrderItem[];
}

const STATUS_CONFIG = {
  new: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'รอทำ' },
  preparing: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'กำลังทำ' },
  completed: { dot: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'เสร็จแล้ว' },
};

export default function OrderCard({ id, tableNumber, orderTime, status, items }: OrderItemProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="bg-[#f8f9fa] rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-gray-700 text-white font-bold px-3 py-1 rounded-full text-xs">
            #{id}
          </div>
          {tableNumber && (
            <div className="text-xs font-semibold text-gray-500">{tableNumber}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
      </div>

      {orderTime && (
        <div className="text-xs text-gray-400 mb-3">
          {new Date(orderTime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      <div className="flex justify-between items-center border-b-2 border-gray-200 pb-2 mb-3">
        <span className="text-sm font-bold text-gray-800">รายการอาหาร</span>
        <span className="text-sm font-bold text-gray-800">จำนวน</span>
      </div>

      <div className="flex-1 space-y-2 mb-5">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center gap-4">
            <span className="text-xs text-gray-700 flex-1 leading-relaxed">{item.name}</span>
            <span className="text-xs font-semibold text-gray-900">x{item.qty}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto flex justify-center">
        <Link
          href={`/all-order/${id}`}
          className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors w-2/3 text-center block"
        >
          ดูรายละเอียด
        </Link>
      </div>
    </div>
  );
}
