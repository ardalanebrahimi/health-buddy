import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { BiometricsService } from "../biometrics.service";

@Component({
  selector: "app-weight-log",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./weight-log.component.html",
  styleUrl: "./weight-log.component.scss",
})
export class WeightLogComponent {
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  form = new FormGroup({
    valueKg: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(20),
      Validators.max(300),
    ]),
    takenAt: new FormControl<string>(new Date().toISOString().slice(0, 16)),
  });

  get valueKgControl() {
    return this.form.get("valueKg");
  }

  get takenAtControl() {
    return this.form.get("takenAt");
  }

  async save(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formValue = this.form.getRawValue();
      const takenAtISO = formValue.takenAt
        ? new Date(formValue.takenAt).toISOString()
        : undefined;

      await this.biometricsService.logWeight(formValue.valueKg!, takenAtISO);

      // Navigate back or show success
      this.router.navigate(["/home"]);
    } catch (error) {
      this.error = "Failed to save weight. Please try again.";
      console.error("Error saving weight:", error);
    } finally {
      this.loading = false;
    }
  }

  cancel(): void {
    this.router.navigate(["/home"]);
  }
}
