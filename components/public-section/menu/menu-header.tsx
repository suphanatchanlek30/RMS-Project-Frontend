// components/public-section/menu/menu-header.tsx
"use client";

import Link from "next/link";
import { useCart } from "../cart-context";

interface MenuHeaderProps {
  tableNumber: string;
}

export function MenuHeader({ tableNumber }: MenuHeaderProps) {
  const { totalCount } = useCart();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
      {/* Table number pill */}
      <div className="rounded-xl border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white shadow-sm">
        โต๊ะ : {tableNumber}
      </div>

      {/* Icons right */}
      <div className="flex items-center gap-3">
        {/* Order history icon */}
        <Link href="/home/bills" aria-label="ใบเสร็จ">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <line x1="9" y1="7" x2="15" y2="7" />
              <line x1="9" y1="11" x2="15" y2="11" />
              <line x1="9" y1="15" x2="12" y2="15" />
            </svg>
          </div>
        </Link>

        {/* Cart icon with badge */}
        <Link href="/home/cart" aria-label="ตะกร้า">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-(--button-bg) text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
}
