import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

export interface HydrationEntry {
  id: string;
  amountMl: number;
  type: string;
  takenAt: string;
  createdAt: string;
}

export interface HydrationSummary {
  date: string;
  totalLiters: number;
}

export interface CreateHydrationRequest {
  amountMl: number;
  takenAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class HydrationService {
  constructor(private apiService: ApiService) {}

  async addHydration(amountMl: number): Promise<HydrationEntry> {
    try {
      const takenAt = new Date().toISOString();
      return await this.apiService.createHydration({
        amountMl,
        takenAt,
      });
    } catch (error) {
      console.error('Failed to add hydration:', error);
      throw error;
    }
  }

  async getHydrationSummary(date: string): Promise<HydrationSummary> {
    try {
      return await this.apiService.getHydrationSummary(date);
    } catch (error) {
      console.error('Failed to get hydration summary:', error);
      throw error;
    }
  }

  async deleteHydration(id: string): Promise<void> {
    try {
      return await this.apiService.deleteHydration(id);
    } catch (error) {
      console.error('Failed to delete hydration:', error);
      throw error;
    }
  }

  async getLastHydrationEntry(): Promise<HydrationEntry | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.apiService.getHydration({ date: today });
      
      if (response.entries && response.entries.length > 0) {
        // Return the most recent entry (they should be sorted by takenAt desc)
        return response.entries[0];
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get last hydration entry:', error);
      throw error;
    }
  }
}
