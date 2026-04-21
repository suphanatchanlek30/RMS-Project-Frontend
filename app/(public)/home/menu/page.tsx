// app/(public)/home/menu/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MenuHeader } from "@/components/public-section/menu/menu-header";
import { RestaurantInfoCard } from "@/components/public-section/menu/restaurant-info-card";
import { CategoryTabs } from "@/components/public-section/menu/category-tabs";
import { MenuList } from "@/components/public-section/menu/menu-list";
import { SearchBar } from "@/components/public-section/menu/search-bar";
import { RESTAURANT_INFO } from "@/lib/constants/public-session.constants";
import { useItems } from "@/hooks/useItems";
import { publicSession } from "@/services/publicSession";

export default function MenuPage() {
  const searchParams = useSearchParams();
  const {
    items,
    categories,
    tableInfo,
    loading,
    error,
    search,
    setSearch,
    category,
    setCategory,
  } = useItems();

  useEffect(() => {
    const qrToken = searchParams.get("qrToken");
    if (qrToken) {
      publicSession.setQrToken(qrToken);
    }
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Red top accent */}
      <div className="h-2 bg-(--button-bg)" />

      {/* Header */}
      <MenuHeader tableNumber={tableInfo?.tableNumber ?? "-"} />

      {/* Restaurant info / Branding */}
      <RestaurantInfoCard info={RESTAURANT_INFO} />

      {error ? (
        <div className="mt-4 px-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      ) : null}

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
          categories={categories}
          activeId={category}
          onSelect={setCategory}
        />
      </div>

      {/* Menu list */}
      <div className="mt-2 flex-1 pb-8">
        <MenuList
          items={items}
          categories={categories}
          activeCategoryId={category}
          loading={loading}
        />
      </div>
    </main>
  );
}
