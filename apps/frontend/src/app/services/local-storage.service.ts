import { Injectable } from "@angular/core";
import Dexie, { Table } from "dexie";

export interface LocalMeal {
  id?: number;
  mealId?: string; // Server ID once synced
  photoPath: string;
  takenAt?: string;
  notes?: string;
  status: "draft" | "pending_sync" | "synced";
  createdAt: string;
  syncAttempts: number;
  lastSyncAttempt?: string;
  errorMessage?: string;
}

export interface SyncQueueItem {
  id?: number;
  type: "meal_photo_upload";
  method: string;
  path: string;
  data: any;
  attempts: number;
  lastAttempt?: string;
  error?: string;
  createdAt: string;
}

@Injectable({
  providedIn: "root",
})
export class LocalStorageService extends Dexie {
  meals!: Table<LocalMeal>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("HealthCompanionDB");

    this.version(1).stores({
      meals: "++id, mealId, status, createdAt",
      syncQueue: "++id, type, attempts, createdAt",
    });
  }

  async saveMeal(
    meal: Omit<LocalMeal, "id" | "createdAt" | "syncAttempts">
  ): Promise<LocalMeal> {
    const localMeal: LocalMeal = {
      ...meal,
      createdAt: new Date().toISOString(),
      syncAttempts: 0,
    };

    const id = await this.meals.add(localMeal);
    return { ...localMeal, id };
  }

  async updateMeal(id: number, updates: Partial<LocalMeal>): Promise<void> {
    await this.meals.update(id, updates);
  }

  async getMeals(limit: number = 20): Promise<LocalMeal[]> {
    return await this.meals
      .orderBy("createdAt")
      .reverse()
      .limit(limit)
      .toArray();
  }

  async getPendingSyncMeals(): Promise<LocalMeal[]> {
    return await this.meals.where("status").equals("pending_sync").toArray();
  }

  async enqueueSyncItem(
    item: Omit<SyncQueueItem, "id" | "attempts" | "createdAt">
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    await this.syncQueue.add(queueItem);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return await this.syncQueue
      .where("attempts")
      .below(3) // Max 3 retry attempts
      .toArray();
  }

  async updateSyncItem(
    id: number,
    updates: Partial<SyncQueueItem>
  ): Promise<void> {
    await this.syncQueue.update(id, updates);
  }

  async removeSyncItem(id: number): Promise<void> {
    await this.syncQueue.delete(id);
  }

  async clearOldSyncItems(): Promise<void> {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    await this.syncQueue
      .where("createdAt")
      .below(weekAgo.toISOString())
      .delete();
  }
}
