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

export const adminService = {
  async getRoles(): Promise<RoleListResponse> {
    try {
      const response = await axiosInstance.get<RoleListResponse>(`${API_PREFIX}/roles`, {
        headers: getAdminHeaders(),
      });
      return response.data;
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
};
