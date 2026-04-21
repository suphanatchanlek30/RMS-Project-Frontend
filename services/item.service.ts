// services/item.service.ts
import { MenuItem } from "@/components/public-section/public-section.types";

/**
 * Service to handle menu item data fetching with search and filter support.
 */
export const itemService = {
  /**
   * Fetches menu items based on search keyword and category.
   * @param search - Search keyword
   * @param category - Category ID
   * @returns List of menu items
   */
  async getItems(search?: string, category?: string): Promise<MenuItem[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category && category !== "all") params.append("category", category);

    const queryString = params.toString();
    const url = `/api/items${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching items:", error);
      // For now, return empty or handle appropriately
      throw error;
    }
  },
};
