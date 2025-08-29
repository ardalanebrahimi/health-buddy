# Biometrics - BI-004 Pain Log

## User Story

As a user, I want to log my pain level and location so that I can monitor how pain changes over time.

## Goals

- Record pain score (1–10), location (select), optional note.
- Show latest pain on Daily Summary Card.

## Non-Goals

- Body map selector (advanced in V6); use dropdown list now.

## Assumptions

- Locations list includes: lower back, between shoulders, elbows, coccyx, other.

## UX / Flow

1. Open Pain Log.
2. Select location, set score (1–10), optional note.
3. Save → latest score appears on home.

## API

- **POST /biometrics/pain**
  - `{ "location": "lower_back", "score": 7, "note": "worse after sitting", "takenAt": "2025-08-29T21:00:00Z" }`
- \*\*GET /biometrics/pain/latest`

## Data Model

- `biometrics_pain(id, user_id, location, score, note, taken_at, created_at)`

## Acceptance Criteria

- [ ] Pain entry saved with location + score.
- [ ] Latest score visible on home card.
- [ ] Works offline with sync.

## Telemetry

- Log: `pain_logged`.

## Tasks (Backend)

- [ ] Endpoint + schema + enums for locations.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Form UI; dropdown for location; slider for score.
- [ ] Optimistic update on home card.
