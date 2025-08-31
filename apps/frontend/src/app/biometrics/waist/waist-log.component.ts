import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { BiometricsService, WaistEntry } from "../biometrics.service";

@Component({
  standalone: true,
  selector: "app-waist-log",
  templateUrl: "./waist-log.component.html",
  styleUrls: ["./waist-log.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class WaistLogComponent {
  private biometricsService = inject(BiometricsService);

  form = new FormGroup({
    valueCm: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(40),
      Validators.max(200),
    ]),
    takenAt: new FormControl<string>(new Date().toISOString().slice(0, 16)),
  });

  latestWaist = signal<WaistEntry | null>(null);
  isLoading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    // Subscribe to latest waist updates
    this.biometricsService.latestWaist$.subscribe((waist) => {
      this.latestWaist.set(waist);
    });
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    if (!formValue.valueCm) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      await this.biometricsService.logWaist(
        formValue.valueCm,
        formValue.takenAt || undefined
      );

      this.successMessage.set("Waist circumference logged successfully!");

      // Reset form for next entry
      this.form.patchValue({
        valueCm: null,
        takenAt: new Date().toISOString().slice(0, 16),
      });
    } catch (error) {
      this.errorMessage.set(
        "Failed to log waist circumference. Please try again."
      );
      console.error("Error logging waist:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  get valueCmControl() {
    return this.form.get("valueCm");
  }

  get takenAtControl() {
    return this.form.get("takenAt");
  }
}
