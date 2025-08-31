import {
  inject,
  EnvironmentInjector,
  runInInjectionContext,
} from "@angular/core";
import { CanMatchFn, Router } from "@angular/router";
import { LockService } from "../services/lock.service";

export const lockGuard: CanMatchFn = async (route, segments) => {
  const injector = inject(EnvironmentInjector);

  return runInInjectionContext(injector, async () => {
    const lockService = inject(LockService);
    const router = inject(Router);

    // Check if PIN is set up
    const isSetup = await lockService.isSetup();

    // If PIN is not set up, redirect to setup
    if (!isSetup) {
      router.navigate(["/setup-pin"]);
      return false;
    }

    // Check if app should be locked (don't auto-refresh here to avoid frequent refreshes)
    const shouldLock = await lockService.shouldLock();

    if (shouldLock) {
      router.navigate(["/lock"], {
        queryParams: { returnUrl: segments.join("/") },
      });
      return false;
    }

    return true;
  });
};
