import type { Category, MenuItem } from "@/components/public-section/public-section.types";
import { publicService } from "./public.service";

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

    return {
      tableNumber: response.data.table.tableNumber,
      categories: [
        { id: "all", label: "เมนูทั้งหมด" },
        ...response.data.categories.map((category) => ({
          id: String(category.categoryId),
          label: category.categoryName,
          categoryId: category.categoryId,
          description: category.description,
        })),
      ],
      items: response.data.menus.map((item) => ({
        id: String(item.menuId),
        menuId: item.menuId,
        name: item.menuName,
        price: item.price,
        imageUrl: item.imageUrl ?? "/public-section/food-kaphrao.jpg",
        categoryId: item.categoryId ? String(item.categoryId) : "uncategorized",
        categoryName: item.categoryName,
        description: item.description,
      })),
    };
  },
};
