"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import CashierAuthInput from "./cashier-auth-input";
import { CASHIER_AUTH } from "@/lib/constants/cashier-auth.constants";
import { loginService } from "@/services/loginService";

export default function CashierAuthCard() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const response = await loginService({ email: username, password });

    if (response.status === "success") {
      router.push("/cashier");
    } else {
      setErrorMessage(response.message ?? "Username หรือ Password ไม่ถูกต้อง");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="bg-black/80 backdrop-blur-md w-100 rounded-xl shadow-2xl p-8 text-center">

      {/* logo */}
      <img src={CASHIER_AUTH.logo} alt="Cashier logo" className="w-14 mx-auto mb-4" />

      {/* title */}
      <h1 className="text-white text-2xl font-bold">
        {CASHIER_AUTH.title}
      </h1>

      <p className="text-gray-300 text-sm mb-6">
        {CASHIER_AUTH.subtitle}
      </p>

      <form onSubmit={handleLogin}>
        {/* inputs */}
        <div className="flex flex-col gap-4 mb-6">
          <CashierAuthInput
            placeholder={CASHIER_AUTH.usernamePlaceholder}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
          />

          <CashierAuthInput
            type="password"
            placeholder={CASHIER_AUTH.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        {errorMessage ? (
          <p className="mb-4 text-sm text-red-300">{errorMessage}</p>
        ) : null}

        {/* button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-(--button-bg) hover:bg-(--button-bg-hover) text-white py-3 rounded-lg font-semibold disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : CASHIER_AUTH.loginButton}
        </button>
      </form>
    </div>
  );
}