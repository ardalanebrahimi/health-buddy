import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { SyncService } from "../../services/sync.service";
import { LocalMeal } from "../../services/local-database.service";

@Component({
  selector: "app-nutrition-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./nutrition-list.component.html",
  styleUrls: ["./nutrition-list.component.scss"],
})
export class NutritionListComponent implements OnInit {
  meals: LocalMeal[] = [];
  isLoading = true;
  pendingSyncCount = 0;
  isOnline = navigator.onLine;

  constructor(private syncService: SyncService, private router: Router) {}

  async ngOnInit() {
    await this.loadMeals();
    this.setupSyncStatusListener();
    this.setupNetworkListener();
  }

  private async loadMeals() {
    try {
      this.meals = await this.syncService.getMeals(20);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      this.isLoading = false;
    }
  }

  private setupSyncStatusListener() {
    this.syncService.isOnline$.subscribe((isOnline) => {
      this.isOnline = isOnline;
      // Reload meals when connectivity changes
      if (isOnline) {
        this.loadMeals();
      }
    });

    // Update pending sync count
    this.updatePendingSyncCount();
  }

  private setupNetworkListener() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  }

  trackByMealId(index: number, meal: LocalMeal): string {
    return meal.mealId || meal.id?.toString() || index.toString();
  }

  private async updatePendingSyncCount() {
    try {
      this.pendingSyncCount = await this.syncService.getPendingSyncCount();
    } catch (error) {
      console.error("Error getting pending sync count:", error);
    }
  }

  addMeal() {
    this.router.navigate(["/nutrition/add-meal"]);
  }

  async forceSyncAll() {
    try {
      await this.syncService.syncAll();
      await this.loadMeals();
      await this.updatePendingSyncCount();
    } catch (error) {
      console.error("Error syncing:", error);
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case "draft":
        return "Draft";
      case "pending_sync":
        return "Pending Sync";
      case "synced":
        return "Synced";
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case "draft":
        return "status-draft";
      case "pending_sync":
        return "status-pending";
      case "synced":
        return "status-synced";
      default:
        return "status-unknown";
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
