# Dashboard - DB-003 Weight & Waist Trends

## User Story

As a user, I want to see my weight and waist trends so that I can track progress.

## Goals

- Line charts (14/30 days) for weight and weekly for waist.
- Show weekly average markers.

## Non-Goals

- Correlations (V3).

## Assumptions

- Data from `biometrics_weight` and `biometrics_waist`.

## UX / Flow

1. Open Dashboard → Trends section.
2. Toggle Weight / Waist.
3. See line chart + weekly average overlay.

## API

- **GET /biometrics/trends?type=weight&range=30d**
- **GET /biometrics/trends?type=waist&range=90d**

## Data Model

- Read from biometrics tables; optional materialized views.

## Acceptance Criteria

- [ ] Weight trend shows daily points + 7-day moving average.
- [ ] Waist trend shows weekly points.
- [ ] Empty states handled gracefully.

## Telemetry

- Log: `trends_viewed` {type, range}.

## Tasks (Backend)

- [ ] Trends queries; return ordered arrays with timestamps.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Chart components (no specified colors).
- [ ] Range selector (14/30/90d).
