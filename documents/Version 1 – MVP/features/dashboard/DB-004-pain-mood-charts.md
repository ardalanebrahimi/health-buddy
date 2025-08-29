# Dashboard - DB-004 Pain & Mood Charts

## User Story

As a user, I want to visualize pain and mood over time so that I can see patterns.

## Goals

- Area/line charts for pain and mood (14–30 days).
- Tooltips with date/value.

## Non-Goals

- Correlations with training/sleep (V3+).

## Assumptions

- BI-004 and BI-005 implemented.

## UX / Flow

1. Dashboard → Emotional/Comfort section.
2. Toggle Pain / Mood.
3. View last 14/30 days.

## API

- **GET /biometrics/trends?type=pain&range=30d**
- **GET /biometrics/trends?type=mood&range=30d**

## Data Model

- From biometrics tables.

## Acceptance Criteria

- [ ] Chart renders even with sparse data.
- [ ] Latest value highlighted.
- [ ] Accessible tooltips/labels.

## Telemetry

- Log: `emotional_trends_viewed`.

## Tasks (Backend)

- [ ] Trends endpoints (reuse DB-003 patterns).
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Charts + toggles + empty states.
