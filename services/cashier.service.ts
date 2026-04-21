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
  receiptId?: number;
  receiptNumber?: string;
  sessionId: number;
  sessionStatus: SessionStatus;
  tableId: number;
  tableStatus: TableStatus;
  changeAmount: number;
  totalAmount?: number;
  receivedAmount?: number;
}

export interface SessionCloseResult {
  sessionId: number;
  sessionStatus: SessionStatus;
  tableId: number;
  tableStatus: TableStatus;
  endTime?: string | null;
}

export interface PaymentDetail {
  paymentId: number;
  sessionId: number;
  paymentMethodId: number;
  paymentMethodName?: string;
  /** Total bill amount (API field: totalAmount) */
  totalAmount: number;
  /** Amount received from customer */
  receivedAmount: number;
  /** Change returned to customer */
  changeAmount: number;
  paymentTime?: string;
  paymentStatus?: string;
  /** Alias for paidAmount (same as totalAmount) */
  paidAmount?: number;
}

export interface ReceiptDetail {
  receiptId: number;
  receiptNumber: string;
  issueDate?: string;
  issuedAt?: string;
  totalAmount: number;
  payment?: {
    paymentId: number;
    paymentMethodName?: string;
    paymentTime?: string;
  };
  table?: {
    tableId: number;
    tableNumber: string;
  };
  /** Alias kept for old components */
  paymentId?: number;
  sessionId?: number;
  tableNumber?: string;
  items?: Array<{
    orderItemId?: number;
    menuName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
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

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
};

const normalizeQrSession = (rawValue: unknown, fallbackSessionId: number): QrSession | null => {
  const raw = asRecord(rawValue);
  if (!raw) return null;

  const qrToken =
    typeof raw.qrToken === "string"
      ? raw.qrToken
      : typeof raw.token === "string"
        ? raw.token
        : typeof raw.qr_session_token === "string"
          ? raw.qr_session_token
          : "";

  const resolvedSessionId = Number(raw.sessionId ?? raw.tableSessionId ?? fallbackSessionId);
  if (!qrToken || Number.isNaN(resolvedSessionId)) return null;

  const qrCodeUrlRaw =
    typeof raw.qrCodeUrl === "string"
      ? raw.qrCodeUrl
      : typeof raw.qrCode === "string"
        ? raw.qrCode
        : typeof raw.qrUrl === "string"
          ? raw.qrUrl
          : typeof raw.url === "string"
            ? raw.url
            : "";

  return {
    qrSessionId: Number(raw.qrSessionId ?? raw.id ?? 0),
    sessionId: resolvedSessionId,
    qrToken,
    qrCodeUrl: qrCodeUrlRaw,
    createdAt: typeof raw.createdAt === "string" ? raw.createdAt : undefined,
    expiredAt:
      typeof raw.expiredAt === "string"
        ? raw.expiredAt
        : typeof raw.expiresAt === "string"
          ? raw.expiresAt
          : undefined,
  };
};

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

  async getSessionById(sessionId: number): Promise<CashierServiceResult<TableSession>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<TableSession>>(`${API_PREFIX}/table-sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียด session ไม่สำเร็จ"),
      };
    }
  },

  async closeSession(payload: {
    sessionId: number;
    employeeId?: number;
  }): Promise<CashierServiceResult<SessionCloseResult>> {
    try {
      const response = await axiosInstance.patch<ApiEnvelope<SessionCloseResult>>(
        `${API_PREFIX}/table-sessions/${payload.sessionId}/close`,
        payload.employeeId ? { employeeId: payload.employeeId } : {}
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ปิด session ไม่สำเร็จ"),
      };
    }
  },

  async getPaymentById(paymentId: number): Promise<CashierServiceResult<PaymentDetail>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<PaymentDetail>>(`${API_PREFIX}/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดการชำระเงินไม่สำเร็จ"),
      };
    }
  },

  async getReceiptById(receiptId: number): Promise<CashierServiceResult<ReceiptDetail>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<ReceiptDetail>>(`${API_PREFIX}/receipts/${receiptId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดใบเสร็จไม่สำเร็จ"),
      };
    }
  },

  /** GET /api/v1/payments/:paymentId/receipt — preferred endpoint for receipt after checkout */
  async getReceiptByPaymentId(paymentId: number): Promise<CashierServiceResult<ReceiptDetail>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<ReceiptDetail>>(
        `${API_PREFIX}/payments/${paymentId}/receipt`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงใบเสร็จไม่สำเร็จ"),
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
      const response = await axiosInstance.post<unknown>(`${API_PREFIX}/qr-sessions`, {
        sessionId,
        tableSessionId: sessionId,
      });

      const payload = asRecord(response.data);
      const message = typeof payload?.message === "string" ? payload.message : "สร้าง QR สำเร็จ";
      const success = typeof payload?.success === "boolean" ? payload.success : true;

      const normalized = normalizeQrSession(
        payload?.data ?? payload?.qrSession ?? payload?.result ?? payload,
        sessionId
      );

      if (normalized) {
        return {
          success: true,
          message,
          data: normalized,
        };
      }

      return {
        success,
        message: success ? "ไม่พบข้อมูล QR session ใน response" : message,
      };
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
      const response = await axiosInstance.post<unknown>(
        `${API_PREFIX}/payments`,
        {
          sessionId: payload.sessionId,
          paymentMethodId: payload.paymentMethodId,
          receivedAmount: payload.receivedAmount,
        }
      );

      // Normalize: API may nest data under .data or return flat
      const raw = response.data as Record<string, unknown>;
      const data = (raw?.data ?? raw) as Record<string, unknown>;

      // Receipt may be nested under .receipt or flat
      const receipt = (data?.receipt as Record<string, unknown>) ?? {};

      const result: CashierCheckoutResult = {
        paymentId: Number(data?.paymentId ?? 0),
        receiptId: Number(data?.receiptId ?? receipt?.receiptId ?? 0) || undefined,
        receiptNumber: (data?.receiptNumber ?? receipt?.receiptNumber) as string | undefined,
        sessionId: Number(data?.sessionId ?? payload.sessionId),
        sessionStatus: (data?.sessionStatus as SessionStatus) ?? "CLOSED",
        tableId: Number(data?.tableId ?? 0),
        tableStatus: (data?.tableStatus as TableStatus) ?? "AVAILABLE",
        changeAmount: Number(data?.changeAmount ?? 0),
        totalAmount: Number(data?.totalAmount ?? data?.amount ?? 0) || undefined,
        receivedAmount: Number(data?.receivedAmount ?? payload.receivedAmount),
      };

      const success = typeof raw?.success === "boolean" ? raw.success : true;
      const message = typeof raw?.message === "string" ? raw.message : "ชำระเงินสำเร็จ";

      if (!success) {
        return { success: false, message };
      }

      // Fetch receipt via correct endpoint: GET /payments/:id/receipt
      if (result.paymentId) {
        try {
          const rcptRes = await axiosInstance.get<ApiEnvelope<ReceiptDetail>>(
            `${API_PREFIX}/payments/${result.paymentId}/receipt`
          );
          const rcpt = rcptRes.data?.data;
          if (rcpt?.receiptId) {
            result.receiptId = rcpt.receiptId;
            result.receiptNumber = rcpt.receiptNumber;
          }
        } catch {
          // best effort — payment success page falls back to payment data
        }
      }

      return { success: true, message, data: result };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ชำระเงินไม่สำเร็จ"),
      };
    }
  },

  async getBillSummary(sessionId: number): Promise<CashierServiceResult<BillSummary>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<BillSummary>>(
        `${API_PREFIX}/cashier/sessions/${sessionId}/bill`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงสรุปบิลไม่สำเร็จ"),
      };
    }
  },

  async getPaymentMethods(): Promise<CashierServiceResult<PaymentMethod[]>> {
    try {
      const response = await axiosInstance.get<ApiEnvelope<PaymentMethod[]>>(
        `${API_PREFIX}/payment-methods`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงวิธีการชำระเงินไม่สำเร็จ"),
      };
    }
  },
};
