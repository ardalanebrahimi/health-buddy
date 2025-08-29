# Biometrics - BI-002 Waist Circumference (Weekly)

## User Story

As a user, I want to log my waist weekly so that I can track central fat change.

## Goals

- Simple cm input; default to current date.
- Recommend weekly cadence; show last value.

## Non-Goals

- Tape-measure tutorial (future help article).

## UX / Flow

- Biometrics → Waist → enter cm → Save.
- Display last value + date; hint “log weekly”.

## API

- POST /biometrics/waist { "valueCm": 108, "takenAt": "..." }
- GET /biometrics/waist/latest

## Data Model

- biometrics_waist(id, user_id, value_cm, taken_at, created_at)

## Acceptance Criteria

- [ ] Value persisted and retrievable.
- [ ] Latest appears on dashboard trend (DB-003).
- [ ] Validation: 40–200 cm.

## Tasks (Backend)

- Endpoints + validation + SDK.

## Tasks (Frontend)

- Form + latest display; offline support.
