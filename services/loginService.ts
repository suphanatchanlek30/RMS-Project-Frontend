import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

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
    accessToken?: string;
    roleName?: AuthRole;
    employee?: {
      role?: {
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

export const loginService = async (values: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/api/v1/auth/login", values);
    const data = response.data;

    const isSuccess = data.success === true || data.status === "success";
    const detectedRole = getRoleFromResponse(data);

    const token = getTokenFromResponse(data);
    if (token && typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
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
