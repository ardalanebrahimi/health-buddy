import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { CameraService, PhotoResult } from "../../services/camera.service";
import { MealApiService } from "../../services/meal-api.service";
import { SyncService } from "../../services/sync.service";

@Component({
  selector: "app-meal-photo",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./meal-photo.component.html",
  styleUrls: ["./meal-photo.component.scss"],
})
export class MealPhotoComponent implements OnInit {
  photo?: PhotoResult;
  notes = new FormControl("", [Validators.maxLength(500)]);
  isUploading = false;
  duplicateClickPrevention = false;
  showOptions = true;
  errorMessage = "";
  successMessage = "";
  isOnline = navigator.onLine;

  constructor(
    private cameraService: CameraService,
    private mealApiService: MealApiService,
    private syncService: SyncService,
    private router: Router
  ) {}

  ngOnInit() {
    // Component initializes with photo options visible
    this.setupNetworkListener();
    this.checkInitialPermissions();
  }

  private async checkInitialPermissions() {
    try {
      const permissions = await this.cameraService.checkPermissions();
      if (!permissions.camera || !permissions.photos) {
        this.errorMessage =
          "Camera permissions are required to add meal photos. Please grant permissions when prompted.";
      }
    } catch (error) {
      console.error("Error checking initial permissions:", error);
    }
  }

  private setupNetworkListener() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  }

  async pickPhoto(source: "camera" | "gallery") {
    try {
      this.showOptions = false;
      this.errorMessage = "";

      // First check current permissions
      const currentPermissions = await this.cameraService.checkPermissions();

      // If permissions are not granted, request them
      if (!currentPermissions.camera || !currentPermissions.photos) {
        this.errorMessage = "Requesting camera permissions...";

        const granted = await this.cameraService.requestPermissions();
        if (!granted) {
          this.errorMessage =
            "Camera permissions are required to add meal photos. " +
            "Please enable camera and photo access in your device settings and try again.";
          this.showOptions = true;
          return;
        }

        // Clear the requesting message
        this.errorMessage = "";
      }

      // Take the photo
      this.photo = await this.cameraService.takePhoto({ source, quality: 70 });
    } catch (error: any) {
      console.error("Error taking photo:", error);

      // Provide more specific error messages
      if (error.message && error.message.includes("Permission")) {
        this.errorMessage =
          "Camera permissions are required to add meal photos. Please enable camera access in your device settings.";
      } else if (error.message && error.message.includes("cancelled")) {
        this.errorMessage = "Photo capture was cancelled.";
      } else {
        this.errorMessage = "Failed to capture photo. Please try again.";
      }

      this.showOptions = true;
    }
  }

  async retakePhoto() {
    this.photo = undefined;
    this.showOptions = true;
    this.errorMessage = "";
    this.successMessage = "";
  }

  openSettings() {
    // For mobile devices, provide guidance on how to open settings
    if (
      navigator.userAgent.includes("iPhone") ||
      navigator.userAgent.includes("iPad")
    ) {
      this.errorMessage =
        "Go to Settings > Privacy & Security > Camera, then enable access for this app.";
    } else if (navigator.userAgent.includes("Android")) {
      this.errorMessage =
        "Go to Settings > Apps > [App Name] > Permissions, then enable Camera and Storage permissions.";
    } else {
      this.errorMessage =
        "Please enable camera permissions in your browser or device settings.";
    }
  }

  async saveMeal() {
    if (!this.photo || this.isUploading || this.duplicateClickPrevention) {
      return;
    }

    // Prevent duplicate clicks
    this.duplicateClickPrevention = true;
    this.isUploading = true;
    this.errorMessage = "";
    this.successMessage = "";

    try {
      const isOnline = navigator.onLine;

      if (isOnline) {
        // Try to upload directly
        const blob = await this.mealApiService.convertWebPathToBlob(
          this.photo.webPath
        );
        const response = await this.mealApiService
          .uploadMealPhoto(
            blob,
            new Date().toISOString(),
            this.notes.value || undefined
          )
          .toPromise();

        if (response) {
          this.successMessage =
            "Meal saved successfully! Recognition coming next.";
          setTimeout(
            () =>
              this.router.navigate(["/nutrition/recognition", response.mealId]),
            2000
          );
        }
      } else {
        // Save locally and queue for sync
        const localMeal = await this.syncService.saveMealLocally(
          this.photo.webPath,
          new Date().toISOString(),
          this.notes.value || undefined
        );

        await this.syncService.enqueueMealPhotoUpload(localMeal);
        this.successMessage = "Meal saved offline. Will sync when online.";
        setTimeout(() => this.router.navigate(["/nutrition"]), 2000);
      }
    } catch (error: any) {
      console.error("Error saving meal:", error);

      // Handle different types of errors
      if (error.code === "FILE_TOO_LARGE") {
        this.errorMessage =
          "Image is too large. Please use a smaller image (max 8MB).";
      } else if (error.code === "UNSUPPORTED_FILE_TYPE") {
        this.errorMessage =
          "Image format not supported. Please use JPG, PNG, or HEIC format.";
      } else if (error.code === "IMAGE_PROCESSING_FAILED") {
        this.errorMessage =
          "Failed to process image. Please ensure the file is a valid image.";
      } else {
        this.errorMessage = "Failed to save meal. Please try again.";
      }
    } finally {
      this.isUploading = false;
      this.duplicateClickPrevention = false;
    }
  }

  cancel() {
    this.router.navigate(["/nutrition"]);
  }

  get canSave(): boolean {
    return !!this.photo && !this.isUploading && this.notes.valid;
  }
}
