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

  // Protected routes (require unlock and complete profile)
  {
    path: "",
    component: HomeComponent,
    canMatch: [lockGuard, profileCompleteGuard],
  },

  // Redirect unknown routes to home
  {
    path: "**",
    redirectTo: "",
  },
];
