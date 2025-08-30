export interface AuthState {
  pinHash?: string; // base64 encoded hash
  pinSalt?: string; // base64 encoded salt
  biometricsEnabled?: boolean;
  lastUnlock?: string; // ISO string (UTC)
  lockTimeoutMs?: number; // default 300000 (5 minutes)
  version: 1;
}

export const DEFAULT_LOCK_TIMEOUT_MS = 300000; // 5 minutes
export const PREFERENCES_KEY = "auth";
