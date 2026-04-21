// components/public-section/menu/menu-list.tsx
import type { MenuItem, Category } from "../public-section.types";
import { MenuItemCard } from "./menu-item-card";

interface MenuListProps {
  items: MenuItem[];
  categories: Category[];
  activeCategoryId: string;
  loading?: boolean;
}

export function MenuList({ items, categories, activeCategoryId, loading }: MenuListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const categoriesToShow =
    activeCategoryId === "all"
      ? categories.filter((c) => c.id !== "all")
      : categories.filter((c) => c.id === activeCategoryId);

  const filteredByCategory = (categoryId: string) =>
    items.filter((item) => item.categoryId === categoryId);

  const hasItems = items.length > 0;

  if (!hasItems) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🍽️</span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">ไม่พบเมนูที่ต้องการ</h3>
        <p className="text-sm text-gray-500">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ใหม่</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {categoriesToShow.map((cat) => {
        const catItems = filteredByCategory(cat.id);
        if (catItems.length === 0) return null;
        return (
          <section key={cat.id} className="mb-2">
            <h2 className="px-4 py-3 text-base font-bold text-gray-800">
              {cat.label}
            </h2>
            <div className="divide-y divide-gray-100">
              {catItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}

      {activeCategoryId === "all" && categoriesToShow.every((cat) => filteredByCategory(cat.id).length === 0) ? (
        <section className="mb-2">
          <h2 className="px-4 py-3 text-base font-bold text-gray-800">เมนูทั้งหมด</h2>
          <div className="divide-y divide-gray-100">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
