export interface AuthState {
  pinHash?: string; // base64 encoded hash
  pinSalt?: string; // base64 encoded salt
  biometricsEnabled?: boolean;
  lastUnlock?: string; // ISO string (UTC)
  lockTimeoutMs?: number; // default 86400000 (24 hours)
  version: 1;
}

export const DEFAULT_LOCK_TIMEOUT_MS = 86400000; // 24 hours
export const PREFERENCES_KEY = "auth";
