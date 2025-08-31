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

export interface BPEntry {
  id: string;
  systolic: number;
  diastolic: number;
  pulse: number;
  takenAt: string;
  createdAt: string;
}

export interface LogBPRequest {
  systolic: number;
  diastolic: number;
  pulse: number;
  takenAt?: string;
}

export interface HREntry {
  id: string;
  bpm: number;
  takenAt: string;
  createdAt: string;
}

export interface LogHRRequest {
  bpm: number;
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

  // Local cache for latest BP
  private latestBPSubject = new BehaviorSubject<BPEntry | null>(null);
  public latestBP$ = this.latestBPSubject.asObservable();

  // Local cache for latest HR
  private latestHRSubject = new BehaviorSubject<HREntry | null>(null);
  public latestHR$ = this.latestHRSubject.asObservable();

  constructor() {
    this.client = new HealthCompanionClient("http://localhost:3000/api/v1");
    // Load latest values on service initialization
    this.loadLatestWeight();
    this.loadLatestWaist();
    this.loadLatestBP();
    this.loadLatestHR();
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

  // Blood Pressure methods
  async logBP(data: LogBPRequest): Promise<BPEntry> {
    try {
      const result = await this.client.createBPEntry(data);
      // Update latest BP cache if this entry is more recent
      await this.loadLatestBP();
      return result;
    } catch (error) {
      console.error("Error logging blood pressure:", error);
      throw error;
    }
  }

  async getRecentBP(limit: number = 10): Promise<BPEntry[]> {
    try {
      const result = await this.client.getRecentBP({ limit });
      return result;
    } catch (error) {
      console.error("Error getting recent blood pressure:", error);
      return [];
    }
  }

  async getLatestBP(): Promise<BPEntry | null> {
    try {
      const recent = await this.getRecentBP(1);
      const latest = recent.length > 0 ? recent[0] : null;
      this.latestBPSubject.next(latest);
      return latest;
    } catch (error) {
      console.error("Error getting latest blood pressure:", error);
      return null;
    }
  }

  // Heart Rate methods
  async logHR(data: LogHRRequest): Promise<HREntry> {
    try {
      const result = await this.client.createHREntry(data);
      // Update latest HR cache if this entry is more recent
      await this.loadLatestHR();
      return result;
    } catch (error) {
      console.error("Error logging heart rate:", error);
      throw error;
    }
  }

  async getRecentHR(limit: number = 10): Promise<HREntry[]> {
    try {
      const result = await this.client.getRecentHR({ limit });
      return result;
    } catch (error) {
      console.error("Error getting recent heart rate:", error);
      return [];
    }
  }

  async getLatestHR(): Promise<HREntry | null> {
    try {
      const recent = await this.getRecentHR(1);
      const latest = recent.length > 0 ? recent[0] : null;
      this.latestHRSubject.next(latest);
      return latest;
    } catch (error) {
      console.error("Error getting latest heart rate:", error);
      return null;
    }
  }

  private async loadLatestBP(): Promise<void> {
    await this.getLatestBP();
  }

  private async loadLatestHR(): Promise<void> {
    await this.getLatestHR();
  }
}
