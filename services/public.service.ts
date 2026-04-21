import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

const API_PREFIX = "/api/v1";

export interface PublicCategoryItem {
  categoryId: number;
  categoryName: string;
  description?: string;
}

export interface PublicMenuItem {
  menuId: number;
  menuName: string;
  price: number;
  description?: string;
  menuStatus?: boolean;
  categoryId?: number;
  categoryName?: string;
  imageUrl?: string;
}

export interface CustomerMenuResponseData {
  table: {
    tableId: number;
    tableNumber: string;
  };
  categories: PublicCategoryItem[];
  menus: PublicMenuItem[];
}

export interface CustomerOrderItemPayload {
  menuId: number;
  quantity: number;
  options?: string[];
  selectedOptions?: string[];
  note?: string;
}

export interface CustomerOrderItem {
  orderItemId: number;
  menuId?: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  itemStatus: string;
}

export interface CustomerOrder {
  orderId: number;
  sessionId?: number;
  tableId?: number;
  orderTime: string;
  orderStatus: string;
  items: CustomerOrderItem[];
}

export interface CustomerOrderStatusData {
  tableId: number;
  tableNumber: string;
  orders: Array<{
    orderId: number;
    orderTime: string;
    items: CustomerOrderItem[];
  }>;
}

export interface VerifyQrData {
  qrSessionId: number;
  sessionId: number;
  tableId: number;
  tableNumber: string;
  sessionStatus: string;
  expiredAt?: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PublicServiceResult<T> {
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

export const publicService = {
  async getCategories(): Promise<PublicServiceResult<PublicCategoryItem[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<PublicCategoryItem[]>>(`${API_PREFIX}/categories`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงหมวดหมู่ไม่สำเร็จ"),
      };
    }
  },

  async verifyQrToken(qrToken: string): Promise<PublicServiceResult<VerifyQrData>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<VerifyQrData>>(`${API_PREFIX}/qr/${qrToken}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "QR ไม่สามารถใช้งานได้"),
      };
    }
  },

  async getCustomerMenus(qrToken: string): Promise<PublicServiceResult<CustomerMenuResponseData>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<CustomerMenuResponseData>>(`${API_PREFIX}/customer/menus`, {
        params: { qrToken },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงเมนูสำหรับลูกค้าไม่สำเร็จ"),
      };
    }
  },

  async createCustomerOrder(payload: {
    qrToken: string;
    items: CustomerOrderItemPayload[];
  }): Promise<PublicServiceResult<CustomerOrder>> {
    try {
      const response = await axiosInstance.post<ApiEnvelope<CustomerOrder>>(`${API_PREFIX}/customer/orders`, payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้างคำสั่งซื้อไม่สำเร็จ"),
      };
    }
  },

  async getCustomerOrders(qrToken: string): Promise<PublicServiceResult<CustomerOrder[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<CustomerOrder[]>>(`${API_PREFIX}/customer/orders`, {
        params: { qrToken },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงคำสั่งซื้อของลูกค้าไม่สำเร็จ"),
      };
    }
  },

  async getCustomerOrderStatus(qrToken: string): Promise<PublicServiceResult<CustomerOrderStatusData>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<CustomerOrderStatusData>>(`${API_PREFIX}/customer/order-status`, {
        params: { qrToken },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงสถานะออเดอร์ไม่สำเร็จ"),
      };
    }
  },
};