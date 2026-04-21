// components/public-section/welcome/welcome-hero.tsx
import Image from "next/image";

interface WelcomeHeroProps {
  logoUrl: string;
  title: string;
  subtitle: string;
}

export function WelcomeHero({ logoUrl, title, subtitle }: WelcomeHeroProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="relative h-44 w-44">
        <Image
          src={logoUrl}
          alt="ตามสั่งรถซิง logo"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold leading-tight text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-white/70">{subtitle}</p>
      </div>
    </div>
  );
}
