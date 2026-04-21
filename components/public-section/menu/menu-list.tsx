// components/public-session/menu/menu-list.tsx
import type { MenuItem, Category } from "../public-section.types";
import { MenuItemCard } from "./menu-item-card";

interface MenuListProps {
  items: MenuItem[];
  categories: Category[];
  activeCategoryId: string;
}

export function MenuList({ items, categories, activeCategoryId }: MenuListProps) {
  const categoriesToShow =
    activeCategoryId === "all"
      ? categories.filter((c) => c.id !== "all")
      : categories.filter((c) => c.id === activeCategoryId);

  const filteredByCategory = (categoryId: string) =>
    items.filter((item) => item.categoryId === categoryId);

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
    </div>
  );
}
