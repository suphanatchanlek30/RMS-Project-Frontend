// components/chef-section/auth-chef/chef-auth-card.tsx

"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ChefAuthCardProps } from "./auth-chef.types";
import { ChefAuthInputField } from "./chef-auth-input-field";
import { loginService } from "@/services/loginService";

export function ChefAuthCard({ content }: ChefAuthCardProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const response = await loginService({ email: username, password });

    if (response.status === "success") {
      router.push("/all-order");
    } else {
      setErrorMessage(response.message ?? "Username หรือ Password ไม่ถูกต้อง");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-[#191c1d]/95 px-4 py-5 shadow-[0_22px_56px_rgba(0,0,0,0.42)] sm:max-w-90 sm:px-5 sm:py-6">
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-md">
        <Image
          src={content.imagePath}
          alt={content.imageAlt}
          width={56}
          height={56}
          className="h-14 w-14 object-contain"
          priority
        />
      </div>

      <h1 className="m-0 text-center text-[38px] font-bold leading-none text-white">
        {content.title}
      </h1>

      <p className="mt-2 text-center text-sm text-white/75">สำหรับพนักงาน</p>

      <form className="mt-6 flex flex-col" onSubmit={handleSubmit}>
        <ChefAuthInputField
          id="chef-username"
          name="username"
          type="text"
          autoComplete="username"
          label={content.usernameLabel}
          placeholder="username"
          value={username}
          disabled={isSubmitting}
          onChange={(event) => setUsername(event.target.value)}
        />

        <ChefAuthInputField
          id="chef-password"
          name="password"
          type="password"
          autoComplete="current-password"
          label={content.passwordLabel}
          placeholder="password"
          value={password}
          disabled={isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-5"
        />

        {errorMessage ? (
          <p className="mt-4 text-sm text-red-300">{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto mt-7 h-10 w-full max-w-57.5 rounded-lg bg-(--button-bg) text-base font-semibold leading-none text-(--bg) transition-[transform,background-color,box-shadow] duration-200 ease-in hover:-translate-y-px hover:bg-(--button-bg-hover) hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-(--primary-soft) disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "กำลังเข้าสู่ระบบ..." : content.submitLabel}
        </button>
      </form>
    </div>
  );
}
