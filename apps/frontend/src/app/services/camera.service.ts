import { Injectable } from "@angular/core";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export interface PhotoOptions {
  source: "camera" | "gallery";
  quality?: number;
  allowEditing?: boolean;
}

export interface PhotoResult {
  webPath: string;
  format: string;
  path?: string;
}

@Injectable({
  providedIn: "root",
})
export class CameraService {
  async takePhoto(options: PhotoOptions): Promise<PhotoResult> {
    const source =
      options.source === "camera" ? CameraSource.Camera : CameraSource.Photos;

    const image = await Camera.getPhoto({
      quality: options.quality ?? 70,
      allowEditing: options.allowEditing ?? false,
      resultType: CameraResultType.Uri,
      source: source,
    });

    if (!image.webPath) {
      throw new Error("Failed to capture photo");
    }

    return {
      webPath: image.webPath,
      format: image.format || "jpeg",
      path: image.path,
    };
  }

  async requestPermissions(): Promise<boolean> {
    try {
      // Request permissions for both camera and photos
      const permissions = await Camera.requestPermissions({
        permissions: ["camera", "photos"],
      });

      const cameraGranted = permissions.camera === "granted";
      const photosGranted = permissions.photos === "granted";

      console.log("Camera permission:", permissions.camera);
      console.log("Photos permission:", permissions.photos);

      return cameraGranted && photosGranted;
    } catch (error) {
      console.error("Failed to request camera permissions:", error);
      return false;
    }
  }

  async checkPermissions(): Promise<{ camera: boolean; photos: boolean }> {
    try {
      const permissions = await Camera.checkPermissions();
      console.log("Current permissions:", permissions);

      return {
        camera: permissions.camera === "granted",
        photos: permissions.photos === "granted",
      };
    } catch (error) {
      console.error("Failed to check camera permissions:", error);
      return { camera: false, photos: false };
    }
  }

  /**
   * Check if permissions are available or permanently denied
   */
  async getPermissionStatus(): Promise<{
    camera: string;
    photos: string;
    canRequest: boolean;
  }> {
    try {
      const permissions = await Camera.checkPermissions();
      const canRequest =
        permissions.camera !== "denied" && permissions.photos !== "denied";

      return {
        camera: permissions.camera,
        photos: permissions.photos,
        canRequest,
      };
    } catch (error) {
      console.error("Failed to get permission status:", error);
      return {
        camera: "prompt",
        photos: "prompt",
        canRequest: true,
      };
    }
  }
}
