import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ApiService } from "../services/api.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  apiStatus: "loading" | "ok" | "error" = "loading";
  apiStatusMessage = "Checking...";
  dailySummary: any = null;
  companionMessage: any = null;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.checkApiHealth();
    this.loadDailySummary();
    this.loadCompanionMessage();
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
}
