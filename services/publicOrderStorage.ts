import type { CustomerOrder } from "./public.service";

const LAST_ORDER_KEY = "publicLastOrder";

const parseJson = <T>(value: string | null): T | null => {
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

export const publicOrderStorage = {
  getLastOrder(): CustomerOrder | null {
    if (typeof window === "undefined") return null;
    return parseJson<CustomerOrder>(localStorage.getItem(LAST_ORDER_KEY));
  },

  setLastOrder(order: CustomerOrder) {
    if (typeof window === "undefined") return;
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  },

  clearLastOrder() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(LAST_ORDER_KEY);
  },
};