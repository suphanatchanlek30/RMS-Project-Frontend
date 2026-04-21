// components/public-section/menu/category-tabs.tsx
"use client";

import type { Category } from "../public-section.types";

interface CategoryTabsProps {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({
  categories,
  activeId,
  onSelect,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = cat.id === activeId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelect(cat.id)}
            className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
              isActive
                ? "bg-(--button-bg) text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
