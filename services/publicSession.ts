export interface VerifiedQrSession {
  qrSessionId: number;
  sessionId: number;
  tableId: number;
  tableNumber: string;
  sessionStatus: string;
  expiredAt?: string;
}

export interface StoredPublicMenuItem {
  id: string;
  menuId?: number;
  name: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  categoryName?: string;
  description?: string;
}

export interface StoredPublicCategory {
  id: string;
  label: string;
  categoryId?: number;
  description?: string;
}

export interface StoredMenuBundle {
  tableNumber: string;
  categories: StoredPublicCategory[];
  items: StoredPublicMenuItem[];
}

const QR_TOKEN_KEY = "publicQrToken";
const QR_SESSION_KEY = "publicQrSession";
const MENU_BUNDLE_KEY = "publicMenuBundle";

const readJson = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  const rawValue = localStorage.getItem(key);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

export const publicSession = {
  getQrToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(QR_TOKEN_KEY);
  },

  setQrToken(token: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(QR_TOKEN_KEY, token);
  },

  clearQrToken() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(QR_TOKEN_KEY);
  },

  getVerifiedQrSession(): VerifiedQrSession | null {
    return readJson<VerifiedQrSession>(QR_SESSION_KEY);
  },

  setVerifiedQrSession(session: VerifiedQrSession) {
    if (typeof window === "undefined") return;
    localStorage.setItem(QR_SESSION_KEY, JSON.stringify(session));
  },

  clearVerifiedQrSession() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(QR_SESSION_KEY);
  },

  getMenuBundle(): StoredMenuBundle | null {
    return readJson<StoredMenuBundle>(MENU_BUNDLE_KEY);
  },

  setMenuBundle(bundle: StoredMenuBundle) {
    if (typeof window === "undefined") return;
    localStorage.setItem(MENU_BUNDLE_KEY, JSON.stringify(bundle));
  },

  clearMenuBundle() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(MENU_BUNDLE_KEY);
  },

  clearAll() {
    this.clearQrToken();
    this.clearVerifiedQrSession();
    this.clearMenuBundle();
  },
};