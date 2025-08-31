export interface AuthState {
  pinHash?: string; // base64 encoded hash
  pinSalt?: string; // base64 encoded salt
  biometricsEnabled?: boolean;
  lastUnlock?: string; // ISO string (UTC)
  lockTimeoutMs?: number; // default 604800000 (7 days)
  version: 1;
}

export const DEFAULT_LOCK_TIMEOUT_MS = 604800000; // 7 days (instead of 24 hours)
export const PREFERENCES_KEY = "auth";
