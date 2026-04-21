// components/public-section/order-success/order-success-view.tsx
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { publicOrderStorage } from "../../../services/publicOrderStorage";

export function OrderSuccessView() {
  const router = useRouter();
  const latestOrder = useMemo(() => publicOrderStorage.getLastOrder(), []);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      {/* Sparkles around the circle */}
      <div className="relative flex items-center justify-center w-48 h-48">
        {/* Sparkle elements */}
        <div className="absolute top-4 left-8 text-red-300 text-2xl animate-pulse" style={{ animationDelay: "0ms" }}>✦</div>
        <div className="absolute top-8 right-6 text-red-200 text-lg animate-pulse" style={{ animationDelay: "200ms" }}>✦</div>
        <div className="absolute top-2 right-14 text-red-400 text-sm animate-pulse" style={{ animationDelay: "400ms" }}>•</div>
        <div className="absolute bottom-8 left-6 text-red-300 text-xl animate-pulse" style={{ animationDelay: "600ms" }}>✦</div>
        <div className="absolute bottom-4 right-8 text-red-200 text-3xl animate-pulse" style={{ animationDelay: "100ms" }}>✦</div>
        <div className="absolute bottom-10 left-16 text-red-400 text-xs animate-pulse" style={{ animationDelay: "300ms" }}>•</div>
        <div className="absolute top-16 left-2 text-red-300 text-xs animate-pulse" style={{ animationDelay: "500ms" }}>•</div>

        {/* Checkmark circle */}
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-(--button-bg) shadow-lg shadow-red-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="space-y-1">
          <p className="text-xl font-semibold text-gray-800">ส่งออเดอร์เรียบร้อยแล้ว</p>
          <p className="text-sm text-gray-500">
            {latestOrder ? `Order #${latestOrder.orderId} ถูกส่งเข้าครัวแล้ว` : "ระบบได้รับรายการของคุณแล้ว"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/home/menu")}
          className="h-14 w-64 rounded-xl bg-(--button-bg) text-base font-bold text-white shadow transition-colors hover:bg-(--button-bg-hover) active:scale-95"
        >
          OK
        </button>
      </div>
    </div>
  );
}
