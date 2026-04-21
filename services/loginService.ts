import { isAxiosError } from "axios";
import axiosInstance from "./axiosInstance";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message?: string;
  token?: string;
  accessToken?: string;
  [key: string]: unknown;
}

const TOKEN_KEY = "token";

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
  if (typeof data.token === "string" && data.token.trim() !== "") {
    return data.token;
  }

  if (typeof data.accessToken === "string" && data.accessToken.trim() !== "") {
    return data.accessToken;
  }

  return undefined;
};

export const loginService = async (values: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", values);
    const data = response.data;

    const token = getTokenFromResponse(data);
    if (token && typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }

    return data;
  } catch (error) {
    return {
      status: "fail",
      message: getLoginErrorMessage(error),
    };
  }
};
