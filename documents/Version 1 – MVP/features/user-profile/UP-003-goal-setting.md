# User Profile - UP-003 Goal Setting (weight/fitness/sleep/pain)

## User Story

As a user, I want to set personal goals so that the app can compare my progress against them.

## Goals

- Set weight goal.
- Set fitness activity level target.
- Set sleep hours target.
- Set pain reduction goal (optional).

## Non-Goals

- Doctor’s plan (V4).

## Assumptions

- Captured after baseline in onboarding wizard.

## UX / Flow

1. Goals screen shows default suggestions (based on demographics).
2. User enters targets: target weight (kg), sleep hours (int), pain score target (optional).
3. Save → goals dashboard updates.

## API

- **PUT /goals**
  - `{ "weightGoalKg":85,"sleepHoursTarget":7,"painTarget":3 }`
- \*\*GET /goals`

## Data Model

- `goals(weight_goal_kg, sleep_hours_target, pain_target)`

## Acceptance Criteria

- [ ] User can enter/edit goals.
- [ ] Validation on values.
- [ ] Returned in GET /goals.

## Tasks (Backend)

- [ ] PUT/GET endpoints.
- [ ] Update OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Goals form.
- [ ] Prefill with suggestions.
- [ ] Save + local sync.
