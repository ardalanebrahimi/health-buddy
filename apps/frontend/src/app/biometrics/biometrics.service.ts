import { Injectable } from "@angular/core";
import { HealthCompanionClient } from "health-companion-sdk";
import { BehaviorSubject } from "rxjs";

export interface WeightEntry {
  id: string;
  valueKg: number;
  takenAt: string;
  createdAt: string;
}

export interface LogWeightRequest {
  valueKg: number;
  takenAt?: string;
}

@Injectable({
  providedIn: "root",
})
export class BiometricsService {
  private client: HealthCompanionClient;

  // Local cache for latest weight
  private latestWeightSubject = new BehaviorSubject<WeightEntry | null>(null);
  public latestWeight$ = this.latestWeightSubject.asObservable();

  constructor() {
    this.client = new HealthCompanionClient("http://localhost:3000/api/v1");
    // Load latest weight on service initialization
    this.loadLatestWeight();
  }

  async logWeight(valueKg: number, takenAt?: string): Promise<WeightEntry> {
    try {
      const request: LogWeightRequest = {
        valueKg,
        takenAt: takenAt || new Date().toISOString(),
      };

      const response = await this.client.createWeightEntry(request);

      if (response) {
        // Update local cache
        this.latestWeightSubject.next(response);
        return response;
      }

      throw new Error("Failed to log weight");
    } catch (error) {
      // If offline, enqueue for sync (future implementation)
      console.error("Error logging weight:", error);
      throw error;
    }
  }

  async getLatestWeight(): Promise<WeightEntry | null> {
    try {
      const response = await this.client.getLatestWeight();

      if (response) {
        this.latestWeightSubject.next(response);
        return response;
      }

      return null;
    } catch (error) {
      console.error("Error getting latest weight:", error);
      return null;
    }
  }

  async getWeightEntries(
    startDate?: string,
    endDate?: string
  ): Promise<{ entries: WeightEntry[]; total: number }> {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await this.client.getWeightEntries(params);

      if (response) {
        return {
          entries: response.entries || [],
          total: response.total || 0,
        };
      }

      return { entries: [], total: 0 };
    } catch (error) {
      console.error("Error getting weight entries:", error);
      return { entries: [], total: 0 };
    }
  }

  private async loadLatestWeight(): Promise<void> {
    await this.getLatestWeight();
  }
}
