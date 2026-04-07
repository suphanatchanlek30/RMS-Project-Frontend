// components/chef-section/auth-chef/chef-auth-login.tsx

import { CHEF_AUTH_LOGIN_CONTENT } from "@/lib/constants";
import { ChefAuthCard } from "./chef-auth-card";
import { ChefAuthHero } from "./chef-auth-hero";

export function ChefAuthLogin() {
  return (
    <main className="min-h-dvh bg-[linear-gradient(180deg,var(--muted)_0%,var(--bg)_100%)]">
      <section
        className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 items-center gap-6 px-4 py-6 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8"
        aria-label="Chef authentication"
      >
        <ChefAuthHero
          imagePath={CHEF_AUTH_LOGIN_CONTENT.imagePath}
          imageAlt={CHEF_AUTH_LOGIN_CONTENT.imageAlt}
        />

        <div className="flex items-stretch justify-center lg:col-span-5 lg:items-center">
          <ChefAuthCard content={CHEF_AUTH_LOGIN_CONTENT} />
        </div>
      </section>
    </main>
  );
}
