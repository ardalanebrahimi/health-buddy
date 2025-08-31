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

export interface WaistEntry {
  id: string;
  valueCm: number;
  takenAt: string;
  createdAt: string;
}

export interface LogWaistRequest {
  valueCm: number;
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

  // Local cache for latest waist circumference
  private latestWaistSubject = new BehaviorSubject<WaistEntry | null>(null);
  public latestWaist$ = this.latestWaistSubject.asObservable();

  constructor() {
    this.client = new HealthCompanionClient("http://localhost:3000/api/v1");
    // Load latest values on service initialization
    this.loadLatestWeight();
    this.loadLatestWaist();
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

  async logWaist(valueCm: number, takenAt?: string): Promise<WaistEntry> {
    try {
      const request: LogWaistRequest = {
        valueCm,
        takenAt: takenAt || new Date().toISOString(),
      };

      // Temporarily use a direct HTTP call until SDK is properly generated
      const response = await fetch(
        "http://localhost:3000/api/v1/biometrics/waist",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const waistEntry = await response.json();

      // Update local cache
      this.latestWaistSubject.next(waistEntry);
      return waistEntry;
    } catch (error) {
      // If offline, enqueue for sync (future implementation)
      console.error("Error logging waist circumference:", error);
      throw error;
    }
  }

  async getLatestWaist(): Promise<WaistEntry | null> {
    try {
      // Temporarily use a direct HTTP call until SDK is properly generated
      const response = await fetch(
        "http://localhost:3000/api/v1/biometrics/waist/latest"
      );

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const waistEntry = await response.json();
      this.latestWaistSubject.next(waistEntry);
      return waistEntry;
    } catch (error) {
      console.error("Error getting latest waist circumference:", error);
      return null;
    }
  }

  async getWaistEntries(
    startDate?: string,
    endDate?: string
  ): Promise<{ entries: WaistEntry[]; total: number }> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const url = `http://localhost:3000/api/v1/biometrics/waist${
        params.toString() ? "?" + params.toString() : ""
      }`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        entries: data.entries || [],
        total: data.total || 0,
      };
    } catch (error) {
      console.error("Error getting waist circumference entries:", error);
      return { entries: [], total: 0 };
    }
  }

  private async loadLatestWaist(): Promise<void> {
    await this.getLatestWaist();
  }
}
