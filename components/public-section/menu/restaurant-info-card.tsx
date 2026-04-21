// components/public-session/menu/restaurant-info-card.tsx
import Image from "next/image";
import type { RestaurantInfo } from "../public-section.types";

interface RestaurantInfoCardProps {
  info: RestaurantInfo;
}

export function RestaurantInfoCard({ info }: RestaurantInfoCardProps) {
  return (
    <div className="relative mx-4 mt-4 flex items-center gap-3 rounded-2xl bg-[#1e1e1e] p-4 shadow-md overflow-hidden">
      {/* Subtle background pattern */}
      <div className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 50%, #b91c1c 0%, transparent 60%)",
        }}
      />

      {/* Logo */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl border-2 border-white/10">
          <Image
            src={info.logoUrl}
            alt={info.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Info */}
      <div className="relative z-10 flex-1 min-w-0">
        <div className="flex items-start gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p className="text-xs leading-snug text-gray-300 line-clamp-3">
            {info.address}
          </p>
        </div>
      </div>
    </div>
  );
}
