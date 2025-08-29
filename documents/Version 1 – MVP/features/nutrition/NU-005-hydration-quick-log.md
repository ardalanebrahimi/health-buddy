# Nutrition - NU-005 Hydration Quick Log

## User Story

As a user, I want to quickly log water intake so that my hydration is tracked without friction.

## Goals

- One-tap quick add (250ml / 500ml).
- Show total liters per day.
- Sync with nutrition summaries.

## Non-Goals

- Other drinks (coffee/tea tracked in lifestyle later).

## Assumptions

- Stored as `hydration` entries with ml amount + takenAt.

## UX / Flow

1. On nutrition screen, quick buttons: +250ml, +500ml.
2. Total liters today shown above buttons.
3. Undo last log option.

## API

- **POST /hydration**
  - Request: `{ "amountMl": 250, "takenAt": "2025-08-29T10:00:00Z" }`
  - Response: `{ "id":"uuid","amountMl":250,"takenAt":"..." }`
- **GET /hydration/summary?date=YYYY-MM-DD**
  - Response: `{ "date":"2025-08-29","totalLiters":1.25 }`

## Data Model

- `hydration(id, user_id, amount_ml, taken_at, created_at)`

## Acceptance Criteria

- [ ] User can add water log with one tap.
- [ ] Total liters updates instantly.
- [ ] Undo removes last log.
- [ ] Included in nutrition daily/weekly summaries.

## Tasks (Backend)

- [ ] Create table `hydration`.
- [ ] Implement endpoints.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Quick buttons UI.
- [ ] Display today’s total.
- [ ] Undo last log.
