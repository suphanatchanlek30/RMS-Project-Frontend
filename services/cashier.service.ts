import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

const API_PREFIX = "/api/v1";

export type TableStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED" | "UNAVAILABLE";
export type SessionStatus = "OPEN" | "CLOSED";
export type PaymentMethodName = "CASH" | "QR_PAYMENT" | "QR";

export interface CashierTableOverviewItem {
  tableId: number;
  tableNumber: string;
  tableStatus: TableStatus;
  capacity?: number;
  currentSession: {
    sessionId: number;
    startTime: string;
  } | null;
}

export interface TableDetail {
  tableId: number;
  tableNumber: string;
  capacity: number;
  tableStatus: TableStatus;
  createdAt?: string;
}

export interface TableSession {
  sessionId: number;
  tableId: number;
  tableNumber?: string;
  startTime: string;
  endTime?: string | null;
  sessionStatus: SessionStatus;
}

export interface QrSession {
  qrSessionId: number;
  sessionId: number;
  qrCodeUrl: string;
  qrToken: string;
  createdAt?: string;
  expiredAt?: string;
}

export interface OrderSummaryItem {
  orderId: number;
  orderTime: string;
  orderStatus: string;
}

export interface OrderItemDetail {
  orderItemId: number;
  menuId?: number;
  menuName: string;
  quantity: number;
  unitPrice: number;
  itemStatus: string;
}

export interface BillSummary {
  sessionId: number;
  tableId: number;
  tableNumber: string;
  items: Array<{
    orderItemId: number;
    menuName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal?: number;
  serviceCharge?: number;
  vat?: number;
  totalAmount: number;
}

export interface PaymentMethod {
  paymentMethodId: number;
  methodName: PaymentMethodName;
}

export interface CheckoutSummary {
  sessionId: number;
  tableId: number;
  tableNumber: string;
  bill: BillSummary;
  paymentMethods: PaymentMethod[];
}

export interface CashierCheckoutResult {
  paymentId: number;
  receiptId: number;
  receiptNumber: string;
  sessionId: number;
  sessionStatus: SessionStatus;
  tableId: number;
  tableStatus: TableStatus;
  changeAmount: number;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface CashierServiceResult<T> {
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

export const cashierService = {
  async getTablesOverview(): Promise<CashierServiceResult<CashierTableOverviewItem[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<CashierTableOverviewItem[]>>(`${API_PREFIX}/cashier/tables/overview`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงภาพรวมโต๊ะไม่สำเร็จ"),
      };
    }
  },

  async getTableById(tableId: number): Promise<CashierServiceResult<TableDetail>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<TableDetail>>(`${API_PREFIX}/tables/${tableId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงข้อมูลโต๊ะไม่สำเร็จ"),
      };
    }
  },

  async getCurrentSession(tableId: number): Promise<CashierServiceResult<TableSession>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<TableSession>>(`${API_PREFIX}/tables/${tableId}/current-session`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึง session ปัจจุบันไม่สำเร็จ"),
      };
    }
  },

  async openTableSession(payload: {
    tableId: number;
    employeeId: number;
  }): Promise<CashierServiceResult<TableSession>> {
    try {
      const response = await axiosInstance.post<ApiEnvelope<TableSession>>(`${API_PREFIX}/table-sessions/open`, payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "เปิดโต๊ะไม่สำเร็จ"),
      };
    }
  },

  async getOrdersBySession(sessionId: number): Promise<CashierServiceResult<OrderSummaryItem[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<OrderSummaryItem[]>>(`${API_PREFIX}/table-sessions/${sessionId}/orders`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการออเดอร์ไม่สำเร็จ"),
      };
    }
  },

  async getOrderItems(orderId: number): Promise<CashierServiceResult<OrderItemDetail[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<OrderItemDetail[]>>(`${API_PREFIX}/orders/${orderId}/items`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการอาหารไม่สำเร็จ"),
      };
    }
  },

  async createQrSession(sessionId: number): Promise<CashierServiceResult<QrSession>> {
    try {
      const response = await axiosInstance.post<ApiEnvelope<QrSession>>(`${API_PREFIX}/qr-sessions`, { sessionId });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้าง QR ไม่สำเร็จ"),
      };
    }
  },

  async getCheckoutSummary(sessionId: number): Promise<CashierServiceResult<CheckoutSummary>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<CheckoutSummary>>(`${API_PREFIX}/cashier/sessions/${sessionId}/checkout`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงข้อมูล checkout ไม่สำเร็จ"),
      };
    }
  },

  async submitCheckout(payload: {
    sessionId: number;
    paymentMethodId: number;
    receivedAmount: number;
  }): Promise<CashierServiceResult<CashierCheckoutResult>> {
    try {
      const response = await axiosInstance.post<ApiEnvelope<CashierCheckoutResult>>(`${API_PREFIX}/cashier/checkout`, payload);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ชำระเงินไม่สำเร็จ"),
      };
    }
  },
};