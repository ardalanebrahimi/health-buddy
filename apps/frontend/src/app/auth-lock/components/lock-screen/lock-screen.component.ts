import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { LockService } from "../../services/lock.service";
import { BiometricService } from "../../services/biometric.service";

@Component({
  selector: "app-lock-screen",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./lock-screen.component.html",
  styleUrls: ["./lock-screen.component.scss"],
})
export class LockScreenComponent implements OnInit {
  currentPin = "";
  errorMessage = "";
  hasError = false;
  isProcessing = false;

  biometricsEnabled = false;
  biometricsAvailable = false;
  biometryDescription = "";

  attempts = 0;
  maxAttempts = 5;
  cooldownSeconds = 0;
  showResetOption = false;
  showResetConfirm = false;

  private returnUrl = "/";
  private cooldownTimer?: number;

  keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  pinDots = new Array(6);

  constructor(
    private lockService: LockService,
    private biometricService: BiometricService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    // Get return URL from query params
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";

    // Load auth state
    const state = await this.lockService.getState();
    this.biometricsEnabled = state.biometricsEnabled || false;

    // Check biometric availability
    this.biometricsAvailable = await this.biometricService.isAvailable();
    if (this.biometricsAvailable) {
      this.biometryDescription =
        await this.biometricService.getBiometryDescription();
    }

    // Show reset option after some failed attempts
    this.showResetOption = this.attempts >= 3;
  }

  get attemptsLeft(): number {
    return Math.max(0, this.maxAttempts - this.attempts);
  }

  onKeypadPress(num: number) {
    if (
      this.currentPin.length < 6 &&
      !this.isProcessing &&
      this.cooldownSeconds === 0
    ) {
      this.currentPin += num.toString();
      this.clearError();

      // Auto-submit when PIN length is reached
      if (this.currentPin.length >= 4) {
        setTimeout(() => this.attemptUnlock(), 200);
      }
    }
  }

  onDelete() {
    if (this.currentPin.length > 0 && !this.isProcessing) {
      this.currentPin = this.currentPin.slice(0, -1);
      this.clearError();
    }
  }

  onPinInput() {
    // Filter to only allow digits
    this.currentPin = this.currentPin.replace(/\D/g, "");
    this.clearError();
  }

  async attemptUnlock() {
    if (
      this.currentPin.length < 4 ||
      this.isProcessing ||
      this.cooldownSeconds > 0
    ) {
      return;
    }

    this.isProcessing = true;

    try {
      const success = await this.lockService.unlockWithPin(this.currentPin);

      if (success) {
        this.router.navigate([this.returnUrl]);
      } else {
        this.handleFailedAttempt();
      }
    } catch (error) {
      console.error("Unlock attempt failed:", error);
      this.handleFailedAttempt();
    } finally {
      this.isProcessing = false;
    }
  }

  async unlockWithBiometrics() {
    if (
      !this.biometricsEnabled ||
      !this.biometricsAvailable ||
      this.isProcessing
    ) {
      return;
    }

    this.isProcessing = true;

    try {
      const success = await this.biometricService.verify(
        "Unlock Health Companion"
      );

      if (success) {
        // Update last unlock time
        const state = await this.lockService.getState();
        // This would need to be implemented in the lock service
        // await this.lockService.updateLastUnlock();

        this.router.navigate([this.returnUrl]);
      } else {
        this.showError("Biometric authentication failed");
      }
    } catch (error) {
      console.error("Biometric unlock failed:", error);
      this.showError("Biometric authentication failed");
    } finally {
      this.isProcessing = false;
    }
  }

  private handleFailedAttempt() {
    this.attempts++;
    this.currentPin = "";
    this.hasError = true;

    setTimeout(() => {
      this.hasError = false;
    }, 500);

    if (this.attempts >= this.maxAttempts) {
      this.startCooldown(30); // 30 second cooldown
      this.showResetOption = true;
    } else {
      this.showError("Incorrect PIN");
    }
  }

  private startCooldown(seconds: number) {
    this.cooldownSeconds = seconds;
    this.clearError();

    this.cooldownTimer = window.setInterval(() => {
      this.cooldownSeconds--;

      if (this.cooldownSeconds <= 0) {
        this.clearCooldown();
      }
    }, 1000);
  }

  private clearCooldown() {
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = undefined;
    }
    this.cooldownSeconds = 0;
    this.attempts = Math.max(0, this.attempts - 2); // Reduce attempts after cooldown
  }

  confirmReset() {
    this.showResetConfirm = true;
  }

  cancelReset() {
    this.showResetConfirm = false;
  }

  async performReset() {
    try {
      await this.lockService.resetAuth();
      // Clear any local data here if needed
      this.router.navigate(["/setup-pin"]);
    } catch (error) {
      console.error("Failed to reset auth:", error);
      this.showError("Failed to reset. Please try again.");
    }
    this.showResetConfirm = false;
  }

  private showError(message: string) {
    this.errorMessage = message;
  }

  private clearError() {
    this.errorMessage = "";
    this.hasError = false;
  }

  ngOnDestroy() {
    this.clearCooldown();
  }
}
