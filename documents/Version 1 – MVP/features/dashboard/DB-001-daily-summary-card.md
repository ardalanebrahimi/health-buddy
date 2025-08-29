# Dashboard - DB-001 Daily Summary Card

## User Story

As a user, I want to see a daily summary card on the home screen so that I know my current health status at a glance.

## Goals

- Show key metrics for today (nutrition, hydration, weight, pain, energy).
- Include one motivational/companion note.
- Update in real-time as logs change.

## Non-Goals

- Weekly dashboards (DB-002).
- Correlation graphs (future).

## Assumptions

- Metrics pulled from existing endpoints.
- Companion note generated from CO-001.

## UX / Flow

1. Open app → home screen.
2. Daily summary card shows:
   - Calories/macros eaten today.
   - Water intake.
   - Latest weight.
   - Pain score.
   - Mood/energy.
   - Companion note (1–2 sentences).
3. Tap → drill down into each module.

## API

- **GET /daily-summary?date=YYYY-MM-DD**
  - Response:
    ```json
    {
      "date": "2025-08-29",
      "nutrition": {
        "calories": 2100,
        "protein": 95,
        "carbs": 240,
        "fat": 70,
        "waterLiters": 1.5
      },
      "biometrics": {
        "weightKg": 110.2,
        "painScore": 6,
        "mood": "😐",
        "energy": 5
      },
      "companionNote": "You logged all meals today — keep it up!"
    }
    ```

## Data Model

- `daily_summary` (materialized view or computed on request).

## Acceptance Criteria

- [ ] API returns nutrition + biometrics + companion note for selected date.
- [ ] Card updates instantly after logging weight or meals.
- [ ] If no data → placeholders shown (“Not logged yet”).
- [ ] Motivational note always present.

## Telemetry

- Log: `daily_summary_viewed` {date}.
- Metric: % of app opens where summary loaded successfully.

## Tasks (Backend)

- [ ] Implement `GET /daily-summary`.
- [ ] Aggregate from meals + biometrics + companion message.
- [ ] Create materialized view for efficiency.
- [ ] Update OpenAPI + regenerate SDK.

## Tasks (Frontend)

- [ ] Home screen: card component.
- [ ] Bind to `/daily-summary`.
- [ ] Placeholder UI when no logs.
- [ ] Refresh on new logs.
