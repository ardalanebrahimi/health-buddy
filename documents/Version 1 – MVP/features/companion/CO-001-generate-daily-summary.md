# Companion - CO-001 Generate Daily Summary Text

## User Story

As a user, I want a short daily companion note that summarizes today so that I feel guided and motivated.

## Goals

- 1–2 sentence text composed from today’s logs.
- Friendly tone; no medical claims.
- Always returns a message (fallback copy).

## Non-Goals

- Recommendations/insights (V3).
- Voice output.

## Assumptions

- Daily data available from `/daily-summary` or module queries.

## UX / Flow

1. Home loads → call `/companion/daily`.
2. Show note in Daily Summary Card.
3. History page lists past notes.

## API

- **GET /companion/daily?date=YYYY-MM-DD**
  - Response:
    ```json
    {
      "date": "2025-08-29",
      "note": "Nice work logging all meals. You’re at ~2.1L of water — a short walk after dinner could cap the day well."
    }
    ```
- **GET /companion/history?days=30**

## Data Model

- `companion_messages`:
  - `id`, `user_id`, `date`, `note`, `created_at`

## Acceptance Criteria

- [ ] Always returns a non-empty note (fallback if missing data).
- [ ] Tone configurable (brief/friendly/neutral).
- [ ] History shows last 7–30 days.

## Telemetry

- Log: `companion_daily_generated` {date, source: rule|ai}.
- Metric: generation failures (<1%), user dwell time on home.

## Tasks (Backend)

- [ ] Rules-based composer (v1): build from calories logged, water, latest weight, pain/mood.
- [ ] Store message for the day (idempotent).
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Bind to Daily Summary Card.
- [ ] Add history screen.
- [ ] Settings toggle for tone.
