// components/chef-section/auth-chef/chef-auth-card.tsx

import Image from "next/image";
import type { ChefAuthCardProps } from "./auth-chef.types";
import { ChefAuthInputField } from "./chef-auth-input-field";

export function ChefAuthCard({ content }: ChefAuthCardProps) {
  return (
    <div className="w-full max-w-[320px] rounded-2xl border border-white/10 bg-[#191c1d]/95 px-4 py-5 shadow-[0_22px_56px_rgba(0,0,0,0.42)] sm:max-w-[360px] sm:px-5 sm:py-6">
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

      <form className="mt-6 flex flex-col" action="#" method="post">
        <ChefAuthInputField
          id="chef-username"
          name="username"
          type="text"
          autoComplete="username"
          label={content.usernameLabel}
          placeholder="username"
        />

        <ChefAuthInputField
          id="chef-password"
          name="password"
          type="password"
          autoComplete="current-password"
          label={content.passwordLabel}
          placeholder="password"
          className="mt-5"
        />

        <button
          type="submit"
          className="mx-auto mt-7 h-10 w-full max-w-[230px] rounded-lg bg-(--button-bg) text-base font-semibold leading-none text-(--bg) transition-[transform,background-color,box-shadow] duration-200 ease-in hover:-translate-y-px hover:bg-(--button-bg-hover) hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-(--primary-soft)"
        >
          {content.submitLabel}
        </button>
      </form>
    </div>
  );
}
