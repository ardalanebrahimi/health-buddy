# Biometrics - BI-005 Mood/Energy Quick Log

## User Story

As a user, I want to quickly log my mood and energy so that I can track how I feel over time.

## Goals

- One-tap, low-friction logging for mood (emoji) and energy (1–10).
- Show today's values in Daily Summary Card.

## Non-Goals

- Journaling or CBT prompts (V6).

## Assumptions

- Daily Summary consumes latest mood/energy for date.

## UX / Flow

1. Open Biometrics or Home quick widget.
2. Tap an emoji for mood; slide energy (1–10).
3. Save → values appear in summary immediately.

## API

- **POST /biometrics/mood**
  - `{ "mood": "🙂", "takenAt": "2025-08-29T09:30:00Z" }`
- **POST /biometrics/energy**
  - `{ "score": 6, "takenAt": "2025-08-29T09:30:00Z" }`
- **GET /biometrics/mood/latest`, `GET /biometrics/energy/latest`**

## Data Model

- `biometrics_mood(id, user_id, mood_char, taken_at, created_at)`
- `biometrics_energy(id, user_id, score_int, taken_at, created_at)`

## Acceptance Criteria

- [ ] Emoji picker (5–7 options) + energy slider (1–10).
- [ ] Latest values reflected on home card.
- [ ] Multiple logs/day allowed; latest wins for summary.
- [ ] Works offline with sync.

## Telemetry

- Log: `mood_logged`, `energy_logged`.

## Tasks (Backend)

- [ ] Endpoints + validation.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Quick widget UI + forms.
- [ ] Bind to SDK; optimistic update.
