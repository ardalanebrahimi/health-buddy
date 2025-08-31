import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { BiometricsService } from "../biometrics.service";

@Component({
  standalone: true,
  selector: "app-pain-log",
  templateUrl: "./pain-log.component.html",
  styleUrls: ["./pain-log.component.scss"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class PainLogComponent {
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);

  loading = false;
  error: string | null = null;

  readonly locationOptions = [
    { value: "lower_back", label: "Lower Back" },
    { value: "between_shoulders", label: "Between Shoulders" },
    { value: "elbows", label: "Elbows" },
    { value: "coccyx", label: "Coccyx" },
    { value: "other", label: "Other" },
  ];

  form = new FormGroup({
    location: new FormControl<string | null>(null, Validators.required),
    score: new FormControl<number>(5, [
      Validators.required,
      Validators.min(1),
      Validators.max(10),
    ]),
    note: new FormControl<string | null>(null, Validators.maxLength(250)),
    takenAt: new FormControl<string>(new Date().toISOString()),
  });

  get isFormValid(): boolean {
    return this.form.valid;
  }

  get scoreValue(): number {
    return this.form.get("score")?.value || 5;
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = "Please fill in all required fields correctly.";
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formValue = this.form.getRawValue();
      const dto = {
        location: formValue.location!,
        score: formValue.score!,
        note: formValue.note || undefined,
        takenAt: formValue.takenAt || undefined,
      };

      await this.biometricsService.logPain(dto);

      this.router.navigateByUrl("/home");
    } catch (error) {
      console.error("Error saving pain entry:", error);
      this.error = "Failed to save pain entry. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  async cancel() {
    this.router.navigateByUrl("/home");
  }

  getScoreColor(score: number): string {
    if (score <= 3) return "success";
    if (score <= 6) return "warning";
    return "danger";
  }

  getScoreDescription(score: number): string {
    if (score <= 2) return "Mild";
    if (score <= 4) return "Moderate";
    if (score <= 7) return "Severe";
    return "Very Severe";
  }
}
