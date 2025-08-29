# Nutrition - NU-003 Edit Detected Items & Portions

## User Story

As a user, I want to correct the recognized foods and portions so that my calories/macros are accurate.

## Goals

- Inline edit of item name, portion (g/servings), and macros if needed.
- Recalculate meal totals after edits.
- Track whether user modified AI output.

## Non-Goals

- New recognition call (NU-002 handles that).
- Food DB search UX (basic typeahead ok; advanced DB in NU-004).

## Assumptions

- Meal exists with status=recognized and has meal_items from NU-002.

## UX / Flow

1. Open meal → see list of items with editable fields (name, grams/servings).
2. Typeahead on name (local list + optional nutrition DB).
3. Save → totals update; meal status → `final`.
4. Badge shows “Edited” if any item changed.

## API

- **PATCH /meals/:mealId/items**
  - Request:
    ```json
    {
      "items": [
        {
          "id": "uuid",
          "name": "grilled chicken",
          "portionGrams": 180,
          "calories": 290,
          "protein": 38,
          "carbs": 0,
          "fat": 12
        }
      ]
    }
    ```
  - Response:
    ```json
    {
      "mealId": "uuid",
      "status": "final",
      "totals": { "calories": 650, "protein": 45, "carbs": 55, "fat": 22 }
    }
    ```

## Data Model

- `meal_items` add:
  - `edited_by_user` (bool, default false)
- `meals` add:
  - `edited` (bool), `totals_json` (jsonb)

## Acceptance Criteria

- [ ] User can edit name and portion; macros recalc shown instantly.
- [ ] Save persists items and updates totals.
- [ ] Meal flips to `final` on first successful edit/save.
- [ ] “Edited” badge appears when any `edited_by_user=true`.
