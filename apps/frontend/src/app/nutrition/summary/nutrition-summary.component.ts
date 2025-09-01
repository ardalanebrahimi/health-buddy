import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MealApiService,
  NutritionSummary,
} from "../../services/meal-api.service";

@Component({
  selector: "app-nutrition-summary",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./nutrition-summary.component.html",
  styleUrls: ["./nutrition-summary.component.scss"],
})
export class NutritionSummaryComponent implements OnInit {
  private mealApi = inject(MealApiService);

  summary = signal<NutritionSummary | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async ngOnInit() {
    await this.loadSummary();
  }

  async loadSummary() {
    try {
      this.loading.set(true);
      this.error.set(null);

      const today = new Date().toISOString().split("T")[0];
      const summaryData = await this.mealApi.getSummary(today);

      this.summary.set(summaryData);
    } catch (error: any) {
      console.error("Error loading nutrition summary:", error);
      this.error.set(error?.message || "Failed to load nutrition summary");
    } finally {
      this.loading.set(false);
    }
  }

  async onRefresh() {
    await this.loadSummary();
  }

  getStatusPillClass(status: string): string {
    switch (status) {
      case "draft":
        return "status-draft";
      case "recognized":
        return "status-recognized";
      case "final":
        return "status-final";
      default:
        return "";
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case "draft":
        return "~";
      case "recognized":
        return "Recognized";
      case "final":
        return "Final";
      default:
        return status;
    }
  }

  formatTime(takenAt: string): string {
    return new Date(takenAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
}
