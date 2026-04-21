// components/public-session/public-section.types.ts

export interface MenuOption {
  id: string;
  label: string;
  priceAddon?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  options?: MenuOption[];
}

export interface Category {
  id: string;
  label: string;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: string[];
  note: string;
  totalPrice: number;
}

export interface OrderBillItem {
  id: string;
  name: string;
  options: string[];
  price: number;
  status: "preparing" | "ready" | "served";
}

export interface RestaurantInfo {
  name: string;
  logoUrl: string;
  logoAlt: string;
  address: string;
}
