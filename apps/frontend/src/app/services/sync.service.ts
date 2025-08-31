import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { MealApiService } from "./meal-api.service";
import { localDb, SyncQueueItem, LocalMeal } from "./local-database.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SyncService {
  private isOnlineSubject = new BehaviorSubject<boolean>(navigator.onLine);
  public isOnline$ = this.isOnlineSubject.asObservable();

  private isSyncingSubject = new BehaviorSubject<boolean>(false);
  public isSyncing$ = this.isSyncingSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private mealApiService: MealApiService
  ) {
    this.setupConnectivityListeners();
    this.startPeriodicSync();
  }

  private setupConnectivityListeners(): void {
    window.addEventListener("online", () => {
      this.isOnlineSubject.next(true);
      this.syncAll();
    });

    window.addEventListener("offline", () => {
      this.isOnlineSubject.next(false);
    });
  }

  private startPeriodicSync(): void {
    // Sync every 30 seconds when online
    setInterval(() => {
      if (navigator.onLine && !this.isSyncingSubject.value) {
        this.syncAll();
      }
    }, 30000);
  }

  async enqueueSync(
    item: Omit<SyncQueueItem, "id" | "retryCount" | "timestamp">
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      ...item,
      id: this.generateUuid(),
      timestamp: new Date().toISOString(),
      retryCount: 0,
    };

    await localDb.syncQueue.add(queueItem);
    console.log("Enqueued sync item:", queueItem);

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncAll();
    }
  }

  async syncAll(): Promise<void> {
    if (this.isSyncingSubject.value || !navigator.onLine) {
      return;
    }

    this.isSyncingSubject.next(true);
    console.log("Starting sync process...");

    try {
      const queueItems = await localDb.syncQueue.orderBy("timestamp").toArray();

      for (const item of queueItems) {
        try {
          await this.syncItem(item);
          await localDb.syncQueue.delete(item.id);
          console.log("Successfully synced item:", item.id);
        } catch (error) {
          console.error("Failed to sync item:", item.id, error);

          // Increment retry count
          await localDb.syncQueue.update(item.id, {
            retryCount: item.retryCount + 1,
            lastError: error instanceof Error ? error.message : "Unknown error",
          });

          // Remove from queue if too many retries
          if (item.retryCount >= 3) {
            console.warn("Removing item after 3 failed retries:", item.id);
            await localDb.syncQueue.delete(item.id);
          }
        }
      }
    } finally {
      this.isSyncingSubject.next(false);
      console.log("Sync process completed");
    }
  }

  private async syncItem(item: SyncQueueItem): Promise<void> {
    console.log(`Syncing ${item.method} ${item.path}:`, item.body);

    switch (item.path) {
      case "/profile":
        if (item.method === "POST") {
          await this.apiService.createProfile(item.body);
          return;
        } else if (item.method === "PUT") {
          await this.apiService.updateProfile(item.body);
          return;
        }
        break;

      case "/profile/baseline":
        if (item.method === "PATCH") {
          await this.apiService.updateBaseline(item.body);
          return;
        }
        break;

      case "/goals":
        if (item.method === "PUT") {
          await this.apiService.updateGoals(item.body);
          return;
        }
        break;

      case "/meals/photo":
        if (item.method === "POST") {
          await this.syncMealPhoto(item.body);
          return;
        }
        break;

      default:
        throw new Error(`Unknown sync path: ${item.path}`);
    }

    throw new Error(`Unsupported method ${item.method} for path ${item.path}`);
  }

  private generateUuid(): string {
    return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async getPendingSyncCount(): Promise<number> {
    return await localDb.syncQueue.count();
  }

  async clearQueue(): Promise<void> {
    await localDb.syncQueue.clear();
  }

  // Meal-specific methods
  async saveMealLocally(
    photoPath: string,
    takenAt?: string,
    notes?: string
  ): Promise<LocalMeal> {
    const localMeal: LocalMeal = {
      photoPath,
      takenAt,
      notes,
      status: "draft",
      createdAt: new Date().toISOString(),
      syncAttempts: 0,
    };

    const id = await localDb.meals.add(localMeal);
    return { ...localMeal, id };
  }

  async enqueueMealPhotoUpload(localMeal: LocalMeal): Promise<void> {
    // Update meal status to pending sync
    await localDb.meals.update(localMeal.id!, { status: "pending_sync" });

    // Add to sync queue
    await this.enqueueSync({
      method: "POST",
      path: "/meals/photo",
      body: {
        localMealId: localMeal.id,
        photoPath: localMeal.photoPath,
        takenAt: localMeal.takenAt,
        notes: localMeal.notes,
      },
    });
  }

  // NU-004: Enqueue manual meal creation for offline sync
  async enqueueMealCreate(mealData: { takenAt: string; items: { name: string; portionGrams: number }[] }): Promise<void> {
    // Create a local meal record
    const localMeal: LocalMeal = {
      photoPath: '', // No photo for manual meals
      takenAt: mealData.takenAt,
      notes: `Manual meal: ${mealData.items.length} items`,
      status: 'pending_sync',
      createdAt: new Date().toISOString(),
      syncAttempts: 0,
    };

    const id = await localDb.meals.add(localMeal);

    // Add to sync queue
    await this.enqueueSync({
      method: "POST",
      path: "/meals",
      body: {
        localMealId: id,
        ...mealData,
      },
    });
  }

  private async syncMealPhoto(body: any): Promise<void> {
    const { localMealId, photoPath, takenAt, notes } = body;

    try {
      // Convert photo path to blob
      const blob = await this.mealApiService.convertWebPathToBlob(photoPath);

      // Upload to server
      const response = await this.mealApiService
        .uploadMealPhoto(blob, takenAt, notes)
        .toPromise();

      if (response) {
        // Update local meal with server data
        await localDb.meals.update(localMealId, {
          mealId: response.mealId,
          status: "synced",
        });
      }
    } catch (error) {
      // Update sync attempts
      const meal = await localDb.meals.get(localMealId);
      if (meal) {
        await localDb.meals.update(localMealId, {
          syncAttempts: meal.syncAttempts + 1,
          lastSyncAttempt: new Date().toISOString(),
          errorMessage:
            error instanceof Error ? error.message : "Unknown error",
        });
      }
      throw error;
    }
  }

  async getMeals(limit: number = 20): Promise<LocalMeal[]> {
    return await localDb.meals
      .orderBy("createdAt")
      .reverse()
      .limit(limit)
      .toArray();
  }

  async getPendingSyncMeals(): Promise<LocalMeal[]> {
    return await localDb.meals.where("status").equals("pending_sync").toArray();
  }
}
