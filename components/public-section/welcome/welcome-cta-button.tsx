// components/public-session/welcome/welcome-cta-button.tsx
"use client";

import { useRouter } from "next/navigation";

interface WelcomeCtaButtonProps {
  label: string;
  tableNumber: string;
  href: string;
}

export function WelcomeCtaButton({
  label,
  href,
}: WelcomeCtaButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className="h-14 w-full rounded-xl bg-(--button-bg) text-base font-bold text-white shadow-lg transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-(--button-bg-hover) active:scale-95"
    >
      {label}
    </button>
  );
}
