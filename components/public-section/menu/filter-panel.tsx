// components/public-section/menu/filter-panel.tsx
"use client";

import { Category } from "@/components/public-section/public-section.types";

interface FilterPanelProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function FilterPanel({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: FilterPanelProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`flex-none px-6 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategoryId === category.id
              ? "bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20"
              : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/5"
          }`}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
}
