# Nutrition - NU-004 Manual Meal Entry (No Photo)

## User Story

As a user, I want to log a meal without a photo so that I can capture items quickly.

## Goals

- Search food, pick portion, auto-calc macros.
- Add multiple items to one meal.

## Non-Goals

- Barcode scanning (future).
- Advanced food DB UX (simple typeahead acceptable).

## Assumptions

- Use a nutrition lookup service (cached results).

## UX / Flow

1. Tap “+ Meal” → “Manual Entry”.
2. Search item, choose portion (grams/servings).
3. Add more items → Save.

## API

- **POST /meals**
  - `{ "takenAt":"...","items":[{"name":"oatmeal","portionGrams":80}] }`
- \*\*GET /foods/search?q=oat` → returns candidates with per-100g macros.

## Data Model

- Reuse `meals`, `meal_items`.

## Acceptance Criteria

- [ ] Create meal with ≥1 item.
- [ ] Totals computed server-side and returned.
- [ ] Appears in today’s nutrition summary.

## Telemetry

- Log: `manual_meal_created`.

## Tasks (Backend)

- [ ] `/foods/search` proxy; `/meals` create + totals calc.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Manual entry flow; typeahead + portion control.
- [ ] Add/remove items before save.
