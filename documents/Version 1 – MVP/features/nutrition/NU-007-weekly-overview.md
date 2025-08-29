# Nutrition - NU-007 Weekly Overview

## User Story

As a user, I want to see my 7-day average calories/macros and hydration so that I can spot longer-term patterns.

## Goals

- Aggregate nutrition and hydration data across last 7 days.
- Show averages and totals.
- Visualize as a bar/line chart.

## Non-Goals

- Correlations (V3).
- Custom date ranges (V2+).

## Assumptions

- Daily summaries (NU-006) implemented.

## UX / Flow

1. User taps "Weekly" tab in Nutrition screen.
2. Chart shows kcal per day (bars).
3. Below chart: averages for calories, protein, carbs, fat, water.

## API

- **GET /nutrition/weekly**
  - Response:
    ```json
    {
      "startDate":"2025-08-23",
      "endDate":"2025-08-29",
      "daily":[
        {"date":"2025-08-23","calories":2100,"protein":95,"carbs":260,"fat":70,"waterLiters":1.5},
        {"date":"2025-08-24","calories":1950,...}
      ],
      "averages":{"calories":2020,"protein":88,"carbs":240,"fat":68,"waterLiters":1.7}
    }
    ```

## Data Model

- Query aggregates from meals + hydration.

## Acceptance Criteria

- [ ] API returns 7 days ending at requested date (default today).
- [ ] Averages match daily entries.
- [ ] If missing days → zeros included.

## Tasks (Backend)

- [ ] Aggregation query or materialized view.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Weekly chart UI.
- [ ] Toggle between Daily and Weekly tabs.
- [ ] Show averages.
