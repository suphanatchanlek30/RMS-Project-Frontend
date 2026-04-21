import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import { authSession } from "./authSession";

export type AuthRole = "ADMIN" | "CASHIER" | "CHEF";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  success?: boolean;
  message?: string;
  token?: string;
  accessToken?: string;
  detectedRole?: AuthRole;
  data?: {
    employeeId?: number;
    employeeName?: string;
    roleId?: number;
    accessToken?: string;
    roleName?: AuthRole;
    employee?: {
      employeeId?: number;
      employeeName?: string;
      role?: {
        roleId?: number;
        roleName?: AuthRole;
      };
    };
  };
  [key: string]: unknown;
}

const TOKEN_KEY = "token";
const ADMIN_TOKEN_KEY = "adminToken";
const CASHIER_TOKEN_KEY = "cashierToken";
const CHEF_TOKEN_KEY = "chefToken";

const getLoginErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim() !== "") {
      return apiMessage;
    }
  }

  return "เข้าสู่ระบบล้มเหลว";
};

const getTokenFromResponse = (data: LoginResponse): string | undefined => {
  const nestedToken = data.data?.accessToken;
  if (typeof nestedToken === "string" && nestedToken.trim() !== "") {
    return nestedToken;
  }

  if (typeof data.token === "string" && data.token.trim() !== "") {
    return data.token;
  }

  if (typeof data.accessToken === "string" && data.accessToken.trim() !== "") {
    return data.accessToken;
  }

  return undefined;
};

const getRoleFromResponse = (data: LoginResponse): AuthRole | undefined => {
  const roleName = data.data?.roleName ?? data.data?.employee?.role?.roleName;
  if (roleName === "ADMIN" || roleName === "CASHIER" || roleName === "CHEF") {
    return roleName;
  }

  return undefined;
};

const getEmployeeProfileFromResponse = (data: LoginResponse) => {
  const employeeId = data.data?.employeeId ?? data.data?.employee?.employeeId;
  const employeeName = data.data?.employeeName ?? data.data?.employee?.employeeName;
  const roleId = data.data?.roleId ?? data.data?.employee?.role?.roleId;
  const roleName = getRoleFromResponse(data);

  if (typeof employeeId !== "number" || typeof employeeName !== "string" || employeeName.trim() === "") {
    return null;
  }

  return {
    employeeId,
    employeeName,
    roleId,
    roleName,
  };
};

export const loginService = async (values: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/api/v1/auth/login", values);
    const data = response.data;

    const isSuccess = data.success === true || data.status === "success";
    const detectedRole = getRoleFromResponse(data);
    const employeeProfile = getEmployeeProfileFromResponse(data);

    const token = getTokenFromResponse(data);
    if (token && typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
      if (employeeProfile) {
        authSession.setEmployeeProfile(employeeProfile);
      }
      if (detectedRole) {
        localStorage.setItem("activeRole", detectedRole);

        if (detectedRole === "ADMIN") localStorage.setItem(ADMIN_TOKEN_KEY, token);
        if (detectedRole === "CASHIER") localStorage.setItem(CASHIER_TOKEN_KEY, token);
        if (detectedRole === "CHEF") localStorage.setItem(CHEF_TOKEN_KEY, token);
      }
    }

    return {
      ...data,
      status: isSuccess ? "success" : data.status ?? "fail",
      success: isSuccess,
      detectedRole,
    };
  } catch (error) {
    return {
      status: "fail",
      success: false,
      message: getLoginErrorMessage(error),
    };
  }
};
