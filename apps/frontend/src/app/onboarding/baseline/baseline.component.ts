import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProfileService, UpdateBaselineDto } from "../profile.service";

@Component({
  selector: "app-baseline",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./baseline.component.html",
  styleUrls: ["./baseline.component.scss"],
})
export class BaselineComponent {
  private profile = inject(ProfileService);
  private router = inject(Router);

  // Available options
  readonly availableConditions = [
    "overweight",
    "diabetes",
    "hypertension",
    "heart_disease",
    "arthritis",
    "depression",
    "anxiety",
    "chronic_fatigue",
    "other",
  ];

  readonly availablePainAreas = [
    "lower_back",
    "shoulders",
    "elbows",
    "coccyx",
    "other",
  ];

  form = new FormGroup({
    conditions: new FormControl<string[]>([]),
    painAreas: new FormControl<string[]>([]),
    notes: new FormControl<string | null>(null, {
      validators: [Validators.maxLength(500)],
    }),
  });

  isLoading = false;

  constructor() {
    this.loadExistingBaseline();
  }

  private async loadExistingBaseline() {
    try {
      const profile = await this.profile.getProfile();
      if (profile?.baselineJson) {
        this.form.patchValue({
          conditions: profile.baselineJson.conditions || [],
          painAreas: profile.baselineJson.painAreas || [],
          notes: profile.baselineJson.notes || null,
        });
      }
    } catch (error) {
      console.error("Failed to load existing baseline:", error);
    }
  }

  onToggleCondition(condition: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentConditions = this.form.get("conditions")?.value || [];

    if (target.checked) {
      if (!currentConditions.includes(condition)) {
        this.form
          .get("conditions")
          ?.setValue([...currentConditions, condition]);
      }
    } else {
      this.form
        .get("conditions")
        ?.setValue(currentConditions.filter((c) => c !== condition));
    }
  }

  onTogglePainArea(painArea: string, event: Event) {
    const target = event.target as HTMLInputElement;
    const currentPainAreas = this.form.get("painAreas")?.value || [];

    if (target.checked) {
      if (!currentPainAreas.includes(painArea)) {
        this.form.get("painAreas")?.setValue([...currentPainAreas, painArea]);
      }
    } else {
      this.form
        .get("painAreas")
        ?.setValue(currentPainAreas.filter((p) => p !== painArea));
    }
  }

  isConditionSelected(condition: string): boolean {
    return (this.form.get("conditions")?.value || []).includes(condition);
  }

  isPainAreaSelected(painArea: string): boolean {
    return (this.form.get("painAreas")?.value || []).includes(painArea);
  }

  getDisplayName(key: string): string {
    return key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  }

  async save() {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    try {
      const dto: UpdateBaselineDto =
        this.form.getRawValue() as UpdateBaselineDto;
      await this.profile.updateBaseline(dto);
      this.router.navigateByUrl("/onboarding/goals");
    } catch (error) {
      console.error("Failed to save baseline:", error);
      // The profile service handles offline queueing, so we can still proceed
      this.router.navigateByUrl("/onboarding/goals");
    } finally {
      this.isLoading = false;
    }
  }

  get notesCharacterCount(): number {
    return this.form.get("notes")?.value?.length || 0;
  }
}
