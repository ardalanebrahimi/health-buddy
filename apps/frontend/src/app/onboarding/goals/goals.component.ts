import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileService, UpdateGoalsDto } from "../profile.service";

@Component({
  selector: "app-goals",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./goals.component.html",
  styleUrls: ["./goals.component.scss"],
})
export class GoalsComponent implements OnInit {
  private profile = inject(ProfileService);
  private router = inject(Router);

  form = new FormGroup({
    weightGoalKg: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(20),
      Validators.max(300),
    ]),
    sleepHoursTarget: new FormControl<number | null>(7, [
      Validators.required,
      Validators.min(4),
      Validators.max(12),
    ]),
    painTarget: new FormControl<number | null>(null, [
      Validators.min(0),
      Validators.max(10),
    ]),
  });

  isLoading = false;
  errorMessage = "";

  async ngOnInit() {
    try {
      this.isLoading = true;

      // Get profile to suggest weight goal
      const profile = await this.profile.getProfile();
      if (profile?.weightKg) {
        // Suggest 10% weight loss as default
        const suggestedWeight = Math.round(Number(profile.weightKg) * 0.9);
        this.form.patchValue({ weightGoalKg: suggestedWeight });
      }

      // Try to load existing goals
      const existingGoals = await this.profile.getGoals();
      if (existingGoals) {
        this.form.patchValue({
          weightGoalKg: existingGoals.weightGoalKg,
          sleepHoursTarget: existingGoals.sleepHoursTarget,
          painTarget: existingGoals.painTarget || null,
        });
      }
    } catch (error) {
      console.warn("Could not load profile or goals:", error);
      // Continue with defaults
    } finally {
      this.isLoading = false;
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = "";

      const formValue = this.form.getRawValue();
      const dto: UpdateGoalsDto = {
        weightGoalKg: formValue.weightGoalKg!,
        sleepHoursTarget: formValue.sleepHoursTarget!,
        painTarget: formValue.painTarget || undefined,
      };

      await this.profile.saveGoals(dto);

      // Mark onboarding as complete
      await this.profile.markOnboardingComplete();

      // Navigate to home (end of onboarding)
      this.router.navigateByUrl("/");
    } catch (error) {
      console.error("Failed to save goals:", error);
      this.errorMessage = "Failed to save goals. Please try again.";
    } finally {
      this.isLoading = false;
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["min"]) return `Value is too low`;
      if (field.errors["max"]) return `Value is too high`;
    }
    return "";
  }
}
