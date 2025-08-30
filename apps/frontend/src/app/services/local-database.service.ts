import Dexie, { Table } from "dexie";

export interface LocalProfile {
  id: string;
  data: any; // ProfileDto
  pending_sync: boolean;
  lastUpdated: string; // ISO string
}

export interface LocalGoals {
  id: string;
  data: any; // GoalsDto
  pending_sync: boolean;
  lastUpdated: string; // ISO string
}

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
  id: string;
  method: "POST" | "PUT" | "PATCH";
  path: string;
  body: any;
  timestamp: string;
  retryCount: number;
  lastError?: string;
}

export class LocalDatabase extends Dexie {
  profiles!: Table<LocalProfile>;
  goals!: Table<LocalGoals>;
  meals!: Table<LocalMeal>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("HealthBuddyLocalDB");

    this.version(2).stores({
      profiles: "id, pending_sync, lastUpdated",
      goals: "id, pending_sync, lastUpdated",
      meals: "++id, mealId, status, createdAt",
      syncQueue: "id, timestamp, retryCount",
    });
  }
}

export const localDb = new LocalDatabase();
