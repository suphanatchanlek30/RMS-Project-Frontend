import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

const API_PREFIX = "/api/v1";

export type ChefOrderStatus = "new" | "preparing" | "completed";
export type ChefOrderItemStatus = "pending" | "completed";

export interface ChefOrderCardItem {
  name: string;
  qty: number;
}

export interface ChefOrderItemDetail {
  orderItemId: number;
  menuName: string;
  quantity: number;
  note?: string;
  itemStatus: ChefOrderItemStatus;
}

export interface ChefOrderSummary {
  id: string;
  status: ChefOrderStatus;
  items: ChefOrderCardItem[];
}

export interface ChefOrderDetail {
  id: string;
  status: ChefOrderStatus;
  tableLabel: string;
  orderTime?: string;
  items: ChefOrderItemDetail[];
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface KitchenApiItem {
  orderItemId?: number;
  itemId?: number;
  menuName?: string;
  name?: string;
  quantity?: number;
  qty?: number;
  note?: string;
  itemStatus?: string;
  status?: string;
}

interface KitchenApiOrder {
  orderId?: number | string;
  id?: number | string;
  tableNumber?: string;
  tableId?: number | string;
  orderStatus?: string;
  status?: string;
  orderTime?: string;
  createdAt?: string;
  items?: KitchenApiItem[];
  orderItems?: KitchenApiItem[];
}

interface ServiceResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (!isAxiosError(error)) return fallbackMessage;

  const apiMessage = error.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return fallbackMessage;
};

const normalizeOrderStatus = (status?: string): ChefOrderStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === "NEW" || normalized === "PENDING") return "new";
  if (normalized === "PREPARING" || normalized === "IN_PROGRESS") return "preparing";
  return "completed";
};

const normalizeItemStatus = (status?: string): ChefOrderItemStatus => {
  const normalized = status?.toUpperCase();
  if (normalized === "READY" || normalized === "COMPLETED" || normalized === "DONE") {
    return "completed";
  }
  return "pending";
};

const getOrderItems = (order: KitchenApiOrder) => order.items ?? order.orderItems ?? [];

const toOrderSummary = (order: KitchenApiOrder): ChefOrderSummary => ({
  id: String(order.orderId ?? order.id ?? "-"),
  status: normalizeOrderStatus(order.orderStatus ?? order.status),
  items: getOrderItems(order).map((item) => ({
    name: item.menuName ?? item.name ?? "ไม่ระบุเมนู",
    qty: item.quantity ?? item.qty ?? 0,
  })),
});

const toOrderDetail = (order: KitchenApiOrder): ChefOrderDetail => ({
  id: String(order.orderId ?? order.id ?? "-"),
  status: normalizeOrderStatus(order.orderStatus ?? order.status),
  tableLabel: order.tableNumber ?? `T${String(order.tableId ?? "-")}`,
  orderTime: order.orderTime ?? order.createdAt,
  items: getOrderItems(order).map((item) => ({
    orderItemId: Number(item.orderItemId ?? item.itemId ?? 0),
    menuName: item.menuName ?? item.name ?? "ไม่ระบุเมนู",
    quantity: item.quantity ?? item.qty ?? 0,
    note: item.note,
    itemStatus: normalizeItemStatus(item.itemStatus ?? item.status),
  })),
});

export const chefService = {
  async getKitchenOrders(): Promise<ServiceResult<ChefOrderSummary[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<KitchenApiOrder[]>>(`${API_PREFIX}/kitchen/orders`);
      return {
        success: response.data.success,
        message: response.data.message,
        data: (response.data.data ?? []).map(toOrderSummary),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการครัวไม่สำเร็จ"),
      };
    }
  },

  async getKitchenOrderById(orderId: string): Promise<ServiceResult<ChefOrderDetail>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<KitchenApiOrder>>(`${API_PREFIX}/kitchen/orders/${orderId}`);
      return {
        success: response.data.success,
        message: response.data.message,
        data: toOrderDetail(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดออเดอร์ไม่สำเร็จ"),
      };
    }
  },

  async updateOrderItemStatus(orderItemId: number, itemStatus: "PREPARING" | "READY"): Promise<ServiceResult<null>> {
    try {
      const response = await axiosInstance.patch<ApiEnvelope<null>>(`${API_PREFIX}/order-items/${orderItemId}/status`, {
        itemStatus,
      });
      return {
        success: response.data.success,
        message: response.data.message,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตสถานะรายการอาหารไม่สำเร็จ"),
      };
    }
  },
};