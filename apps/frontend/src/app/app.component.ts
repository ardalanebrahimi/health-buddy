import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterOutlet, Router } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LockService } from "./auth-lock/services/lock.service";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  title = "Health Companion";

  private appStateListener?: any;
  private visibilityListener?: () => void;
  private idleTimer?: number;
  private lastActivity = Date.now();

  constructor(private lockService: LockService, private router: Router) {}

  async ngOnInit() {
    await this.setupLifecycleListeners();
    this.setupIdleDetection();
    await this.checkInitialLockState();
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private async setupLifecycleListeners() {
    // Only set up native listeners on mobile platforms
    if (Capacitor.isNativePlatform()) {
      // Listen for app state changes (background/foreground)
      this.appStateListener = await App.addListener(
        "appStateChange",
        async ({ isActive }) => {
          if (!isActive) {
            // App going to background
            await this.lockService.forceLock();
          } else {
            // App coming to foreground
            await this.checkLockState();
          }
        }
      );
    }

    // Listen for browser visibility changes (web)
    this.visibilityListener = async () => {
      if (document.hidden) {
        await this.lockService.forceLock();
      } else {
        await this.checkLockState();
      }
    };
    document.addEventListener("visibilitychange", this.visibilityListener);
  }

  private setupIdleDetection() {
    // Track user activity to keep session alive
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const refreshSession = async () => {
      try {
        await this.lockService.refreshSession();
      } catch (error) {
        console.warn("Failed to refresh session:", error);
      }
    };

    activityEvents.forEach((event) => {
      document.addEventListener(event, refreshSession, true);
    });

    // Refresh session every 30 seconds to keep it alive
    this.idleTimer = window.setInterval(async () => {
      try {
        await this.lockService.refreshSession();
      } catch (error) {
        console.warn("Failed to refresh session:", error);
      }
    }, 30000); // Refresh every 30 seconds
  }

  private async checkInitialLockState() {
    await this.checkLockState();
  }

  private async checkLockState() {
    try {
      const isSetup = await this.lockService.isSetup();

      if (!isSetup) {
        // PIN not set up, redirect to setup
        this.router.navigate(["/setup-pin"]);
        return;
      }

      const shouldLock = await this.lockService.shouldLock();

      if (shouldLock) {
        // Should be locked, redirect to lock screen
        const currentUrl = this.router.url;
        if (currentUrl !== "/lock" && currentUrl !== "/setup-pin") {
          this.router.navigate(["/lock"], {
            queryParams: { returnUrl: currentUrl },
          });
        }
      }
    } catch (error) {
      console.error("Error checking lock state:", error);
    }
  }

  private cleanup() {
    // Remove Capacitor listener
    if (this.appStateListener) {
      this.appStateListener.remove();
    }

    // Remove browser listener
    if (this.visibilityListener) {
      document.removeEventListener("visibilitychange", this.visibilityListener);
    }

    // Clear idle timer
    if (this.idleTimer) {
      clearInterval(this.idleTimer);
    }
  }
}
