import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { ProfileService } from "./profile.service";

export const onboardingGuard: CanMatchFn = (route, segments) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // Check if profile is complete
  if (!profileService.isProfileComplete()) {
    // If we're not already on demographics page, redirect there
    const currentPath = "/" + segments.map((s) => s.path).join("/");
    if (currentPath !== "/onboarding/demographics") {
      router.navigateByUrl("/onboarding/demographics");
      return false;
    }
    return true;
  }

  // Profile is complete, allow access to next steps
  return true;
};

export const profileCompleteGuard: CanMatchFn = (route, segments) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // If profile is not complete, redirect to demographics
  if (!profileService.isProfileComplete()) {
    router.navigateByUrl("/onboarding/demographics");
    return false;
  }

  return true;
};
