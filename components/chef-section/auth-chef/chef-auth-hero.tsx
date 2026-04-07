// components/chef-section/auth-chef/chef-auth-hero.tsx

import Image from "next/image";
import type { ChefAuthHeroProps } from "./auth-chef.types";

export function ChefAuthHero({ imagePath, imageAlt }: ChefAuthHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-(--bg) shadow-[0_20px_50px_rgba(0,0,0,0.12)] lg:col-span-7 lg:h-[min(78dvh,760px)]">

      <div className="h-[36dvh] sm:h-[42dvh] lg:h-full">
        <Image
          src={imagePath}
          alt={imageAlt}
          width={720}
          height={1080}
          className="block h-full w-full object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
