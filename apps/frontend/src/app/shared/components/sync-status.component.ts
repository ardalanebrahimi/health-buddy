import { Component, OnInit, inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SyncService } from "../../services/sync.service";
import { ProfileService } from "../../onboarding/profile.service";
import {
  combineLatest,
  map,
  interval,
  startWith,
  switchMap,
  BehaviorSubject,
  Subject,
  takeUntil,
} from "rxjs";

@Component({
  selector: "app-sync-status",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="sync-status"
      [class.syncing]="(syncStatus$ | async)?.isSyncing"
      [class.pending]="(syncStatus$ | async)?.hasPending"
      [class.offline]="!(syncStatus$ | async)?.isOnline"
    >
      <ng-container *ngIf="syncStatus$ | async as status">
        <span class="sync-icon">
          <ng-container [ngSwitch]="true">
            <span *ngSwitchCase="!status.isOnline">📴</span>
            <span *ngSwitchCase="status.isSyncing">🔄</span>
            <span *ngSwitchCase="status.hasPending">⏳</span>
            <span *ngSwitchDefault>✅</span>
          </ng-container>
        </span>
        <span class="sync-text">
          <ng-container [ngSwitch]="true">
            <span *ngSwitchCase="!status.isOnline">Offline</span>
            <span *ngSwitchCase="status.isSyncing">Syncing...</span>
            <span *ngSwitchCase="status.hasPending">Pending sync</span>
            <span *ngSwitchDefault>Synced</span>
          </ng-container>
        </span>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .sync-status {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 12px;
        background: #f0f0f0;
        color: #666;
        font-size: 12px;
        border: 1px solid #e0e0e0;
      }

      .sync-status.syncing {
        background: #e3f2fd;
        color: #1976d2;
        border-color: #bbdefb;
      }

      .sync-status.pending {
        background: #fff3e0;
        color: #f57c00;
        border-color: #ffcc02;
      }

      .sync-status.offline {
        background: #ffebee;
        color: #d32f2f;
        border-color: #ffcdd2;
      }

      .sync-icon {
        font-size: 10px;
      }

      .sync-text {
        font-weight: 500;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .syncing .sync-icon {
        animation: spin 1s linear infinite;
      }
    `,
  ],
})
export class SyncStatusComponent implements OnInit, OnDestroy {
  private syncService = inject(SyncService);
  private profileService = inject(ProfileService);
  private destroy$ = new Subject<void>();

  private pendingCountSubject = new BehaviorSubject<number>(0);

  syncStatus$ = combineLatest([
    this.syncService.isOnline$,
    this.syncService.isSyncing$,
    this.pendingCountSubject.asObservable(),
  ]).pipe(
    map(([isOnline, isSyncing, pendingCount]) => ({
      isOnline,
      isSyncing,
      hasPending: pendingCount > 0,
    }))
  );

  ngOnInit() {
    // Update pending count every 5 seconds
    interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.syncService.getPendingSyncCount()),
        takeUntil(this.destroy$)
      )
      .subscribe((count) => this.pendingCountSubject.next(count));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
