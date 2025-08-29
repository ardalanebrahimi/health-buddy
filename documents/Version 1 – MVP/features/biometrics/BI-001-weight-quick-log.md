# Biometrics - BI-001 Weight Quick Log

## User Story

As a user, I want to quickly log my daily weight so that I can track trends over time.

## Goals

- Simple input: number + date/time.
- Show most recent weight on dashboard.
- Persist in DB and local cache.

## Non-Goals

- Waist circumference (BI-002).
- Trend charts (BI-006).

## Assumptions

- Single-user mode.
- Default date/time = now.

## UX / Flow

1. User taps “+ Weight” in biometrics screen or dashboard shortcut.
2. Enter weight in kg (decimal allowed).
3. Tap Save → data persisted, daily summary updated.

## API

- **POST /biometrics/weight**
  - Request:
    ```json
    { "valueKg": 110.4, "takenAt": "2025-08-29T08:00:00Z" }
    ```
  - Response:
    ```json
    { "id": "uuid", "valueKg": 110.4, "takenAt": "2025-08-29T08:00:00Z" }
    ```
- **GET /biometrics/weight/latest**
  - Response: most recent weight entry.

## Data Model

- `biometrics_weight`
  - `id` (uuid, pk)
  - `user_id` (uuid, fk)
  - `value_kg` (numeric)
  - `taken_at` (timestamptz)

## Acceptance Criteria

- [ ] User can enter weight (mandatory field).
- [ ] Stored value returns immediately via API.
- [ ] Last entry shown on dashboard.
- [ ] Duplicate entries allowed (but average shown in trends later).
- [ ] Input validated (20kg–300kg).

## Telemetry

- Log: `weight_logged` {valueKg}.
- Metric: daily weight log %.

## Tasks (Backend)

- [ ] Create table `biometrics_weight`.
- [ ] Implement `POST /biometrics/weight`, `GET /biometrics/weight/latest`.
- [ ] Update OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Add input form (kg, date/time).
- [ ] Connect to API + offline cache.
- [ ] Show last logged weight in biometrics & dashboard card.
