import axios, { type InternalAxiosRequestConfig } from "axios";

const TOKEN_KEY = "token";
const ADMIN_TOKEN_KEY = "adminToken";
const CASHIER_TOKEN_KEY = "cashierToken";
const CHEF_TOKEN_KEY = "chefToken";
const API_BASE_URL = process.env.NEXT_PUBLIC_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const LOGIN_PATH = process.env.NEXT_PUBLIC_LOGIN_PATH ?? "/auth";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthorizationHeader = (config: InternalAxiosRequestConfig, token: string) => {
  const headers = config.headers as
    | (Record<string, string> & { set?: (headerName: string, value: string) => void })
    | undefined;

  if (!headers) return;

  if (typeof headers.set === "function") {
    headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  headers.Authorization = `Bearer ${token}`;
};

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") return config;

    const token =
      localStorage.getItem(TOKEN_KEY) ||
      localStorage.getItem(ADMIN_TOKEN_KEY) ||
      localStorage.getItem(CASHIER_TOKEN_KEY) ||
      localStorage.getItem(CHEF_TOKEN_KEY);
    if (token) {
      setAuthorizationHeader(config, token);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(CASHIER_TOKEN_KEY);
      localStorage.removeItem(CHEF_TOKEN_KEY);
      localStorage.removeItem("activeRole");
      if (window.location.pathname !== LOGIN_PATH) {
        window.location.href = LOGIN_PATH;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;