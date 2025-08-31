import { Component, OnInit, inject, computed, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormArray,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MealApiService } from "../../services/meal-api.service";

interface MealItem {
  id: string;
  name: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  editedByUser?: boolean;
}

interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface UpdateMealItemRequest {
  id: string;
  name: string;
  portionGrams: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

@Component({
  selector: "app-meal-edit",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./meal-edit.component.html",
  styleUrls: ["./meal-edit.component.scss"],
})
export class MealEditComponent implements OnInit {
  private mealApiService = inject(MealApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mealId = "";
  mealName = "";
  originalItems: MealItem[] = [];
  loading = true;
  saving = false;
  error = "";

  // Reactive form
  itemsForm = new FormArray<
    FormGroup<{
      id: FormControl<string>;
      name: FormControl<string>;
      portionGrams: FormControl<number>;
      calories: FormControl<number>;
      protein: FormControl<number>;
      carbs: FormControl<number>;
      fat: FormControl<number>;
    }>
  >([]);

  // Computed totals from form values
  totals = computed(() => {
    const formValues = this.itemsForm.controls.map((control) => control.value);
    return {
      calories: formValues.reduce((sum, item) => sum + (item.calories || 0), 0),
      protein: formValues.reduce((sum, item) => sum + (item.protein || 0), 0),
      carbs: formValues.reduce((sum, item) => sum + (item.carbs || 0), 0),
      fat: formValues.reduce((sum, item) => sum + (item.fat || 0), 0),
    };
  });

  // Check if form has been modified
  hasChanges = computed(() => {
    const currentValues = this.itemsForm.controls.map(
      (control) => control.value
    );
    if (currentValues.length !== this.originalItems.length) return true;

    return currentValues.some((current, index) => {
      const original = this.originalItems[index];
      return (
        current.name !== original.name ||
        current.portionGrams !== original.portionGrams ||
        current.calories !== original.calories ||
        current.protein !== original.protein ||
        current.carbs !== original.carbs ||
        current.fat !== original.fat
      );
    });
  });

  // Check if any items were edited by user
  hasEditedItems = computed(() => {
    return this.originalItems.some((item) => item.editedByUser === true);
  });

  async ngOnInit() {
    this.mealId = this.route.snapshot.paramMap.get("mealId") || "";
    if (!this.mealId) {
      this.error = "Meal ID is required";
      this.loading = false;
      return;
    }

    try {
      await this.loadMeal();
    } catch (error: any) {
      console.error("Error loading meal:", error);
      this.error = "Failed to load meal details";
    } finally {
      this.loading = false;
    }
  }

  private async loadMeal() {
    return new Promise<void>((resolve, reject) => {
      this.mealApiService.getMealById(this.mealId).subscribe({
        next: (meal) => {
          this.mealName = meal.name || "Meal";
          this.originalItems = meal.items || [];
          this.setupForm();
          resolve();
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  private setupForm() {
    // Clear existing form controls
    while (this.itemsForm.length !== 0) {
      this.itemsForm.removeAt(0);
    }

    // Add form controls for each item
    this.originalItems.forEach((item) => {
      const itemFormGroup = new FormGroup({
        id: new FormControl(item.id, { nonNullable: true }),
        name: new FormControl(item.name, {
          nonNullable: true,
          validators: [Validators.required, Validators.minLength(1)],
        }),
        portionGrams: new FormControl(item.portionGrams, {
          nonNullable: true,
          validators: [Validators.required, Validators.min(0)],
        }),
        calories: new FormControl(item.calories, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        protein: new FormControl(item.protein, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        carbs: new FormControl(item.carbs, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
        fat: new FormControl(item.fat, {
          nonNullable: true,
          validators: [Validators.min(0)],
        }),
      });

      this.itemsForm.push(itemFormGroup);
    });
  }

  async save() {
    if (this.itemsForm.invalid || this.saving) {
      return;
    }

    this.saving = true;
    this.error = "";

    try {
      const items: UpdateMealItemRequest[] = this.itemsForm.controls.map(
        (control) => {
          const value = control.value;
          return {
            id: value.id!,
            name: value.name!,
            portionGrams: value.portionGrams!,
            calories: value.calories,
            protein: value.protein,
            carbs: value.carbs,
            fat: value.fat,
          };
        }
      );

      await new Promise<void>((resolve, reject) => {
        this.mealApiService.updateMealItems(this.mealId, { items }).subscribe({
          next: (response) => {
            resolve();
          },
          error: (error) => {
            reject(error);
          },
        });
      });

      // Navigate back to meal detail or nutrition list
      this.router.navigate(["/nutrition"], {
        queryParams: { updated: "true" },
      });
    } catch (error: any) {
      console.error("Error saving meal items:", error);
      this.error = "Failed to save changes. Please try again.";
    } finally {
      this.saving = false;
    }
  }

  cancel() {
    this.router.navigate(["/nutrition"]);
  }

  // Utility method to get form control by index
  getItemControl(index: number, field: string): FormControl {
    return this.itemsForm.at(index).get(field) as FormControl;
  }
}
