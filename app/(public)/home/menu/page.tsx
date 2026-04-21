// app/(public)/home/menu/page.tsx
"use client";

import { MenuHeader } from "@/components/public-section/menu/menu-header";
import { RestaurantInfoCard } from "@/components/public-section/menu/restaurant-info-card";
import { CategoryTabs } from "@/components/public-section/menu/category-tabs";
import { MenuList } from "@/components/public-section/menu/menu-list";
import { SearchBar } from "@/components/public-section/menu/search-bar";
import { CATEGORIES, RESTAURANT_INFO } from "@/lib/constants/public-session.constants";
import { useItems } from "@/hooks/useItems";

export default function MenuPage() {
  const {
    items,
    loading,
    search,
    setSearch,
    category,
    setCategory,
  } = useItems();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Red top accent */}
      <div className="h-2 bg-(--button-bg)" />

      {/* Header */}
      <MenuHeader tableNumber="1" />

      {/* Restaurant info / Branding */}
      <RestaurantInfoCard info={RESTAURANT_INFO} />

      {/* Search Section */}
      <div className="mt-6 px-4">
        <SearchBar 
          value={search} 
          onChange={setSearch} 
          placeholder="ค้นหาชื่อเมนู เช่น 'กะเพรา'..." 
        />
      </div>

      {/* Category tabs */}
      <div className="mt-6">
        <div className="px-4 mb-2">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">หมวดหมู่</h3>
        </div>
        <CategoryTabs
          categories={CATEGORIES}
          activeId={category}
          onSelect={setCategory}
        />
      </div>

      {/* Menu list */}
      <div className="mt-2 flex-1 pb-8">
        <MenuList
          items={items}
          categories={CATEGORIES}
          activeCategoryId={category}
          loading={loading}
        />
      </div>
    </main>
  );
}
