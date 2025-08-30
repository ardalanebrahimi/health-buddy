import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { LockService } from "../../services/lock.service";
import { BiometricService } from "../../services/biometric.service";
import { AuthState } from "../../types/auth-state.type";

@Component({
  selector: "app-settings-lock",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./settings-lock.component.html",
  styleUrls: ["./settings-lock.component.scss"],
})
export class SettingsLockComponent implements OnInit {
  isLoading = false;
  errorMessage = "";
  successMessage = "";

  // Biometric settings
  biometricsEnabled = false;
  biometricsAvailable = false;
  biometryDescription = "";

  // Timeout settings
  selectedTimeout = 300000; // 5 minutes default
  timeoutOptions = [
    { value: 60000, label: "1 minute" },
    { value: 300000, label: "5 minutes" },
    { value: 600000, label: "10 minutes" },
    { value: 1800000, label: "30 minutes" },
    { value: 3600000, label: "1 hour" },
  ];

  // Change PIN state
  isChangingPIN = false;
  changePINStep: "current" | "new" | "confirm" = "current";
  currentPINInput = "";
  newPINInput = "";
  confirmPINInput = "";
  changePINError = "";

  // Auth state
  lastUnlock?: string;

  constructor(
    private lockService: LockService,
    private biometricService: BiometricService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.loadSettings();
  }

  private async loadSettings() {
    this.isLoading = true;

    try {
      // Load auth state
      const state = await this.lockService.getState();
      this.biometricsEnabled = state.biometricsEnabled || false;
      this.selectedTimeout = state.lockTimeoutMs || 300000;
      this.lastUnlock = state.lastUnlock;

      // Check biometric availability
      this.biometricsAvailable = await this.biometricService.isAvailable();
      if (this.biometricsAvailable) {
        this.biometryDescription =
          await this.biometricService.getBiometryDescription();
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
      this.showError("Failed to load settings");
    } finally {
      this.isLoading = false;
    }
  }

  async onBiometricsToggle() {
    this.isLoading = true;
    this.clearMessages();

    try {
      await this.lockService.enableBiometrics(this.biometricsEnabled);
      const action = this.biometricsEnabled ? "enabled" : "disabled";
      this.showSuccess(`${this.biometryDescription} ${action}`);
    } catch (error) {
      console.error("Failed to update biometrics setting:", error);
      this.biometricsEnabled = !this.biometricsEnabled; // Revert
      this.showError("Failed to update biometric setting");
    } finally {
      this.isLoading = false;
    }
  }

  async onTimeoutChange() {
    this.isLoading = true;
    this.clearMessages();

    try {
      await this.lockService.updateTimeout(this.selectedTimeout);
      this.showSuccess("Auto-lock timeout updated");
    } catch (error) {
      console.error("Failed to update timeout:", error);
      this.showError("Failed to update timeout setting");
      await this.loadSettings(); // Reload to get correct value
    } finally {
      this.isLoading = false;
    }
  }

  startChangePIN() {
    this.isChangingPIN = true;
    this.changePINStep = "current";
    this.currentPINInput = "";
    this.newPINInput = "";
    this.confirmPINInput = "";
    this.changePINError = "";
  }

  cancelChangePIN() {
    this.isChangingPIN = false;
    this.changePINStep = "current";
    this.currentPINInput = "";
    this.newPINInput = "";
    this.confirmPINInput = "";
    this.changePINError = "";
  }

  onCurrentPINInput() {
    this.currentPINInput = this.currentPINInput.replace(/\D/g, "");
    this.changePINError = "";
  }

  onNewPINInput() {
    this.newPINInput = this.newPINInput.replace(/\D/g, "");
    this.changePINError = "";
  }

  onConfirmPINInput() {
    this.confirmPINInput = this.confirmPINInput.replace(/\D/g, "");
    this.changePINError = "";
  }

  async verifyCurrentPIN() {
    if (this.currentPINInput.length < 4) {
      this.changePINError = "PIN must be at least 4 digits";
      return;
    }

    this.isLoading = true;

    try {
      const isValid = await this.lockService.unlockWithPin(
        this.currentPINInput
      );
      if (isValid) {
        this.changePINStep = "new";
        this.changePINError = "";
      } else {
        this.changePINError = "Incorrect PIN";
      }
    } catch (error) {
      console.error("PIN verification failed:", error);
      this.changePINError = "Failed to verify PIN";
    } finally {
      this.isLoading = false;
    }
  }

  confirmNewPIN() {
    if (this.newPINInput.length < 4) {
      this.changePINError = "PIN must be at least 4 digits";
      return;
    }

    if (this.newPINInput === this.currentPINInput) {
      this.changePINError = "New PIN must be different from current PIN";
      return;
    }

    this.changePINStep = "confirm";
    this.changePINError = "";
  }

  async saveNewPIN() {
    if (this.confirmPINInput !== this.newPINInput) {
      this.changePINError = "PINs do not match";
      return;
    }

    this.isLoading = true;

    try {
      const success = await this.lockService.changePin(
        this.currentPINInput,
        this.newPINInput
      );
      if (success) {
        this.cancelChangePIN();
        this.showSuccess("PIN updated successfully");
      } else {
        this.changePINError = "Failed to update PIN";
      }
    } catch (error) {
      console.error("PIN change failed:", error);
      this.changePINError = "Failed to update PIN";
    } finally {
      this.isLoading = false;
    }
  }

  formatLastUnlock(lastUnlock: string): string {
    try {
      const date = new Date(lastUnlock);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) {
        return "Just now";
      } else if (diffMins < 60) {
        return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
      } else if (diffMins < 1440) {
        // Less than 24 hours
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
      } else {
        return date.toLocaleDateString();
      }
    } catch (error) {
      return "Unknown";
    }
  }

  goBack() {
    this.router.navigate(["/"]);
  }

  private showError(message: string) {
    this.errorMessage = message;
    this.successMessage = "";
    setTimeout(() => this.clearMessages(), 5000);
  }

  private showSuccess(message: string) {
    this.successMessage = message;
    this.errorMessage = "";
    setTimeout(() => this.clearMessages(), 3000);
  }

  private clearMessages() {
    this.errorMessage = "";
    this.successMessage = "";
  }
}
