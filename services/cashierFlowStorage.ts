import type { CashierCheckoutResult, QrSession } from "./cashier.service";

export interface StoredCheckoutRecord extends CashierCheckoutResult {
  savedAt: string;
}

const getQrStorageKey = (sessionId: number) => `cashier:qr-session:${sessionId}`;
const getCheckoutStorageKey = (tableId: number) => `cashier:checkout:${tableId}`;

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

export const cashierFlowStorage = {
  getQrSession(sessionId: number): QrSession | null {
    return readJson<QrSession>(getQrStorageKey(sessionId));
  },

  setQrSession(qrSession: QrSession) {
    if (typeof window === "undefined") return;
    localStorage.setItem(getQrStorageKey(qrSession.sessionId), JSON.stringify(qrSession));
  },

  clearQrSession(sessionId: number) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(getQrStorageKey(sessionId));
  },

  getCheckoutRecord(tableId: number): StoredCheckoutRecord | null {
    return readJson<StoredCheckoutRecord>(getCheckoutStorageKey(tableId));
  },

  setCheckoutRecord(tableId: number, record: CashierCheckoutResult) {
    if (typeof window === "undefined") return;
    const payload: StoredCheckoutRecord = {
      ...record,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(getCheckoutStorageKey(tableId), JSON.stringify(payload));
  },

  clearCheckoutRecord(tableId: number) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(getCheckoutStorageKey(tableId));
  },
};