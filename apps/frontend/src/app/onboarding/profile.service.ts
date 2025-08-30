import { Injectable } from "@angular/core";
import { ApiService } from "../services/api.service";
import { BehaviorSubject } from "rxjs";

export interface ProfileDto {
  id: string;
  userId: string;
  age: number;
  sex: "M" | "F" | "Other";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
  baselineJson?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileDto {
  age: number;
  sex: "M" | "F" | "Other";
  heightCm: number;
  weightKg: number;
  activityLevel: "sedentary" | "light" | "moderate" | "active";
}

export interface UpdateBaselineDto {
  conditions?: string[];
  painAreas?: string[];
  notes?: string | null;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<ProfileDto | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private readonly LOCAL_STORAGE_KEY = "health-buddy-profile";
  private syncQueue: any[] = [];

  constructor(private apiService: ApiService) {
    this.loadLocalMirror();
  }

  async getProfile(): Promise<ProfileDto | null> {
    try {
      const profile = await this.apiService.getProfile();
      if (profile) {
        const typedProfile = profile as ProfileDto;
        await this.setLocalMirror(typedProfile);
        this.profileSubject.next(typedProfile);
        return typedProfile;
      }
      return null;
    } catch (error) {
      console.warn("Failed to fetch profile from server, using local mirror");
      return this.getLocalMirror();
    }
  }

  async saveProfile(dto: CreateProfileDto): Promise<void> {
    try {
      const profile = await this.apiService.createProfile(dto);
      const typedProfile = profile as ProfileDto;
      await this.setLocalMirror(typedProfile);
      this.profileSubject.next(typedProfile);
    } catch (error) {
      console.warn("Failed to save profile to server, queuing for sync");
      // Offline → enqueue for sync
      await this.enqueueSync({
        method: "POST",
        path: "/profile",
        body: dto,
        idempotencyKey: this.generateUuid(),
      });

      // Optimistic update - create a temporary profile for local use
      const tempProfile: ProfileDto = {
        id: "temp-" + this.generateUuid(),
        userId: "single-user-v1",
        ...dto,
        baselineJson: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.setLocalMirror(tempProfile);
      this.profileSubject.next(tempProfile);
    }
  }

  async updateBaseline(dto: UpdateBaselineDto): Promise<void> {
    try {
      const updatedProfile = await this.apiService.updateBaseline(dto);
      if (updatedProfile) {
        const typedProfile = updatedProfile as ProfileDto;
        await this.setLocalMirror(typedProfile);
        this.profileSubject.next(typedProfile);
      }
    } catch (error) {
      console.error(
        "Failed to update baseline, enqueueing for later sync:",
        error
      );

      // Update local mirror with baseline data
      const currentProfile = this.getLocalMirror();
      if (currentProfile) {
        const updatedProfile = {
          ...currentProfile,
          baselineJson: {
            conditions: dto.conditions || [],
            painAreas: dto.painAreas || [],
            notes: dto.notes || null,
          },
          updatedAt: new Date().toISOString(),
        };

        await this.setLocalMirror(updatedProfile);
        this.profileSubject.next(updatedProfile);
      }

      // Queue for sync when online
      await this.enqueueSync({
        type: "updateBaseline",
        data: dto,
        timestamp: new Date().toISOString(),
      });
    }
  }

  isProfileComplete(): boolean {
    const profile = this.getLocalMirror();
    return (
      profile !== null &&
      !!profile.age &&
      profile.age > 0 &&
      !!profile.sex &&
      !!profile.heightCm &&
      profile.heightCm > 0 &&
      !!profile.weightKg &&
      profile.weightKg > 0 &&
      !!profile.activityLevel
    );
  }

  private getLocalMirror(): ProfileDto | null {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private async setLocalMirror(profile: ProfileDto): Promise<void> {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Failed to save profile to local storage:", error);
    }
  }

  private loadLocalMirror(): void {
    const profile = this.getLocalMirror();
    if (profile) {
      this.profileSubject.next(profile);
    }
  }

  private async enqueueSync(item: any): Promise<void> {
    // Simple sync queue implementation
    this.syncQueue.push(item);
    localStorage.setItem(
      "health-buddy-sync-queue",
      JSON.stringify(this.syncQueue)
    );
  }

  private generateUuid(): string {
    return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // TODO: Implement sync replay when online
  async replaySyncQueue(): Promise<void> {
    // This would be called when the app comes back online
    // For now, just clear the queue
    this.syncQueue = [];
    localStorage.removeItem("health-buddy-sync-queue");
  }
}
