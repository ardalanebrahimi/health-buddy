# Dashboard - DB-002 Nutrition Graphs

## User Story

As a user, I want to see daily and weekly nutrition graphs so that I can understand intake patterns.

## Goals

- Daily calories/macros (bars/lines).
- Weekly 7-day view (NU-007 data).

## Non-Goals

- Correlations (V3).

## UX / Flow

- Dashboard → Nutrition widget: toggle Day/Week.
- Day = /nutrition/summary
- Week = /nutrition/weekly

## API

- GET /nutrition/summary?date=...
- GET /nutrition/weekly

## Acceptance Criteria

- [ ] Charts render with today/week data.
- [ ] Empty state messages when no meals.
- [ ] Accessible tooltips/labels.

## Tasks (Frontend)

- Chart component (no custom colors).
- Toggle Day/Week; request endpoints.
