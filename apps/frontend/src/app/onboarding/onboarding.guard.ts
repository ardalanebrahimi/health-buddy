import { inject } from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { ProfileService } from "./profile.service";

export const onboardingGuard: CanMatchFn = async (route, segments) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // This guard allows access to onboarding pages for editing profile
  // It only redirects if the user hasn't completed onboarding AND doesn't have a complete profile
  const isOnboardingComplete = await profileService.isOnboardingComplete();
  const isProfileComplete = profileService.isProfileComplete();

  // If onboarding is marked complete, always allow access (for editing)
  if (isOnboardingComplete) {
    return true;
  }

  // If onboarding is not complete but profile exists, they can continue onboarding
  if (isProfileComplete) {
    return true;
  }

  // If neither complete, they need to start from demographics
  const currentPath = "/" + segments.map((s) => s.path).join("/");
  if (currentPath !== "/onboarding/demographics") {
    router.navigateByUrl("/onboarding/demographics");
    return false;
  }

  return true;
};

export const profileCompleteGuard: CanMatchFn = async (route, segments) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  // Check if onboarding is complete first
  const isOnboardingComplete = await profileService.isOnboardingComplete();

  // If onboarding is complete, allow access to main app
  if (isOnboardingComplete) {
    return true;
  }

  // If onboarding is not complete, redirect to demographics
  router.navigateByUrl("/onboarding/demographics");
  return false;
};
