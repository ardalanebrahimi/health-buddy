import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import {
  MealApiService,
  MealRecognitionResponse,
} from "../../services/meal-api.service";

interface RecognizedItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  confidence: number;
}

interface RecognitionResponse {
  mealId: string;
  status: "completed" | "failed" | "processing";
  recognizedItems: RecognizedItem[];
  confidence: number;
  totalCalories: number;
  message?: string;
}

@Component({
  selector: "app-meal-recognition",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./meal-recognition.component.html",
  styleUrls: ["./meal-recognition.component.scss"],
})
export class MealRecognitionComponent implements OnInit {
  private mealApiService = inject(MealApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  mealId: string = "";
  items: RecognizedItem[] = [];
  loading = true;
  error = "";
  totalCalories = 0;
  overallConfidence = 0;
  showConfidenceDetails = false;

  async ngOnInit() {
    // Get mealId from route params
    this.mealId = this.route.snapshot.paramMap.get("mealId") || "";

    if (!this.mealId) {
      this.error = "Meal ID not provided";
      this.loading = false;
      return;
    }

    await this.recognizeMeal();
  }

  private async recognizeMeal() {
    try {
      const response = (await this.mealApiService
        .recognizeMeal(this.mealId)
        .toPromise()) as RecognitionResponse;

      if (!response) {
        this.error = "No response from recognition service";
        return;
      }

      if (
        response.status === "failed" ||
        response.recognizedItems.length === 0
      ) {
        this.error =
          response.message || "Couldn't recognize meal, please edit manually.";
        this.items = [];
      } else {
        this.items = response.recognizedItems;
        this.totalCalories = response.totalCalories;
        this.overallConfidence = response.confidence;
      }
    } catch (error: any) {
      console.error("Recognition failed:", error);
      this.error = "Recognition failed. Please try again or edit manually.";
    } finally {
      this.loading = false;
    }
  }

  toggleConfidenceDetails() {
    this.showConfidenceDetails = !this.showConfidenceDetails;
  }

  getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return "success";
    if (confidence >= 0.6) return "warning";
    return "danger";
  }

  getConfidenceIcon(confidence: number): string {
    if (confidence >= 0.8) return "✅";
    if (confidence >= 0.6) return "⚠️";
    return "❌";
  }

  getConfidencePercentage(confidence: number): string {
    return Math.round(confidence * 100) + "%";
  }

  editMeal() {
    // Navigate to edit screen (NU-003 - not implemented yet)
    this.router.navigate(["/nutrition/edit", this.mealId]);
  }

  acceptAndFinish() {
    // Mark meal as final and navigate back to nutrition list
    this.router.navigate(["/nutrition"]);
  }

  retryRecognition() {
    this.loading = true;
    this.error = "";
    this.recognizeMeal();
  }

  goBack() {
    this.router.navigate(["/nutrition"]);
  }
}
