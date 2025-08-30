import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { LockService } from "../../services/lock.service";
import { BiometricService } from "../../services/biometric.service";

@Component({
  selector: "app-pin-setup",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./pin-setup.component.html",
  styleUrls: ["./pin-setup.component.scss"],
})
export class PinSetupComponent implements OnInit {
  step: "enter" | "confirm" = "enter";
  currentPin = "";
  firstPin = "";
  errorMessage = "";
  enableBiometrics = false;
  biometricsAvailable = false;
  biometryDescription = "";

  keypadNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  pinDots = new Array(6); // Support up to 6 digit PIN

  constructor(
    private lockService: LockService,
    private biometricService: BiometricService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Check if biometrics are available
    this.biometricsAvailable = await this.biometricService.isAvailable();
    if (this.biometricsAvailable) {
      this.biometryDescription =
        await this.biometricService.getBiometryDescription();
    }

    // Check if already set up
    const isSetup = await this.lockService.isSetup();
    if (isSetup) {
      this.router.navigate(["/"]);
    }
  }

  get stepTitle(): string {
    return this.step === "enter" ? "Create your PIN" : "Confirm your PIN";
  }

  get stepSubtitle(): string {
    return this.step === "enter"
      ? "Choose a 4-6 digit PIN to secure your health data"
      : "Enter your PIN again to confirm";
  }

  get continueButtonText(): string {
    return this.step === "enter" ? "Continue" : "Create PIN";
  }

  onKeypadPress(num: number) {
    if (this.currentPin.length < 6) {
      this.currentPin += num.toString();
      this.onPinInput();
    }
  }

  onDelete() {
    if (this.currentPin.length > 0) {
      this.currentPin = this.currentPin.slice(0, -1);
      this.clearError();
    }
  }

  onPinInput() {
    // Filter to only allow digits
    this.currentPin = this.currentPin.replace(/\D/g, "");
    this.clearError();

    // Auto-continue if PIN is long enough
    if (this.currentPin.length >= 4 && this.currentPin.length <= 6) {
      // Small delay for visual feedback
      setTimeout(() => {
        if (this.currentPin.length >= 4) {
          this.onContinue();
        }
      }, 300);
    }
  }

  async onContinue() {
    if (this.currentPin.length < 4) {
      this.showError("PIN must be at least 4 digits");
      return;
    }

    if (this.step === "enter") {
      this.firstPin = this.currentPin;
      this.currentPin = "";
      this.step = "confirm";
    } else {
      // Confirm step
      if (this.currentPin !== this.firstPin) {
        this.showError("PINs do not match. Please try again.");
        this.currentPin = "";
        return;
      }

      try {
        await this.lockService.setupPin(this.firstPin);

        if (this.enableBiometrics && this.biometricsAvailable) {
          await this.lockService.enableBiometrics(true);
        }

        // Navigate to home
        this.router.navigate(["/"]);
      } catch (error) {
        this.showError("Failed to create PIN. Please try again.");
        console.error("PIN setup failed:", error);
      }
    }
  }

  goBack() {
    this.step = "enter";
    this.currentPin = this.firstPin;
    this.firstPin = "";
    this.clearError();
  }

  private showError(message: string) {
    this.errorMessage = message;
  }

  private clearError() {
    this.errorMessage = "";
  }
}
