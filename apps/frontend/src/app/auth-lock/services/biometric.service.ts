import { Injectable } from "@angular/core";
import { Capacitor } from "@capacitor/core";

export enum BiometryType {
  TOUCH_ID = "touchId",
  FACE_ID = "faceId",
  FINGERPRINT = "fingerprint",
  FACE_AUTHENTICATION = "face",
  IRIS_AUTHENTICATION = "iris",
}

@Injectable({
  providedIn: "root",
})
export class BiometricService {
  private readonly isNative = Capacitor.isNativePlatform();

  /**
   * Check if biometric authentication is available on this device
   */
  async isAvailable(): Promise<boolean> {
    if (!this.isNative) {
      return false;
    }

    // For now, return false until we have proper plugin integration
    // This can be enhanced once the Capacitor plugins are properly installed
    try {
      // Placeholder for actual biometric check
      // const { NativeBiometric } = await import('@capacitor-community/native-biometric');
      // const result = await NativeBiometric.isAvailable();
      // return result.isAvailable;
      return false; // Fallback for now
    } catch (error) {
      console.warn("Biometric availability check failed:", error);
      return false;
    }
  }

  /**
   * Get available biometry type
   */
  async getAvailableType(): Promise<BiometryType | null> {
    if (!this.isNative) {
      return null;
    }

    try {
      // Placeholder for actual biometric type check
      return null;
    } catch (error) {
      console.warn("Failed to get biometry type:", error);
      return null;
    }
  }

  /**
   * Verify user identity using biometrics
   */
  async verify(reason: string = "Unlock app"): Promise<boolean> {
    if (!this.isNative) {
      return false;
    }

    try {
      // Placeholder for actual biometric verification
      // const { NativeBiometric } = await import('@capacitor-community/native-biometric');
      // await NativeBiometric.verifyIdentity({
      //   reason,
      //   title: 'Authenticate',
      //   subtitle: 'Use your biometric credential to unlock the app',
      //   description: reason
      // });

      return false; // Fallback for now
    } catch (error) {
      console.warn("Biometric authentication failed:", error);
      return false;
    }
  }

  /**
   * Get a user-friendly description of available biometric type
   */
  async getBiometryDescription(): Promise<string> {
    const type = await this.getAvailableType();

    switch (type) {
      case BiometryType.FACE_ID:
        return "Face ID";
      case BiometryType.TOUCH_ID:
        return "Touch ID";
      case BiometryType.FINGERPRINT:
        return "Fingerprint";
      case BiometryType.FACE_AUTHENTICATION:
        return "Face Recognition";
      case BiometryType.IRIS_AUTHENTICATION:
        return "Iris Recognition";
      default:
        return "Biometric Authentication";
    }
  }
}
