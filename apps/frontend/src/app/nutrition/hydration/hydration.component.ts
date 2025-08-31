import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HydrationService } from "../../services/hydration.service";

@Component({
  selector: "app-hydration",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./hydration.component.html",
  styleUrls: ["./hydration.component.scss"],
})
export class HydrationComponent implements OnInit {
  totalLiters = signal(0);
  isLoading = signal(false);
  lastEntryId = signal<string | null>(null);

  constructor(private hydrationService: HydrationService) {}

  async ngOnInit() {
    await this.refreshSummary();
  }

  async add(amountMl: number) {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    try {
      // Optimistic update
      const previousTotal = this.totalLiters();
      this.totalLiters.update((v) => v + amountMl / 1000);

      const entry = await this.hydrationService.addHydration(amountMl);
      this.lastEntryId.set(entry.id);

      // Refresh to get accurate total from server
      await this.refreshSummary();
    } catch (error) {
      // Rollback optimistic update on error
      this.totalLiters.update((v) => v - amountMl / 1000);
      console.error("Failed to add hydration:", error);
      // TODO: Show toast notification
    } finally {
      this.isLoading.set(false);
    }
  }

  async refreshSummary() {
    try {
      const today = new Date().toISOString().split("T")[0];
      const summary = await this.hydrationService.getHydrationSummary(today);
      this.totalLiters.set(summary.totalLiters);
    } catch (error) {
      console.error("Failed to refresh summary:", error);
      // TODO: Show toast notification
    }
  }

  async undo() {
    if (this.isLoading() || !this.lastEntryId()) return;

    this.isLoading.set(true);
    try {
      const entryId = this.lastEntryId();
      if (entryId) {
        await this.hydrationService.deleteHydration(entryId);
        this.lastEntryId.set(null);
        await this.refreshSummary();
      }
    } catch (error) {
      console.error("Failed to undo hydration:", error);
      // TODO: Show toast notification
    } finally {
      this.isLoading.set(false);
    }
  }

  formatLiters(liters: number): string {
    return liters.toFixed(1);
  }
}
