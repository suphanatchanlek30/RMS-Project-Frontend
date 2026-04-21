// components/public-session/bills/bill-item-card.tsx
import type { OrderBillItem } from "../public-section.types";

const STATUS_LABELS: Record<OrderBillItem["status"], string> = {
  preparing: "preparing",
  ready: "ready",
  served: "served",
};

const STATUS_COLORS: Record<OrderBillItem["status"], string> = {
  preparing: "text-amber-600 bg-amber-50",
  ready: "text-green-600 bg-green-50",
  served: "text-gray-500 bg-gray-100",
};

interface BillItemCardProps {
  item: OrderBillItem;
}

export function BillItemCard({ item }: BillItemCardProps) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 shadow-sm">
      {/* Name + price on one row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-gray-800 leading-snug flex-1">
          {item.name}
        </p>
        <span className="text-sm font-bold text-gray-800 flex-shrink-0">
          ฿{item.price.toFixed(2)}
        </span>
      </div>

      {/* Options */}
      {item.options.length > 0 && (
        <ul className="mt-1 space-y-0.5">
          {item.options.map((opt) => (
            <li key={opt} className="flex items-center gap-1 text-xs text-gray-500">
              <span className="h-1 w-1 rounded-full bg-gray-400 flex-shrink-0" />
              {opt}
            </li>
          ))}
        </ul>
      )}

      {/* Status badge */}
      <div className="mt-2.5">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[item.status]}`}
        >
          Status : {STATUS_LABELS[item.status]}
        </span>
      </div>
    </div>
  );
}
