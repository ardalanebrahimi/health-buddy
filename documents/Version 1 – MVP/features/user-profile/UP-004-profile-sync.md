# User Profile - UP-004 Profile Storage & Sync

## User Story

As a user, I want my profile data stored locally and synced so that I can access it offline.

## Goals

- Mirror profile & goals locally.
- Sync changes when online.
- Conflict resolution: last-write-wins.

## Non-Goals

- Multi-device sync (future).

## Assumptions

- CX-004 local-first sync jobs already in place.

## UX / Flow

1. Profile created in onboarding.
2. Stored locally.
3. If offline → marked pending_sync.
4. On reconnect → push to backend, merge response.

## API

- Reuse /profile, /goals.

## Data Model

- Local DB mirror of `profiles`, `goals`.

## Acceptance Criteria

- [ ] Profile/goals available offline.
- [ ] Sync runs automatically when online.
- [ ] Conflicts resolved (server wins).
- [ ] Profile updates reflected in UI.

## Tasks (Backend)

- [ ] Ensure idempotent PUT/PATCH handlers.

## Tasks (Frontend)

- [ ] Sync queue integration for /profile + /goals.
- [ ] Pending_sync flag handling.
