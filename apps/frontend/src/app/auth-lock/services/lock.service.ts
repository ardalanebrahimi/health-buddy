import { Injectable } from "@angular/core";
import { Preferences } from "@capacitor/preferences";
import {
  AuthState,
  DEFAULT_LOCK_TIMEOUT_MS,
  PREFERENCES_KEY,
} from "../types/auth-state.type";

@Injectable({
  providedIn: "root",
})
export class LockService {
  private currentState: AuthState | null = null;

  /**
   * Hash a PIN using PBKDF2 with WebCrypto API
   */
  private async hashPin(pin: string, salt: Uint8Array): Promise<string> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(pin),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        hash: "SHA-256",
        salt: salt as BufferSource,
        iterations: 100000,
      },
      keyMaterial,
      256
    );

    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
  }

  /**
   * Generate a random salt
   */
  private generateSalt(): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /**
   * Load auth state from preferences
   */
  private async loadAuthState(): Promise<AuthState> {
    try {
      const { value } = await Preferences.get({ key: PREFERENCES_KEY });
      if (value) {
        const state = JSON.parse(value) as AuthState;
        this.currentState = state;
        return state;
      }
    } catch (error) {
      console.warn("Failed to load auth state:", error);
    }

    // Return default state
    const defaultState: AuthState = { version: 1 };
    this.currentState = defaultState;
    return defaultState;
  }

  /**
   * Save auth state to preferences
   */
  private async saveAuthState(state: AuthState): Promise<void> {
    try {
      await Preferences.set({
        key: PREFERENCES_KEY,
        value: JSON.stringify(state),
      });
      this.currentState = state;
    } catch (error) {
      console.error("Failed to save auth state:", error);
      throw error;
    }
  }

  /**
   * Check if PIN has been set up
   */
  async isSetup(): Promise<boolean> {
    const state = await this.loadAuthState();
    return !!(state.pinHash && state.pinSalt);
  }

  /**
   * Set up a new PIN
   */
  async setupPin(pin: string): Promise<void> {
    if (!pin || pin.length < 4) {
      throw new Error("PIN must be at least 4 characters long");
    }

    const salt = this.generateSalt();
    const pinHash = await this.hashPin(pin, salt);

    const state: AuthState = {
      pinHash,
      pinSalt: btoa(String.fromCharCode(...salt)),
      biometricsEnabled: false,
      lastUnlock: new Date().toISOString(),
      lockTimeoutMs: DEFAULT_LOCK_TIMEOUT_MS,
      version: 1,
    };

    await this.saveAuthState(state);
  }

  /**
   * Unlock with PIN
   */
  async unlockWithPin(pin: string): Promise<boolean> {
    const state = await this.loadAuthState();

    if (!state.pinHash || !state.pinSalt) {
      return false;
    }

    try {
      const salt = new Uint8Array(
        atob(state.pinSalt)
          .split("")
          .map((char) => char.charCodeAt(0))
      );
      const hashedPin = await this.hashPin(pin, salt);

      if (hashedPin === state.pinHash) {
        // Update last unlock time
        await this.saveAuthState({
          ...state,
          lastUnlock: new Date().toISOString(),
        });
        return true;
      }
    } catch (error) {
      console.error("PIN verification failed:", error);
    }

    return false;
  }

  /**
   * Unlock with biometrics (placeholder for now)
   */
  async unlockWithBiometrics(): Promise<boolean> {
    const state = await this.loadAuthState();

    if (!state.biometricsEnabled) {
      return false;
    }

    // Placeholder implementation
    // In a real implementation, this would use the BiometricService
    // const biometricService = inject(BiometricService);
    // const success = await biometricService.verify('Unlock Health Companion');

    // if (success) {
    //   await this.saveAuthState({
    //     ...state,
    //     lastUnlock: new Date().toISOString()
    //   });
    //   return true;
    // }

    return false;
  }

  /**
   * Enable or disable biometrics
   */
  async enableBiometrics(enable: boolean): Promise<void> {
    const state = await this.loadAuthState();

    await this.saveAuthState({
      ...state,
      biometricsEnabled: enable,
    });
  }

  /**
   * Check if the app should be locked based on timeout
   */
  async shouldLock(): Promise<boolean> {
    const state = await this.loadAuthState();

    // If PIN is not set up, don't lock
    if (!state.pinHash) {
      return false;
    }

    // If no last unlock time, should lock
    if (!state.lastUnlock) {
      return true;
    }

    const lastUnlock = new Date(state.lastUnlock);
    const now = new Date();
    const timeoutMs = state.lockTimeoutMs || DEFAULT_LOCK_TIMEOUT_MS;

    return now.getTime() - lastUnlock.getTime() > timeoutMs;
  }

  /**
   * Force lock the app
   */
  async forceLock(): Promise<void> {
    const state = await this.loadAuthState();

    if (state.pinHash) {
      // Clear the last unlock time to force lock
      await this.saveAuthState({
        ...state,
        lastUnlock: undefined,
      });
    }
  }

  /**
   * Update lock timeout
   */
  async updateTimeout(ms: number): Promise<void> {
    if (ms < 60000) {
      // Minimum 1 minute
      throw new Error("Timeout must be at least 1 minute");
    }

    const state = await this.loadAuthState();
    await this.saveAuthState({
      ...state,
      lockTimeoutMs: ms,
    });
  }

  /**
   * Get current auth state
   */
  async getState(): Promise<AuthState> {
    return this.loadAuthState();
  }

  /**
   * Reset all auth data (for forgotten PIN)
   */
  async resetAuth(): Promise<void> {
    try {
      await Preferences.remove({ key: PREFERENCES_KEY });
      this.currentState = null;
    } catch (error) {
      console.error("Failed to reset auth:", error);
      throw error;
    }
  }

  /**
   * Refresh session to extend timeout
   */
  async refreshSession(): Promise<void> {
    const state = await this.loadAuthState();

    if (state.pinHash && state.lastUnlock) {
      await this.saveAuthState({
        ...state,
        lastUnlock: new Date().toISOString(),
      });
    }
  }

  /**
   * Change PIN (requires current PIN verification)
   */
  async changePin(currentPin: string, newPin: string): Promise<boolean> {
    // Verify current PIN first
    const isValid = await this.unlockWithPin(currentPin);
    if (!isValid) {
      return false;
    }

    // Set up new PIN
    await this.setupPin(newPin);
    return true;
  }
}
