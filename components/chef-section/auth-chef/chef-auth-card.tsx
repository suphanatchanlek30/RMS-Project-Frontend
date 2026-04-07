// components/chef-section/auth-chef/chef-auth-card.tsx

import type { ChefAuthCardProps } from "./auth-chef.types";
import { ChefAuthInputField } from "./chef-auth-input-field";

export function ChefAuthCard({ content }: ChefAuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-black/5 bg-(--bg) p-6 shadow-[0_20px_48px_rgba(0,0,0,0.08)] sm:p-8">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-(--color-subtext)">
        Welcome Back
      </p>

      <h1 className="m-0 text-center text-3xl font-bold leading-tight text-(--color-text) sm:text-4xl">
        {content.title}
      </h1>

      <p className="mt-2 text-center text-sm text-(--color-subtext)">
        เข้าถึงระบบจัดการครัวอย่างรวดเร็วและปลอดภัย
      </p>

      <form className="mt-7 flex flex-col" action="#" method="post">
        <ChefAuthInputField
          id="chef-username"
          name="username"
          type="text"
          autoComplete="username"
          label={content.usernameLabel}
          placeholder="กรอกชื่อผู้ใช้"
        />

        <ChefAuthInputField
          id="chef-password"
          name="password"
          type="password"
          autoComplete="current-password"
          label={content.passwordLabel}
          placeholder="กรอกรหัสผ่าน"
          className="mt-5"
        />

        <button
          type="submit"
          className="mt-7 h-12 w-full rounded-xl bg-(--button-bg) text-lg font-semibold leading-none text-(--bg) transition-[transform,background-color,box-shadow] duration-200 ease-in hover:-translate-y-px hover:bg-(--button-bg-hover) hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-(--primary-soft)"
        >
          {content.submitLabel}
        </button>
      </form>
    </div>
  );
}
