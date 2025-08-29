# Cross - CX-004 Local-First Storage & Sync Jobs

## User Story

As a user, I want the app to work offline and sync automatically so that I never lose data.

## Goals

- Local DB (IndexedDB/SQLite) stores all entries.
- Sync queue for POST/PUT calls.
- Conflict resolution = last-write-wins.

## Non-Goals

- Real-time multi-device sync (V7).

## Assumptions

- Capacitor SQLite or Dexie.js in Angular.

## UX / Flow

1. User logs meal offline → entry saved locally with `pending_sync=true`.
2. When online → background job syncs queue.
3. If conflict → server wins.

## API

- No new endpoints (reuses existing).
- Sync engine wraps SDK calls.

## Data Model

- Local mirror of server tables.
- Add `pending_sync` flag.

## Acceptance Criteria

- [ ] User can log meals/weight offline.
- [ ] Entries marked as pending sync.
- [ ] Auto-sync when online.
- [ ] Conflict resolved gracefully.

## Tasks (Frontend)

- [ ] Local DB schema.
- [ ] Sync queue system.
- [ ] Connectivity detection.
- [ ] Visual “pending” badge on entries.

## Tasks (Backend)

- [ ] Ensure idempotent APIs (accept client-supplied IDs).
