import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ApiService } from "../services/api.service";
import {
  BiometricsService,
  WeightEntry,
  BPEntry,
  HREntry,
  PainEntry,
} from "../biometrics/biometrics.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  private biometricsService = inject(BiometricsService);

  apiStatus: "loading" | "ok" | "error" = "loading";
  apiStatusMessage = "Checking...";
  dailySummary: any = null;
  companionMessage: any = null;
  latestWeight: WeightEntry | null = null;
  latestBP: BPEntry | null = null;
  latestHR: HREntry | null = null;
  latestPain: PainEntry | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.checkApiHealth();
    this.loadDailySummary();
    this.loadCompanionMessage();
    this.loadLatestWeight();
    this.loadLatestBP();
    this.loadLatestHR();
    this.loadLatestPain();
  }

  async checkApiHealth() {
    this.apiStatus = "loading";
    this.apiStatusMessage = "Checking...";

    try {
      const response = await this.apiService.getHealth();
      if (response.status === "ok") {
        this.apiStatus = "ok";
        this.apiStatusMessage = "API is healthy";
      } else {
        this.apiStatus = "error";
        this.apiStatusMessage = "API returned unexpected status";
      }
    } catch (error) {
      this.apiStatus = "error";
      this.apiStatusMessage = "Failed to connect to API";
      console.error("Health check error:", error);
    }
  }

  async loadDailySummary() {
    try {
      this.dailySummary = await this.apiService.getDailySummary();
    } catch (error) {
      console.error("Failed to load daily summary:", error);
    }
  }

  async loadCompanionMessage() {
    try {
      this.companionMessage = await this.apiService.getCompanionMessage();
    } catch (error) {
      console.error("Failed to load companion message:", error);
    }
  }

  async loadLatestWeight() {
    try {
      this.latestWeight = await this.biometricsService.getLatestWeight();
    } catch (error) {
      console.error("Failed to load latest weight:", error);
    }
  }

  async loadLatestBP() {
    try {
      this.latestBP = await this.biometricsService.getLatestBP();
    } catch (error) {
      console.error("Failed to load latest blood pressure:", error);
    }
  }

  async loadLatestHR() {
    try {
      this.latestHR = await this.biometricsService.getLatestHR();
    } catch (error) {
      console.error("Failed to load latest heart rate:", error);
    }
  }

  async loadLatestPain() {
    try {
      this.latestPain = await this.biometricsService.getLatestPain();
    } catch (error) {
      console.error("Failed to load latest pain:", error);
    }
  }

  // Helper methods to check if biometric data is from today
  isTodayData(takenAt: string): boolean {
    const today = new Date().toDateString();
    const dataDate = new Date(takenAt).toDateString();
    return today === dataDate;
  }
}
