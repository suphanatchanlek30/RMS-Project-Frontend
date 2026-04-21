export type StoredAuthRole = "ADMIN" | "CASHIER" | "CHEF";

export interface StoredEmployeeProfile {
  employeeId: number;
  employeeName: string;
  roleId?: number;
  roleName?: StoredAuthRole;
}

const EMPLOYEE_PROFILE_KEY = "employeeProfile";
const AUTH_KEYS = ["token", "adminToken", "cashierToken", "chefToken", "activeRole", EMPLOYEE_PROFILE_KEY];

export const authSession = {
  getEmployeeProfile(): StoredEmployeeProfile | null {
    if (typeof window === "undefined") return null;

    const rawValue = localStorage.getItem(EMPLOYEE_PROFILE_KEY);
    if (!rawValue) return null;

    try {
      return JSON.parse(rawValue) as StoredEmployeeProfile;
    } catch {
      localStorage.removeItem(EMPLOYEE_PROFILE_KEY);
      return null;
    }
  },

  setEmployeeProfile(profile: StoredEmployeeProfile) {
    if (typeof window === "undefined") return;
    localStorage.setItem(EMPLOYEE_PROFILE_KEY, JSON.stringify(profile));
  },

  clearEmployeeProfile() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(EMPLOYEE_PROFILE_KEY);
  },

  clearClientAuthState() {
    if (typeof window === "undefined") return;
    AUTH_KEYS.forEach((key) => localStorage.removeItem(key));
  },
};