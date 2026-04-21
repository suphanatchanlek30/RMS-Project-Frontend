"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { authSession } from "@/services/authSession";
import { DEFAULT_CASHIER_NAME } from "@/lib/constants/cashier.constants";
import { useRouter } from "next/navigation";

export default function CashierHeader() {
  const router = useRouter();
  // Initialize with default so server HTML matches initial client render,
  // then update from localStorage after hydration.
  const [cashierName, setCashierName] = useState(DEFAULT_CASHIER_NAME);

  useEffect(() => {
    const name = authSession.getEmployeeProfile()?.employeeName;
    if (name) setCashierName(name);
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/v1/auth/logout", {});
    } catch {
      // Best effort logout. Client state is cleared regardless of API outcome.
    } finally {
      authSession.clearClientAuthState();
      router.push("/auth");
    }
  };

  return (
    <div className="relative">
      <div
        className="px-6 py-5 flex justify-between items-center relative"
        style={{
          backgroundImage: "url('/cashier-section/header-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-red-900/70"></div>
        <div className="relative z-10 flex justify-between w-full items-center">
          <div className="bg-(--bg) text-black px-6 py-2 rounded-lg shadow-md">
            {cashierName}
          </div>
          <button
            onClick={handleLogout}
            className="text-white hover:scale-110 transition"
          >
            <LogOut size={36} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div
        className="w-full h-3"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #0a0a0a 0px, #0a0a0a 2px, #1a1a1a 2px, #1a1a1a 4px)",
        }}
      />
    </div>
  );
}
