import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { lockGuard } from "./auth-lock/guards/lock.guard";

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

  // Protected routes (require unlock)
  {
    path: "",
    component: HomeComponent,
    canMatch: [lockGuard],
  },

  // Redirect unknown routes to home
  {
    path: "**",
    redirectTo: "",
  },
];
