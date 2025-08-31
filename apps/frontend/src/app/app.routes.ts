import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { lockGuard } from "./auth-lock/guards/lock.guard";
import {
  onboardingGuard,
  profileCompleteGuard,
} from "./onboarding/onboarding.guard";

export const routes: Routes = [
  // Auth routes (no guard needed)
  {
    path: "setup-pin",
    loadComponent: () =>
      import("./auth-lock/components/pin-setup/pin-setup.component").then(
        (m) => m.PinSetupComponent
      ),
  },
  {
    path: "lock",
    loadComponent: () =>
      import("./auth-lock/components/lock-screen/lock-screen.component").then(
        (m) => m.LockScreenComponent
      ),
  },
  {
    path: "settings/security",
    loadComponent: () =>
      import(
        "./auth-lock/components/settings-lock/settings-lock.component"
      ).then((m) => m.SettingsLockComponent),
    canMatch: [lockGuard],
  },

  // Onboarding routes (require unlock but not complete profile)
  {
    path: "onboarding/demographics",
    loadComponent: () =>
      import("./onboarding/demographics/demographics.component").then(
        (m) => m.DemographicsComponent
      ),
    canMatch: [lockGuard, onboardingGuard],
  },
  {
    path: "onboarding/baseline",
    loadComponent: () =>
      import("./onboarding/baseline/baseline.component").then(
        (m) => m.BaselineComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "onboarding/goals",
    loadComponent: () =>
      import("./onboarding/goals/goals.component").then(
        (m) => m.GoalsComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },

  // Protected routes (require unlock and complete profile)
  {
    path: "",
    component: HomeComponent,
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "nutrition",
    loadComponent: () =>
      import("./nutrition/nutrition-list/nutrition-list.component").then(
        (m) => m.NutritionListComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "nutrition/add-meal",
    loadComponent: () =>
      import("./nutrition/add-meal/meal-photo.component").then(
        (m) => m.MealPhotoComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "nutrition/manual-meal",
    loadComponent: () =>
      import("./nutrition/manual-meal/manual-meal.component").then(
        (m) => m.ManualMealComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "nutrition/recognition/:mealId",
    loadComponent: () =>
      import("./nutrition/recognition/meal-recognition.component").then(
        (m) => m.MealRecognitionComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },
  {
    path: "nutrition/edit/:mealId",
    loadComponent: () =>
      import("./nutrition/edit-meal/meal-edit.component").then(
        (m) => m.MealEditComponent
      ),
    canMatch: [lockGuard, profileCompleteGuard],
  },

  // Redirect unknown routes to home
  {
    path: "**",
    redirectTo: "",
  },
];
