import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileService, CreateProfileDto } from "../profile.service";

@Component({
  selector: "app-demographics",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./demographics.component.html",
  styleUrls: ["./demographics.component.scss"],
})
export class DemographicsComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  readonly form = new FormGroup({
    age: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(5), Validators.max(120)],
    }),
    sex: new FormControl<"M" | "F" | "Other" | null>(null, {
      validators: [Validators.required],
    }),
    heightCm: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(120),
        Validators.max(230),
      ],
    }),
    weightKg: new FormControl<number | null>(null, {
      validators: [
        Validators.required,
        Validators.min(20),
        Validators.max(300),
      ],
    }),
    activityLevel: new FormControl<
      "sedentary" | "light" | "moderate" | "active" | null
    >("moderate", {
      validators: [Validators.required],
    }),
  });

  readonly sexOptions = [
    { value: "M", label: "Male" },
    { value: "F", label: "Female" },
    { value: "Other", label: "Other" },
  ] as const;

  readonly activityLevels = [
    {
      value: "sedentary",
      label: "Sedentary",
      description: "Little to no exercise",
    },
    {
      value: "light",
      label: "Light",
      description: "Light exercise 1-3 days/week",
    },
    {
      value: "moderate",
      label: "Moderate",
      description: "Moderate exercise 3-5 days/week",
    },
    {
      value: "active",
      label: "Active",
      description: "Hard exercise 6-7 days/week",
    },
  ] as const;

  isLoading = false;

  async ngOnInit() {
    // Hydrate form from local mirror if present
    const profile = await this.profileService.getProfile();
    if (profile) {
      this.form.patchValue({
        age: profile.age,
        sex: profile.sex,
        heightCm: profile.heightCm,
        weightKg: profile.weightKg,
        activityLevel: profile.activityLevel,
      });
    }
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    try {
      const formValue = this.form.getRawValue();
      const dto: CreateProfileDto = {
        age: formValue.age!,
        sex: formValue.sex!,
        heightCm: formValue.heightCm!,
        weightKg: formValue.weightKg!,
        activityLevel: formValue.activityLevel!,
      };

      const wasComplete = this.profileService.isProfileComplete();
      await this.profileService.saveProfile(dto);

      // If profile was already complete, they're editing, so go back to home
      // Otherwise, continue to baseline step
      if (wasComplete) {
        this.router.navigateByUrl("/");
      } else {
        this.router.navigateByUrl("/onboarding/baseline");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      // TODO: Show user-friendly error message
    } finally {
      this.isLoading = false;
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors["required"]) return `${fieldName} is required`;
      if (field.errors["min"]) return `${fieldName} is too low`;
      if (field.errors["max"]) return `${fieldName} is too high`;
    }
    return null;
  }

  cancel() {
    // Check if profile was already complete before editing
    const wasComplete = this.profileService.isProfileComplete();

    if (wasComplete) {
      // They were editing an existing profile, go back to home
      this.router.navigateByUrl("/");
    } else {
      // They're in initial onboarding, still go back but show a message
      this.router.navigateByUrl("/");
    }
  }
}
