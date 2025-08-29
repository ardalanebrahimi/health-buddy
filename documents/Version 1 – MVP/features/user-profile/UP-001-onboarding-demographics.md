# User Profile - UP-001 Onboarding: Demographics Form

## User Story

As a user, I want to enter my demographics so that the app can personalize summaries and goals.

## Goals

- Capture age, sex, height, weight, activity level.
- Store in profile table.

## Non-Goals

- Goal setting (UP-003).
- Baseline health (UP-002).

## Assumptions

- Onboarding wizard: demographics → baseline → goals.

## UX / Flow

1. First run → Demographics screen.
2. Enter age, sex (M/F/Other), height (cm), weight (kg), activity level (sedentary, light, moderate, active).
3. Save → continue to baseline form.

## API

- **POST /profile**
  - `{ "age":38,"sex":"M","heightCm":180,"weightKg":110,"activityLevel":"moderate" }`
- \*\*GET /profile`

## Data Model

- `profiles(age, sex, height_cm, weight_kg, activity_level)`

## Acceptance Criteria

- [ ] Required fields: age, sex, height, weight.
- [ ] Values validated (reasonable bounds).
- [ ] Data persists offline and syncs when online.
- [ ] Appears in GET /profile.

## Tasks (Backend)

- [ ] Implement POST/GET /profile.
- [ ] Update OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Demographics form UI.
- [ ] Validation.
- [ ] Call API + local cache.
