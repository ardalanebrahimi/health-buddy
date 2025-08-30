# UP-004 Profile Storage & Sync - Implementation Details

## Overview

This document details the implementation of UP-004 Profile Storage & Sync for the V1 health companion app, providing offline-first profile and goals management with automatic synchronization.

## ✅ Implementation Summary

### Backend Enhancements

#### 1. Idempotent API Endpoints

- **PUT /profile**: Now properly implemented using the same `createOrUpdateProfile` service
- **PATCH /profile/baseline**: Uses Prisma `update` with conflict resolution
- **PUT /goals**: Uses Prisma `upsert` for true idempotency
- **GET /profile**, **GET /goals**: Consistent response formats

#### 2. Conflict Resolution Strategy

- **Server wins**: All endpoints use database timestamps and server-side conflict resolution
- **Last-write-wins**: Implemented via Prisma upsert operations
- **Idempotent operations**: Multiple calls with same data produce same result

### Frontend Implementation

#### 1. Local Database Service (`local-database.service.ts`)

```typescript
// Uses Dexie.js for IndexedDB storage
export interface LocalProfile {
  id: string;
  data: ProfileDto;
  pending_sync: boolean;
  lastUpdated: string;
}

export interface LocalGoals {
  id: string;
  data: GoalsDto;
  pending_sync: boolean;
  lastUpdated: string;
}

export interface SyncQueueItem {
  id: string;
  method: "POST" | "PUT" | "PATCH";
  path: string;
  body: any;
  timestamp: string;
  retryCount: number;
  lastError?: string;
}
```

#### 2. Sync Service (`sync.service.ts`)

- **Connectivity Detection**: Listens for online/offline events
- **Queue Management**: Stores failed operations for retry
- **Automatic Sync**: Triggers on connectivity restoration
- **Retry Logic**: 3 attempts with exponential backoff
- **Idempotent Operations**: Safe to replay multiple times

#### 3. Enhanced ProfileService (`profile.service.ts`)

- **Local-First**: Always stores data locally first
- **Optimistic Updates**: UI updates immediately, syncs in background
- **Fallback Strategy**: Uses local data when server unavailable
- **Reactive State**: Uses BehaviorSubject for real-time UI updates
- **Sync Integration**: Automatically queues operations when offline

#### 4. Sync Status Component (`sync-status.component.ts`)

- **Visual Indicators**: Shows sync state with icons and colors
- **Real-time Updates**: Reflects current connectivity and sync status
- **User Feedback**: Clear messaging for offline, syncing, and synced states

## 🔧 Key Features Implemented

### 1. Offline-First Architecture

- Profile and goals data stored locally in IndexedDB
- Operations work completely offline
- UI remains responsive regardless of connectivity

### 2. Automatic Synchronization

- Triggers on connectivity restoration
- Periodic sync every 30 seconds when online
- Manual sync capability through service

### 3. Conflict Resolution

- Server-side timestamps determine winner
- Local data updated with server response
- UI reflects resolved conflicts automatically

### 4. Queue Management

- Failed operations queued for retry
- Persistent storage survives app restarts
- Automatic cleanup after max retries

### 5. Status Indicators

- Real-time sync status display
- Pending operations counter
- Clear visual feedback for users

## 📊 Data Flow

### Profile Creation/Update Flow

```
1. User Input → ProfileService.saveProfile()
2. If Online:
   - POST/PUT to server
   - Store server response locally
   - Update UI with server data
3. If Offline:
   - Store optimistic data locally
   - Queue operation for sync
   - Update UI with local data
   - Mark as pending_sync
4. On Reconnect:
   - Replay queued operations
   - Merge server responses
   - Clear pending_sync flags
   - Update UI if conflicts resolved
```

### Goals Creation/Update Flow

```
1. User Input → ProfileService.saveGoals()
2. If Online:
   - PUT to server
   - Store server response locally
   - Update goals subject
3. If Offline:
   - Store optimistic data locally
   - Queue operation for sync
   - Update goals subject
   - Mark as pending_sync
4. On Reconnect:
   - Replay queued operations
   - Update local storage with server response
   - Clear pending_sync flags
```

## 🧪 Testing

### Manual Testing

```bash
# Run the comprehensive test suite
node test-profile-sync.js
```

### Test Coverage

- ✅ Profile creation idempotency
- ✅ Profile update idempotency
- ✅ Baseline update idempotency
- ✅ Goals update idempotency
- ✅ GET endpoint consistency
- ✅ Repeated operations safety
- ✅ Offline queue functionality
- ✅ Sync on reconnect

## 📱 UI Integration

### Sync Status Display

```html
<!-- Add to any component template -->
<app-sync-status></app-sync-status>
```

### Profile Service Usage

```typescript
// In components
constructor(private profileService: ProfileService) {}

// Get profile with offline support
const profile = await this.profileService.getProfile();

// Save profile with sync queue
await this.profileService.saveProfile(profileData);

// Check sync status
const isPending = await this.profileService.getProfileSyncStatus();
```

## 🔄 Sync Service API

### Key Methods

```typescript
// Manual sync trigger
await this.syncService.syncAll();

// Check connectivity
this.syncService.isOnline$.subscribe((isOnline) => {});

// Monitor sync status
this.syncService.isSyncing$.subscribe((isSyncing) => {});

// Check pending operations
const count = await this.syncService.getPendingSyncCount();
```

## 🛠 Configuration

### Dependencies Added

```json
{
  "dexie": "^4.0.0" // IndexedDB wrapper
}
```

### Database Schema

- **profiles**: Local profile mirror with sync flags
- **goals**: Local goals mirror with sync flags
- **syncQueue**: Pending operations queue

## ✅ Acceptance Criteria Met

- [x] **Profile/goals available offline**: Local IndexedDB storage
- [x] **Sync runs automatically when online**: Connectivity listeners + periodic sync
- [x] **Conflicts resolved (server wins)**: Server response overwrites local data
- [x] **Profile updates reflected in UI**: Reactive BehaviorSubjects
- [x] **Works with CX-004 sync infra**: Implemented comprehensive sync service
- [x] **Pending_sync flag handling**: Local database tracks sync status
- [x] **Idempotent backend operations**: All endpoints use upsert/update patterns

## 🚀 Future Enhancements

### Planned for Later Versions

- **Multi-device sync**: Conflict resolution across devices
- **Background sync**: Service worker integration
- **Compression**: Optimize local storage usage
- **Analytics**: Sync performance metrics
- **Progressive sync**: Priority-based queue processing

## 📝 Migration Notes

### From localStorage to IndexedDB

- Automatic migration of existing profile/goals data
- Backward compatibility maintained
- Gradual cleanup of old localStorage keys

### Breaking Changes

- None - ProfileService API remains the same
- Enhanced with sync capabilities
- Existing components work without modification
