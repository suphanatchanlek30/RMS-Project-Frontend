import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import type { AuthRole } from "./loginService";

const API_PREFIX = "/api/v1";
const ADMIN_TOKEN_KEY = "adminToken";

export interface RoleItem {
  roleId: number;
  roleName: AuthRole;
}

export interface EmployeeItem {
  employeeId: number;
  employeeName: string;
  roleId: number;
  roleName: AuthRole;
  phoneNumber: string;
  email: string;
  hireDate?: string;
  employeeStatus: boolean;
}

export interface EmployeePagination {
  page: number;
  limit: number;
  total: number;
}

export interface EmployeeListResponse {
  success: boolean;
  message: string;
  data: {
    items: EmployeeItem[];
    pagination: EmployeePagination;
  };
}

export interface RoleListResponse {
  success: boolean;
  message: string;
  data: RoleItem[];
}

export interface EmployeeDetailResponse {
  success: boolean;
  message: string;
  data?: EmployeeItem;
}

export interface CreateEmployeePayload {
  employeeName: string;
  roleId: number;
  phoneNumber: string;
  email: string;
  hireDate: string;
  password: string;
}

export interface UpdateEmployeePayload {
  employeeName?: string;
  phoneNumber?: string;
  roleId?: number;
}

export interface UpdateEmployeeStatusPayload {
  employeeStatus: boolean;
}

export interface EmployeeQueryParams {
  roleId?: number;
  status?: "active" | "inactive";
  search?: string;
  page?: number;
  limit?: number;
}

export interface ApiBasicResponse {
  success: boolean;
  message: string;
}

export interface DashboardSummary {
  todaySales: number;
  todayOrders: number;
  occupiedTables: number;
  availableTables: number;
  topMenu?: {
    menuId: number;
    menuName: string;
    totalSold: number;
  };
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data?: DashboardSummary;
}

export interface AdminTableItem {
  tableId: number;
  tableNumber: string;
  capacity: number;
  tableStatus: string;
}

export interface CreateTablePayload {
  tableNumber: string;
  capacity: number;
  tableStatus?: string;
}

export interface UpdateTablePayload {
  tableNumber?: string;
  capacity?: number;
  tableStatus?: string;
}

export interface CategoryItem {
  categoryId: number;
  categoryName: string;
  description?: string;
  categoryStatus?: boolean;
}

export interface CreateCategoryPayload {
  categoryName: string;
  description?: string;
  categoryStatus?: boolean;
}

export interface UpdateCategoryPayload {
  categoryName?: string;
  description?: string;
  categoryStatus?: boolean;
}

export interface MenuItem {
  menuId: number;
  menuName: string;
  price: number;
  categoryId: number;
  categoryName?: string;
  menuStatus?: boolean;
  description?: string;
  imageUrl?: string;
}

export interface CreateMenuPayload {
  menuName: string;
  price: number;
  categoryId: number;
  description?: string;
  imageUrl?: string;
  menuStatus?: boolean;
}

export interface UpdateMenuPayload {
  menuName?: string;
  price?: number;
  categoryId?: number;
  description?: string;
  imageUrl?: string;
  menuStatus?: boolean;
}

export interface SalesReportItem {
  date: string;
  totalSales: number;
  totalOrders: number;
}

export interface TopMenuReportItem {
  menuId: number;
  menuName: string;
  totalQuantity: number;
  totalAmount: number;
  /** Alias for backward compat */
  totalSold?: number;
}

export type ReportGroupBy = "day" | "month";

export interface PaymentItem {
  paymentId: number;
  sessionId: number;
  paymentMethodName?: string;
  /** Total amount charged (API field: totalAmount) */
  totalAmount: number;
  paymentStatus?: string;
  paymentTime?: string;
  createdAt?: string;
  /** Alias kept for backward compat */
  paidAmount?: number;
}

export interface ReceiptItem {
  receiptId: number;
  receiptNumber: string;
  paymentId: number;
  sessionId: number;
  totalAmount: number;
  issuedAt?: string;
}

export interface AdminListResponse<T> {
  success: boolean;
  message: string;
  data: T[];
}

export interface AdminDetailResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

const getAdminToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

const getAdminHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (!isAxiosError(error)) return fallbackMessage;

  const apiMessage = error.response?.data?.message;
  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage;
  }

  return fallbackMessage;
};

const normalizeEmployeeStatus = (status?: "active" | "inactive") => {
  if (status === "active") return true;
  if (status === "inactive") return false;
  return undefined;
};

const toList = <T>(data: unknown): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (data && typeof data === "object") {
    const maybeItems = (data as { items?: unknown }).items;
    if (Array.isArray(maybeItems)) return maybeItems as T[];

    const maybeRows = (data as { rows?: unknown }).rows;
    if (Array.isArray(maybeRows)) return maybeRows as T[];

    const maybeResults = (data as { results?: unknown }).results;
    if (Array.isArray(maybeResults)) return maybeResults as T[];
  }

  return [];
};

export const adminService = {
  async getRoles(): Promise<RoleListResponse> {
    try {
      const response = await axiosInstance.get<RoleListResponse>(`${API_PREFIX}/roles`, {
        headers: getAdminHeaders(),
      });
      return {
        ...response.data,
        data: toList<RoleItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการ role ไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async createEmployee(payload: CreateEmployeePayload): Promise<EmployeeDetailResponse> {
    try {
      const response = await axiosInstance.post<EmployeeDetailResponse>(`${API_PREFIX}/employees`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้างพนักงานไม่สำเร็จ"),
      };
    }
  },

  async getEmployees(params: EmployeeQueryParams = {}): Promise<EmployeeListResponse> {
    try {
      const response = await axiosInstance.get<EmployeeListResponse>(`${API_PREFIX}/employees`, {
        headers: getAdminHeaders(),
        params: {
          roleId: params.roleId,
          status: normalizeEmployeeStatus(params.status),
          search: params.search,
          page: params.page ?? 1,
          limit: params.limit ?? 10,
        },
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการพนักงานไม่สำเร็จ"),
        data: {
          items: [],
          pagination: {
            page: params.page ?? 1,
            limit: params.limit ?? 10,
            total: 0,
          },
        },
      };
    }
  },

  async getEmployeeById(employeeId: number): Promise<EmployeeDetailResponse> {
    try {
      const response = await axiosInstance.get<EmployeeDetailResponse>(`${API_PREFIX}/employees/${employeeId}`, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงข้อมูลพนักงานไม่สำเร็จ"),
      };
    }
  },

  async updateEmployeeById(employeeId: number, payload: UpdateEmployeePayload): Promise<EmployeeDetailResponse> {
    try {
      const response = await axiosInstance.patch<EmployeeDetailResponse>(
        `${API_PREFIX}/employees/${employeeId}`,
        payload,
        {
          headers: getAdminHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตข้อมูลพนักงานไม่สำเร็จ"),
      };
    }
  },

  async updateEmployeeStatusById(
    employeeId: number,
    payload: UpdateEmployeeStatusPayload
  ): Promise<EmployeeDetailResponse> {
    try {
      const response = await axiosInstance.patch<EmployeeDetailResponse>(
        `${API_PREFIX}/employees/${employeeId}/status`,
        payload,
        {
          headers: getAdminHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตสถานะพนักงานไม่สำเร็จ"),
      };
    }
  },

  async logout(): Promise<ApiBasicResponse> {
    try {
      const response = await axiosInstance.post<ApiBasicResponse>(
        `${API_PREFIX}/auth/logout`,
        {},
        {
          headers: getAdminHeaders(),
        }
      );

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("activeRole");
      }

      return response.data;
    } catch (error) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("activeRole");
      }

      return {
        success: false,
        message: getErrorMessage(error, "ออกจากระบบไม่สำเร็จ"),
      };
    }
  },

  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    try {
      const response = await axiosInstance.get<DashboardSummaryResponse>(`${API_PREFIX}/dashboard/summary`, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงข้อมูล dashboard summary ไม่สำเร็จ"),
      };
    }
  },

  async getTables(): Promise<AdminListResponse<AdminTableItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<AdminTableItem>>(`${API_PREFIX}/tables`, {
        headers: getAdminHeaders(),
      });
      return {
        ...response.data,
        data: toList<AdminTableItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการโต๊ะไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async createTable(payload: CreateTablePayload): Promise<AdminDetailResponse<AdminTableItem>> {
    try {
      const response = await axiosInstance.post<AdminDetailResponse<AdminTableItem>>(`${API_PREFIX}/tables`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้างโต๊ะไม่สำเร็จ"),
      };
    }
  },

  async updateTableById(tableId: number, payload: UpdateTablePayload): Promise<AdminDetailResponse<AdminTableItem>> {
    try {
      const response = await axiosInstance.patch<AdminDetailResponse<AdminTableItem>>(`${API_PREFIX}/tables/${tableId}`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตโต๊ะไม่สำเร็จ"),
      };
    }
  },

  async getCategories(): Promise<AdminListResponse<CategoryItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<CategoryItem>>(`${API_PREFIX}/categories`, {
        headers: getAdminHeaders(),
      });
      return {
        ...response.data,
        data: toList<CategoryItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงหมวดหมู่ไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async createCategory(payload: CreateCategoryPayload): Promise<AdminDetailResponse<CategoryItem>> {
    try {
      const response = await axiosInstance.post<AdminDetailResponse<CategoryItem>>(`${API_PREFIX}/categories`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้างหมวดหมู่ไม่สำเร็จ"),
      };
    }
  },

  async updateCategoryById(categoryId: number, payload: UpdateCategoryPayload): Promise<AdminDetailResponse<CategoryItem>> {
    try {
      const response = await axiosInstance.patch<AdminDetailResponse<CategoryItem>>(`${API_PREFIX}/categories/${categoryId}`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตหมวดหมู่ไม่สำเร็จ"),
      };
    }
  },

  async getMenus(params?: {
    categoryId?: number;
    keyword?: string;
    status?: boolean;
    page?: number;
    limit?: number;
  }): Promise<AdminListResponse<MenuItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<MenuItem>>(`${API_PREFIX}/menus`, {
        headers: getAdminHeaders(),
        params: {
          categoryId: params?.categoryId,
          keyword: params?.keyword,
          status: params?.status,
          page: params?.page ?? 1,
          limit: params?.limit ?? 50,
        },
      });
      return {
        ...response.data,
        data: toList<MenuItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงเมนูไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async createMenu(payload: CreateMenuPayload): Promise<AdminDetailResponse<MenuItem>> {
    try {
      const response = await axiosInstance.post<AdminDetailResponse<MenuItem>>(`${API_PREFIX}/menus`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "สร้างเมนูไม่สำเร็จ"),
      };
    }
  },

  async updateMenuById(menuId: number, payload: UpdateMenuPayload): Promise<AdminDetailResponse<MenuItem>> {
    try {
      const response = await axiosInstance.patch<AdminDetailResponse<MenuItem>>(`${API_PREFIX}/menus/${menuId}`, payload, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตเมนูไม่สำเร็จ"),
      };
    }
  },

  async getSalesReport(params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: ReportGroupBy;
  }): Promise<AdminListResponse<SalesReportItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<SalesReportItem>>(
        `${API_PREFIX}/reports/sales`,
        {
          headers: getAdminHeaders(),
          params: {
            dateFrom: params?.dateFrom,
            dateTo: params?.dateTo,
            groupBy: params?.groupBy ?? "day",
          },
        }
      );
      return {
        ...response.data,
        data: toList<SalesReportItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายงานยอดขายไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async getTopMenusReport(params?: {
    dateFrom?: string;
    dateTo?: string;
    limit?: number;
  }): Promise<AdminListResponse<TopMenuReportItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<TopMenuReportItem>>(
        `${API_PREFIX}/reports/top-menus`,
        {
          headers: getAdminHeaders(),
          params: {
            dateFrom: params?.dateFrom,
            dateTo: params?.dateTo,
            limit: params?.limit ?? 10,
          },
        }
      );
      // Normalize: add totalSold alias from totalQuantity
      const items = toList<TopMenuReportItem>(response.data.data).map((item) => ({
        ...item,
        totalSold: item.totalQuantity ?? item.totalSold ?? 0,
      }));
      return { ...response.data, data: items };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายงานเมนูขายดีไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async updateMenuStatus(menuId: number, menuStatus: boolean): Promise<AdminDetailResponse<{ menuId: number; menuStatus: boolean }>> {
    try {
      const response = await axiosInstance.patch<AdminDetailResponse<{ menuId: number; menuStatus: boolean }>>(
        `${API_PREFIX}/menus/${menuId}/status`,
        { menuStatus },
        { headers: getAdminHeaders() }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "อัปเดตสถานะเมนูไม่สำเร็จ"),
      };
    }
  },

  async getPayments(params?: { page?: number; limit?: number }): Promise<AdminListResponse<PaymentItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<PaymentItem>>(`${API_PREFIX}/payments`, {
        headers: getAdminHeaders(),
        params,
      });
      return {
        ...response.data,
        data: toList<PaymentItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการการชำระเงินไม่สำเร็จ"),
        data: [],
      };
    }
  },

  async getPaymentById(paymentId: number): Promise<AdminDetailResponse<PaymentItem>> {
    try {
      const response = await axiosInstance.get<AdminDetailResponse<PaymentItem>>(`${API_PREFIX}/payments/${paymentId}`, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดการชำระเงินไม่สำเร็จ"),
      };
    }
  },

  async getReceiptById(receiptId: number): Promise<AdminDetailResponse<ReceiptItem>> {
    try {
      const response = await axiosInstance.get<AdminDetailResponse<ReceiptItem>>(`${API_PREFIX}/receipts/${receiptId}`, {
        headers: getAdminHeaders(),
      });
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายละเอียดใบเสร็จไม่สำเร็จ"),
      };
    }
  },

  /** GET /api/v1/payments/:paymentId/receipt — preferred receipt lookup */
  async getReceiptByPaymentId(paymentId: number): Promise<AdminDetailResponse<ReceiptItem>> {
    try {
      const response = await axiosInstance.get<AdminDetailResponse<ReceiptItem>>(
        `${API_PREFIX}/payments/${paymentId}/receipt`,
        { headers: getAdminHeaders() }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงใบเสร็จไม่สำเร็จ"),
      };
    }
  },

  async getReceipts(params?: { page?: number; limit?: number }): Promise<AdminListResponse<ReceiptItem>> {
    try {
      const response = await axiosInstance.get<AdminListResponse<ReceiptItem>>(`${API_PREFIX}/receipts`, {
        headers: getAdminHeaders(),
        params,
      });
      return {
        ...response.data,
        data: toList<ReceiptItem>(response.data.data),
      };
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "ดึงรายการใบเสร็จไม่สำเร็จ"),
        data: [],
      };
    }
  },
};
