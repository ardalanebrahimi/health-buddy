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

  async updateProfile(data: any) {
    try {
      return await this.client.updateProfile(data);
    } catch (error) {
      console.error("Failed to update profile:", error);
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

  async getGoals() {
    try {
      return await this.client.getGoals();
    } catch (error) {
      console.error("Failed to get goals:", error);
      throw error;
    }
  }

  async updateGoals(data: any) {
    try {
      return await this.client.updateGoals(data);
    } catch (error) {
      console.error("Failed to update goals:", error);
      throw error;
    }
  }

  // Hydration endpoints
  async getHydration(params?: { date?: string }) {
    try {
      return await this.client.getHydration(params);
    } catch (error) {
      console.error("Failed to get hydration:", error);
      throw error;
    }
  }

  async createHydration(data: { amountMl: number; takenAt: string }) {
    try {
      return await this.client.createHydration(data);
    } catch (error) {
      console.error("Failed to create hydration:", error);
      throw error;
    }
  }

  async getHydrationSummary(date: string) {
    try {
      // For now, make a direct HTTP call since the SDK might not have this method yet
      const response = await this.client['client'].get(`/hydration/summary?date=${date}`);
      return response.data;
    } catch (error) {
      console.error("Failed to get hydration summary:", error);
      throw error;
    }
  }

  async deleteHydration(id: string) {
    try {
      // For now, make a direct HTTP call since the SDK might not have this method yet
      const response = await this.client['client'].delete(`/hydration/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete hydration:", error);
      throw error;
    }
  }
}
