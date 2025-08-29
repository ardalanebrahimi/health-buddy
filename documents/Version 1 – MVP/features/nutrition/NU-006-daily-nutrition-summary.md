# Nutrition - NU-006 Daily Nutrition Summary

## User Story

As a user, I want to see today’s calories/macros and water so that I know where I stand.

## Goals

- Aggregate all meals (status=draft|recognized|final) for a given date.
- Show totals + per-meal list.
- Include hydration liters.

## Non-Goals

- Weekly averages (NU-007).
- Recommendations (V3+).

## Assumptions

- Hydration logs exist (NU-005).

## UX / Flow

1. Open “Today” in Nutrition.
2. See totals (kcal, P/C/F, water).
3. Meals list with thumbnails + kcal per meal.

## API

- **GET /nutrition/summary?date=YYYY-MM-DD**
  - Response:
    ```json
    {
      "date": "2025-08-29",
      "totals": {
        "calories": 2120,
        "protein": 120,
        "carbs": 210,
        "fat": 70,
        "waterLiters": 1.6
      },
      "meals": [
        {
          "mealId": "uuid",
          "takenAt": "2025-08-29T12:05Z",
          "calories": 740,
          "status": "final",
          "thumbnailUrl": "..."
        }
      ]
    }
    ```

## Data Model

- No new tables; use `meals`, `meal_items`, `hydration`.
- Optional: materialized view `nutrition_daily_totals`.

## Acceptance Criteria

- [ ] API returns totals and meal list for any date.
- [ ] Includes hydration liters.
- [ ] If no meals → totals zero and empty list.
- [ ] Includes meals with status recognized/final; drafts included with “~” (estimate) flag.

## Telemetry

- Log: `nutrition_summary_viewed` {date}.
- Metric: API latency, cache hit rate.

## Tasks (Backend)

- [ ] Implement aggregation + optional materialized view.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Totals header component.
- [ ] Meal list component with status pill.
- [ ] Pull-to-refresh.
