"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CashierAuthInput from "./cashier-auth-input";
import { CASHIER_AUTH } from "@/lib/constants/cashier-auth.constants";

export default function CashierAuthCard() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "cashier@test.com" && password === "1234") {
      router.push("/cashier");
    } else {
      alert("Username หรือ Password ไม่ถูกต้อง");
    }
  };

  return (
    <div className="bg-black/80 backdrop-blur-md w-[400px] rounded-xl shadow-2xl p-8 text-center">

      {/* logo */}
      <img src={CASHIER_AUTH.logo} className="w-14 mx-auto mb-4" />

      {/* title */}
      <h1 className="text-white text-2xl font-bold">
        {CASHIER_AUTH.title}
      </h1>

      <p className="text-gray-300 text-sm mb-6">
        {CASHIER_AUTH.subtitle}
      </p>

      {/* inputs */}
      <div className="flex flex-col gap-4 mb-6">
        <CashierAuthInput
          placeholder={CASHIER_AUTH.usernamePlaceholder}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <CashierAuthInput
          type="password"
          placeholder={CASHIER_AUTH.passwordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* button */}
      <button
        onClick={handleLogin}
        className="w-full bg-[var(--button-bg)] hover:bg-[var(--button-bg-hover)] text-white py-3 rounded-lg font-semibold"
      >
        {CASHIER_AUTH.loginButton}
      </button>
    </div>
  );
}