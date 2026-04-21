// components/public-session/menu/menu-item-card.tsx
import Image from "next/image";
import Link from "next/link";
import type { MenuItem } from "../public-section.types";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <Link href={`/menu/${item.id}`} className="block">
      <div className="flex items-center gap-3 py-3 px-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
        {/* Image */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
            {item.name}
          </p>
          <p className="mt-1.5 text-sm font-semibold text-gray-700">
            ฿ {item.price.toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
