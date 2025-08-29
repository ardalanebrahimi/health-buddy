# Nutrition - NU-008 Offline Queue & Sync for Meals

## User Story

As a user, I want meal actions to work offline and sync later so that I never lose entries.

## Goals

- Queue POST/PATCH meal requests when offline.
- Visual “pending sync” badge; auto-retry with backoff.
- Idempotency via client-generated IDs.

## Non-Goals

- Full conflict resolution UI (server-wins for V1).

## Assumptions

- CX-004 provides core sync infra (extend it for meals).

## UX / Flow

- Actions queued: create photo meal (NU-001), manual meal (NU-004), edit items (NU-003), hydration add (NU-005).
- UI shows pending state; clears on success; toast on failure with retry.

## API

- Reuse existing endpoints; accept `clientRequestId` header for idempotency.

## Data Model

- Local store: `sync_queue` with method, path, body, retries, createdAt.

## Acceptance Criteria

- [ ] All meal actions function offline.
- [ ] Pending entries visible and later reconciled.
- [ ] Retries exponential backoff; give up after N (configurable).

## Telemetry

- `sync_enqueued`, `sync_succeeded`, `sync_failed`.

## Tasks (Backend)

- Idempotent handlers (respect `clientRequestId`).
- Safe upserts for meals/items.

## Tasks (Frontend)

- Queue wrapper around SDK.
- Pending badges + retry UI.
