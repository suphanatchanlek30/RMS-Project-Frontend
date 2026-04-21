// components/public-section/cart/cart-item-card.tsx
"use client";

import Image from "next/image";
import type { CartItem } from "../public-section.types";

interface CartItemCardProps {
  item: CartItem;
  onRemove: (cartItemId: string) => void;
}

export function CartItemCard({ item, onRemove }: CartItemCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-3 shadow-sm">
      {/* Image */}
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-200">
        <Image
          src={item.menuItem.imageUrl}
          alt={item.menuItem.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug text-gray-800 line-clamp-2">
            {item.menuItem.name}
          </p>
          <span className="flex-shrink-0 text-sm font-semibold text-gray-600">
            x{item.quantity}
          </span>
        </div>

        {item.selectedOptions.length > 0 && (
          <ul className="mt-1 space-y-0.5">
            {item.selectedOptions.map((opt) => (
              <li key={opt} className="flex items-center gap-1 text-xs text-gray-500">
                <span className="h-1 w-1 rounded-full bg-gray-400 flex-shrink-0" />
                {opt}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-1.5 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-800">
            ฿{item.totalPrice.toFixed(2)}
          </p>
          <button
            type="button"
            onClick={() => onRemove(item.cartItemId)}
            className="text-xs text-red-500 hover:underline"
          >
            ลบ
          </button>
        </div>
      </div>
    </div>
  );
}
