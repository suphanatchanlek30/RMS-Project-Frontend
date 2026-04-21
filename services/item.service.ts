import type { Category, MenuItem } from "@/components/public-section/public-section.types";
import { publicService } from "./public.service";

const asList = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    if (Array.isArray(record.items)) return record.items as T[];
    if (Array.isArray(record.rows)) return record.rows as T[];
    if (Array.isArray(record.results)) return record.results as T[];
  }
  return [];
};

export const itemService = {
  async getMenuBundle(qrToken: string): Promise<{
    tableNumber: string;
    categories: Category[];
    items: MenuItem[];
  }> {
    const response = await publicService.getCustomerMenus(qrToken);
    if (!response.success || !response.data) {
      throw new Error(response.message);
    }

    const categoryList = asList<{
      categoryId?: number;
      id?: number;
      categoryName?: string;
      name?: string;
      description?: string;
    }>(response.data.categories);

    const baseCategories: Category[] = categoryList
      .map((category) => {
        const categoryId = Number(category.categoryId ?? category.id);
        const label = (category.categoryName ?? category.name ?? "").trim();
        if (!label || Number.isNaN(categoryId)) return null;
        return {
          id: String(categoryId),
          label,
          categoryId,
          description: category.description,
        };
      })
      .filter((value): value is Category => value !== null);

    const categoryByName = new Map(baseCategories.map((category) => [category.label.toLowerCase(), category.id]));

    const menuList = asList<{
      menuId?: number;
      id?: number;
      menuName?: string;
      name?: string;
      price?: number;
      description?: string;
      imageUrl?: string;
      categoryId?: number;
      category_id?: number;
      categoryName?: string;
      category_name?: string;
    }>(response.data.menus);

    const items: MenuItem[] = menuList
      .map((item) => {
        const menuId = Number(item.menuId ?? item.id);
        const name = (item.menuName ?? item.name ?? "").trim();
        const categoryName = (item.categoryName ?? item.category_name ?? "").trim();

        if (!name || Number.isNaN(menuId)) return null;

        const rawCategoryId = Number(item.categoryId ?? item.category_id);
        const categoryId = !Number.isNaN(rawCategoryId)
          ? String(rawCategoryId)
          : categoryName
            ? (categoryByName.get(categoryName.toLowerCase()) ?? "uncategorized")
            : "uncategorized";

        return {
          id: String(menuId),
          menuId,
          name,
          price: Number(item.price ?? 0),
          imageUrl: item.imageUrl ?? "/public-section/food-kaphrao.jpg",
          categoryId,
          categoryName: categoryName || undefined,
          description: item.description,
        };
      })
      .filter((value): value is MenuItem => value !== null);

    const missingCategoryIds = [...new Set(items.map((item) => item.categoryId))].filter(
      (id) => id !== "all" && !baseCategories.some((category) => category.id === id)
    );

    const derivedCategories: Category[] = missingCategoryIds.map((id) => {
      if (id === "uncategorized") {
        return { id: "uncategorized", label: "อื่นๆ" };
      }
      const sampleItem = items.find((item) => item.categoryId === id);
      return {
        id,
        label: sampleItem?.categoryName ?? `หมวด ${id}`,
      };
    });

    const categories = [
      { id: "all", label: "เมนูทั้งหมด" },
      ...baseCategories,
      ...derivedCategories,
    ];

    return {
      tableNumber: response.data.table?.tableNumber ?? `T${response.data.table?.tableId ?? "-"}`,
      categories,
      items,
    };
  },
};
