import { Injectable } from "@angular/core";
import { ApiService } from "../services/api.service";
import { SyncService } from "../services/sync.service";
import {
  localDb,
  LocalProfile,
  LocalGoals,
} from "../services/local-database.service";
import { BehaviorSubject } from "rxjs";
import { Preferences } from "@capacitor/preferences";

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

export interface GoalsDto {
  weightGoalKg: number;
  sleepHoursTarget: number;
  painTarget?: number;
  updatedAt: string;
}

export interface UpdateGoalsDto {
  weightGoalKg: number;
  sleepHoursTarget: number;
  painTarget?: number;
}

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  private profileSubject = new BehaviorSubject<ProfileDto | null>(null);
  public profile$ = this.profileSubject.asObservable();

  private goalsSubject = new BehaviorSubject<GoalsDto | null>(null);
  public goals$ = this.goalsSubject.asObservable();

  private readonly PROFILE_ID = "current";
  private readonly GOALS_ID = "current";
  private readonly ONBOARDING_COMPLETE_KEY = "onboarding_complete";
  private onboardingCompleteCache: boolean | null = null;

  constructor(
    private apiService: ApiService,
    private syncService: SyncService
  ) {
    this.loadLocalMirrors();
    this.setupSyncTriggers();
    this.initializeOnboardingStatus();
  }

  private async initializeOnboardingStatus(): Promise<void> {
    // Load onboarding status on service initialization
    this.onboardingCompleteCache = await this.isOnboardingComplete();
  }

  private async loadLocalMirrors(): Promise<void> {
    // Load profile from local storage
    const localProfile = await localDb.profiles.get(this.PROFILE_ID);
    if (localProfile) {
      this.profileSubject.next(localProfile.data);
    }

    // Load goals from local storage
    const localGoals = await localDb.goals.get(this.GOALS_ID);
    if (localGoals) {
      this.goalsSubject.next(localGoals.data);
    }
  }

  private setupSyncTriggers(): void {
    // When online, try to sync and refresh local data
    this.syncService.isOnline$.subscribe((isOnline) => {
      if (isOnline) {
        this.syncFromServer();
      }
    });
  }

  private async syncFromServer(): Promise<void> {
    try {
      // Sync profile
      const serverProfile = await this.apiService.getProfile();
      if (serverProfile) {
        await this.updateLocalProfile(serverProfile as ProfileDto, false);
        this.profileSubject.next(serverProfile as ProfileDto);
      }
    } catch (error) {
      console.warn("Failed to sync profile from server:", error);
    }

    try {
      // Sync goals
      const serverGoals = await this.apiService.getGoals();
      if (serverGoals) {
        await this.updateLocalGoals(serverGoals as GoalsDto, false);
        this.goalsSubject.next(serverGoals as GoalsDto);
      }
    } catch (error) {
      console.warn("Failed to sync goals from server:", error);
    }
  }

  async getProfile(): Promise<ProfileDto | null> {
    const localProfile = await localDb.profiles.get(this.PROFILE_ID);

    // If online, try to get fresh data from server
    if (navigator.onLine) {
      try {
        const serverProfile = await this.apiService.getProfile();
        if (serverProfile) {
          const typedProfile = serverProfile as ProfileDto;
          await this.updateLocalProfile(typedProfile, false);
          this.profileSubject.next(typedProfile);
          return typedProfile;
        }
      } catch (error) {
        console.warn(
          "Failed to fetch profile from server, using local mirror:",
          error
        );
      }
    }

    return localProfile?.data || null;
  }

  async saveProfile(dto: CreateProfileDto): Promise<void> {
    const tempProfile: ProfileDto = {
      id: "temp-" + this.generateUuid(),
      userId: "single-user-v1",
      ...dto,
      baselineJson: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const serverProfile = await this.apiService.createProfile(dto);
        const typedProfile = serverProfile as ProfileDto;
        await this.updateLocalProfile(typedProfile, false);
        this.profileSubject.next(typedProfile);
        return;
      } catch (error) {
        console.warn(
          "Failed to save profile to server, queuing for sync:",
          error
        );
      }
    }

    // Offline or failed - store locally and queue for sync
    await this.updateLocalProfile(tempProfile, true);
    this.profileSubject.next(tempProfile);

    await this.syncService.enqueueSync({
      method: "POST",
      path: "/profile",
      body: dto,
    });
  }

  async updateBaseline(dto: UpdateBaselineDto): Promise<void> {
    if (navigator.onLine) {
      try {
        const updatedProfile = await this.apiService.updateBaseline(dto);
        if (updatedProfile) {
          const typedProfile = updatedProfile as ProfileDto;
          await this.updateLocalProfile(typedProfile, false);
          this.profileSubject.next(typedProfile);
          return;
        }
      } catch (error) {
        console.warn(
          "Failed to update baseline on server, queuing for sync:",
          error
        );
      }
    }

    // Offline or failed - update locally and queue for sync
    const currentProfile = await this.getProfile();
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

      await this.updateLocalProfile(updatedProfile, true);
      this.profileSubject.next(updatedProfile);
    }

    await this.syncService.enqueueSync({
      method: "PATCH",
      path: "/profile/baseline",
      body: dto,
    });
  }

  async getGoals(): Promise<GoalsDto | null> {
    const localGoals = await localDb.goals.get(this.GOALS_ID);

    // If online, try to get fresh data from server
    if (navigator.onLine) {
      try {
        const serverGoals = await this.apiService.getGoals();
        if (serverGoals) {
          const typedGoals = serverGoals as GoalsDto;
          await this.updateLocalGoals(typedGoals, false);
          this.goalsSubject.next(typedGoals);
          return typedGoals;
        }
      } catch (error) {
        console.warn(
          "Failed to fetch goals from server, using local mirror:",
          error
        );
      }
    }

    return localGoals?.data || null;
  }

  async saveGoals(dto: UpdateGoalsDto): Promise<GoalsDto> {
    const optimisticGoals: GoalsDto = {
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    if (navigator.onLine) {
      try {
        const serverGoals = await this.apiService.updateGoals(dto);
        const typedGoals = serverGoals as GoalsDto;
        await this.updateLocalGoals(typedGoals, false);
        this.goalsSubject.next(typedGoals);
        return typedGoals;
      } catch (error) {
        console.warn(
          "Failed to save goals to server, queuing for sync:",
          error
        );
      }
    }

    // Offline or failed - store locally and queue for sync
    await this.updateLocalGoals(optimisticGoals, true);
    this.goalsSubject.next(optimisticGoals);

    await this.syncService.enqueueSync({
      method: "PUT",
      path: "/goals",
      body: dto,
    });

    return optimisticGoals;
  }

  private async updateLocalProfile(
    profile: ProfileDto,
    pendingSync: boolean
  ): Promise<void> {
    const localProfile: LocalProfile = {
      id: this.PROFILE_ID,
      data: profile,
      pending_sync: pendingSync,
      lastUpdated: new Date().toISOString(),
    };

    await localDb.profiles.put(localProfile);
  }

  private async updateLocalGoals(
    goals: GoalsDto,
    pendingSync: boolean
  ): Promise<void> {
    const localGoals: LocalGoals = {
      id: this.GOALS_ID,
      data: goals,
      pending_sync: pendingSync,
      lastUpdated: new Date().toISOString(),
    };

    await localDb.goals.put(localGoals);
  }

  isProfileComplete(): boolean {
    const profile = this.profileSubject.value;
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

  async isOnboardingComplete(): Promise<boolean> {
    // Use cache if available to avoid repeated async calls
    if (this.onboardingCompleteCache !== null) {
      return this.onboardingCompleteCache;
    }

    try {
      const { value } = await Preferences.get({
        key: this.ONBOARDING_COMPLETE_KEY,
      });
      const isComplete = value === "true";
      this.onboardingCompleteCache = isComplete;
      return isComplete;
    } catch (error) {
      console.warn("Failed to check onboarding completion status:", error);
      this.onboardingCompleteCache = false;
      return false;
    }
  }

  async markOnboardingComplete(): Promise<void> {
    try {
      await Preferences.set({
        key: this.ONBOARDING_COMPLETE_KEY,
        value: "true",
      });
      this.onboardingCompleteCache = true; // Update cache
      console.log("Onboarding marked as complete");
    } catch (error) {
      console.error("Failed to mark onboarding complete:", error);
    }
  }

  // For testing/debugging - reset onboarding status
  async resetOnboarding(): Promise<void> {
    try {
      await Preferences.remove({ key: this.ONBOARDING_COMPLETE_KEY });
      this.onboardingCompleteCache = false;
      console.log("Onboarding status reset");
    } catch (error) {
      console.error("Failed to reset onboarding:", error);
    }
  }

  async getProfileSyncStatus(): Promise<boolean> {
    const localProfile = await localDb.profiles.get(this.PROFILE_ID);
    return localProfile?.pending_sync || false;
  }

  async getGoalsSyncStatus(): Promise<boolean> {
    const localGoals = await localDb.goals.get(this.GOALS_ID);
    return localGoals?.pending_sync || false;
  }

  private generateUuid(): string {
    return "xxxx-xxxx-4xxx-yxxx".replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  // For migration from old localStorage-based approach
  private async migrateOldData(): Promise<void> {
    try {
      const oldProfile = localStorage.getItem("health-buddy-profile");
      if (oldProfile) {
        const profileData = JSON.parse(oldProfile);
        await this.updateLocalProfile(profileData, false);
        localStorage.removeItem("health-buddy-profile");
      }

      const oldGoals = localStorage.getItem("health-buddy-goals");
      if (oldGoals) {
        const goalsData = JSON.parse(oldGoals);
        await this.updateLocalGoals(goalsData, false);
        localStorage.removeItem("health-buddy-goals");
      }
    } catch (error) {
      console.warn("Failed to migrate old data:", error);
    }
  }
}
