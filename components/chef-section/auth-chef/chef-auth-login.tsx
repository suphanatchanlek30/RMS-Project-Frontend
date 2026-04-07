// components/chef-section/auth-chef/chef-auth-login.tsx

import { CHEF_AUTH_LOGIN_CONTENT } from "@/lib/constants";
import { ChefAuthCard } from "./chef-auth-card";

export function ChefAuthLogin() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#3a090d] [background-image:radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(135deg,#5d1016_0%,#2b060a_100%)] [background-size:3px_3px,100%_100%]">
      <section
        className="mx-auto flex min-h-dvh w-full max-w-6xl items-center justify-center px-4 py-8"
        aria-label="Chef authentication"
      >
        <ChefAuthCard content={CHEF_AUTH_LOGIN_CONTENT} />
      </section>

      <div className="pointer-events-none absolute inset-x-0 bottom-6 hidden items-center justify-center gap-5 text-white/85 md:flex">
        <span className="h-px w-24 bg-white/55" />
        <span className="text-sm font-medium tracking-wide">ตามสั่งรถซิ่ง</span>
        <span className="h-px w-24 bg-white/55" />
      </div>
    </main>
  );
}
