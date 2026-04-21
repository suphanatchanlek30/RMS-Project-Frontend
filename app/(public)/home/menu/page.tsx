// app/(public-session)/menu/page.tsx
"use client";

import { useState } from "react";
import { MenuHeader } from "@/components/public-section/menu/menu-header";
import { RestaurantInfoCard } from "@/components/public-section/menu/restaurant-info-card";
import { CategoryTabs } from "@/components/public-section/menu/category-tabs";
import { MenuList } from "@/components/public-section/menu/menu-list";
import { CATEGORIES, MENU_ITEMS, RESTAURANT_INFO } from "@/lib/constants/public-session.constants";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Red top accent */}
      <div className="h-2 bg-(--button-bg)" />

      {/* Header */}
      <MenuHeader tableNumber="XX" />

      {/* Restaurant info */}
      <RestaurantInfoCard info={RESTAURANT_INFO} />

      {/* Search + category bar */}
      <div className="mt-4 flex items-center gap-2 px-4">
        <button
          type="button"
          aria-label="ค้นหา"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
        <button
          type="button"
          aria-label="ตัวกรอง"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="7" y1="12" x2="17" y2="12"/>
            <line x1="10" y1="18" x2="14" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Category tabs */}
      <div className="mt-3">
        <CategoryTabs
          categories={CATEGORIES}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
      </div>

      {/* Menu list */}
      <div className="mt-2 flex-1 pb-8">
        <MenuList
          items={MENU_ITEMS}
          categories={CATEGORIES}
          activeCategoryId={activeCategory}
        />
      </div>
    </main>
  );
}
