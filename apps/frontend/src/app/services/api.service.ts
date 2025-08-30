import { Injectable } from "@angular/core";
import { HealthCompanionClient } from "health-companion-sdk";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private client: HealthCompanionClient;

  constructor() {
    this.client = new HealthCompanionClient("http://localhost:3000/api/v1");
  }

  async getHealth() {
    try {
      return await this.client.getHealth();
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  }

  async getDailySummary(date?: string) {
    try {
      return await this.client.getDailySummary({ date });
    } catch (error) {
      console.error("Failed to get daily summary:", error);
      throw error;
    }
  }

  async getProfile() {
    try {
      return await this.client.getProfile();
    } catch (error) {
      console.error("Failed to get profile:", error);
      throw error;
    }
  }

  async createProfile(data: any) {
    try {
      return await this.client.createProfile(data);
    } catch (error) {
      console.error("Failed to create profile:", error);
      throw error;
    }
  }

  async updateBaseline(data: any) {
    try {
      return await this.client.updateBaseline(data);
    } catch (error) {
      console.error("Failed to update baseline:", error);
      throw error;
    }
  }

  async getNutritionSummary(date?: string, period?: "daily" | "weekly") {
    try {
      return await this.client.getNutritionSummary({ date, period });
    } catch (error) {
      console.error("Failed to get nutrition summary:", error);
      throw error;
    }
  }

  async getCompanionMessage(date?: string) {
    try {
      return await this.client.getDailyCompanionMessage({ date });
    } catch (error) {
      console.error("Failed to get companion message:", error);
      throw error;
    }
  }
}
