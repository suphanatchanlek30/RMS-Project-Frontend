import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

const API_PREFIX = "/api/v1";

// ─── Public types ────────────────────────────────────────────────────────────

/** Status derived from item-level statuses */
export type ChefOrderStatus = "new" | "preparing" | "completed";
export type ChefItemStatus = "WAITING" | "PREPARING" | "COMPLETED" | "CANCELLED";
export type ChefItemStatusUpdate = "PREPARING" | "COMPLETED";

export interface ChefOrderCardItem {
  name: string;
  qty: number;
  itemStatus: ChefItemStatus;
}

export interface ChefOrderItemDetail {
  orderItemId: number;
  menuName: string;
  quantity: number;
  note?: string;
  itemStatus: ChefItemStatus;
}

export interface ChefOrderSummary {
  id: string;
  tableId: number;
  tableNumber: string;
  orderTime?: string;
  /** Derived: new = any WAITING, preparing = any PREPARING, completed = all COMPLETED */
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

export interface StatusHistoryEntry {
  statusHistoryId: number;
  status: ChefItemStatus;
  updatedByChefId: number | null;
  updatedTime: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface KitchenApiItem {
  orderItemId?: number;
  menuName?: string;
  quantity?: number;
  note?: string;
  itemStatus?: string;
}

interface KitchenApiOrder {
  orderId?: number | string;
  tableNumber?: string;
  tableId?: number | string;
  orderStatus?: string;
  orderTime?: string;
  items?: KitchenApiItem[];
}

interface ApiOrderDetail {
  orderId?: number | string;
  sessionId?: number;
  tableId?: number | string;
  orderTime?: string;
  orderStatus?: string;
}

interface ServiceResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!isAxiosError(error)) return fallback;
  const msg = error.response?.data?.message;
  return typeof msg === "string" && msg.trim() ? msg : fallback;
};

const normalizeItemStatus = (raw?: string): ChefItemStatus => {
  const upper = raw?.toUpperCase() ?? "";
  if (upper === "PREPARING") return "PREPARING";
  if (upper === "COMPLETED" || upper === "DONE" || upper === "READY") return "COMPLETED";
  if (upper === "CANCELLED") return "CANCELLED";
  return "WAITING";
};

/** Derive order-level status from item statuses */
const deriveOrderStatus = (items: ChefOrderCardItem[]): ChefOrderStatus => {
  if (!items.length) return "new";
  const active = items.filter((i) => i.itemStatus !== "CANCELLED");
  if (!active.length) return "completed";
  if (active.every((i) => i.itemStatus === "COMPLETED")) return "completed";
  if (active.some((i) => i.itemStatus === "PREPARING")) return "preparing";
  return "new";
};

const toOrderSummary = (order: KitchenApiOrder): ChefOrderSummary => {
  const rawItems = order.items ?? [];
  const mappedItems: ChefOrderCardItem[] = rawItems.map((item) => ({
    name: item.menuName ?? "ไม่ระบุเมนู",
    qty: item.quantity ?? 0,
    itemStatus: normalizeItemStatus(item.itemStatus),
  }));

  return {
    id: String(order.orderId ?? "-"),
    tableId: Number(order.tableId ?? 0),
    tableNumber: order.tableNumber ?? `T${String(order.tableId ?? "-")}`,
    orderTime: order.orderTime,
    status: deriveOrderStatus(mappedItems),
    items: mappedItems,
  };
};

// ─── Service ─────────────────────────────────────────────────────────────────

export const chefService = {
  /**
   * GET /api/v1/kitchen/orders
   * Returns orders with WAITING and PREPARING items (default).
   */
  async getKitchenOrders(
    params?: { status?: string; tableId?: number; page?: number; limit?: number }
  ): Promise<ServiceResult<ChefOrderSummary[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<KitchenApiOrder[]>>(
        `${API_PREFIX}/kitchen/orders`,
        { params }
      );
      const orders = (response.data.data ?? []).map(toOrderSummary);
      return { success: true, message: response.data.message, data: orders };
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "ดึงรายการครัวไม่สำเร็จ") };
    }
  },

  /**
   * Composite: GET /api/v1/orders/:orderId + GET /api/v1/orders/:orderId/items
   * The kitchen API has no single-order endpoint, so we fetch both separately.
   */
  async getKitchenOrderById(orderId: string): Promise<ServiceResult<ChefOrderDetail>> {
    try {
      const [orderRes, itemsRes] = await Promise.all([
        axiosInstance.get<ApiEnvelope<ApiOrderDetail>>(`${API_PREFIX}/orders/${orderId}`),
        axiosInstance.get<ApiEnvelope<KitchenApiItem[]>>(`${API_PREFIX}/orders/${orderId}/items`),
      ]);

      const orderData = orderRes.data.data ?? {};
      const rawItems: KitchenApiItem[] = Array.isArray(itemsRes.data.data)
        ? itemsRes.data.data
        : [];

      const items: ChefOrderItemDetail[] = rawItems.map((item) => ({
        orderItemId: item.orderItemId ?? 0,
        menuName: item.menuName ?? "ไม่ระบุเมนู",
        quantity: item.quantity ?? 0,
        note: item.note,
        itemStatus: normalizeItemStatus(item.itemStatus),
      }));

      const cardItems: ChefOrderCardItem[] = items.map((i) => ({
        name: i.menuName,
        qty: i.quantity,
        itemStatus: i.itemStatus,
      }));

      const detail: ChefOrderDetail = {
        id: String(orderData.orderId ?? orderId),
        tableLabel: `Table ${String(orderData.tableId ?? "-")}`,
        orderTime: orderData.orderTime,
        status: deriveOrderStatus(cardItems),
        items,
      };

      return { success: true, message: "สำเร็จ", data: detail };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดออเดอร์ไม่สำเร็จ"),
      };
    }
  },

  /**
   * PATCH /api/v1/order-items/:orderItemId/status
   * Advances an item's status: WAITING → PREPARING → COMPLETED
   */
  async updateOrderItemStatus(
    orderItemId: number,
    status: ChefItemStatusUpdate
  ): Promise<ServiceResult<void>> {
    try {
      await axiosInstance.patch(`${API_PREFIX}/order-items/${orderItemId}/status`, { status });
      return { success: true, message: "อัปเดตสถานะสำเร็จ" };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตสถานะไม่สำเร็จ"),
      };
    }
  },

  /**
   * Returns the next valid status for a given item status, or null if terminal.
   * WAITING → PREPARING → COMPLETED (no further advance)
   */
  getNextStatus(current: ChefItemStatus): ChefItemStatusUpdate | null {
    if (current === "WAITING") return "PREPARING";
    if (current === "PREPARING") return "COMPLETED";
    return null;
  },

  /**
   * GET /api/v1/kitchen/order-items/:orderItemId/status-history
   */
  async getItemStatusHistory(orderItemId: number): Promise<ServiceResult<StatusHistoryEntry[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<StatusHistoryEntry[]>>(
        `${API_PREFIX}/kitchen/order-items/${orderItemId}/status-history`
      );
      return { success: true, message: "สำเร็จ", data: response.data.data ?? [] };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงประวัติสถานะไม่สำเร็จ"),
      };
    }
  },
};
