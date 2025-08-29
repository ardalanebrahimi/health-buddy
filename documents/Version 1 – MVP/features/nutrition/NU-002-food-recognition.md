# Nutrition - NU-002 Food Recognition

## User Story

As a user, after uploading a meal photo, I want the system to recognize food items and estimate calories/macros so that I don’t have to enter everything manually.

## Goals

- Call AI service (vision API + nutrition DB lookup).
- Store detected items + confidence scores.
- Allow editing later (handled in NU-003).

## Non-Goals

- Manual entry without photo (NU-004).
- Portion corrections (NU-003).

## Assumptions

- NU-001 (meal photo upload) is complete → returns `mealId`.
- AI service = external API (OpenAI Vision / Nutrition API).
- Confidence may vary → system must allow uncertain entries.

## UX / Flow

1. User uploads meal photo → meal created with `status=draft`.
2. System sends photo → AI service.
3. AI returns list of items, portions, calories/macros + confidence.
4. Meal `status=recognized`. Show preview list with “Edit” button.
5. User can accept as-is or edit later.

## API (OpenAPI stubs)

- **POST /meals/:mealId/recognize**
  - Request:
    ```json
    { "mealId": "uuid" }
    ```
  - Response:
    ```json
    {
      "mealId": "uuid",
      "status": "recognized",
      "items": [
        {
          "name": "spaghetti bolognese",
          "portionGrams": 250,
          "calories": 410,
          "protein": 18,
          "carbs": 55,
          "fat": 12,
          "confidence": 0.82
        }
      ]
    }
    ```

## Data Model (DB changes)

- `meal_items`
  - `id` (uuid, pk)
  - `meal_id` (uuid, fk)
  - `name` (text)
  - `portion_grams` (float)
  - `calories` (float)
  - `protein` (float)
  - `carbs` (float)
  - `fat` (float)
  - `confidence` (float)

## Acceptance Criteria

- [ ] API runs asynchronously; user sees “recognizing…” state.
- [ ] Response stored in DB + SDK updates UI.
- [ ] At least 1 item always returned; if none, show “not recognized.”
- [ ] Confidence displayed visually (icon or %).
- [ ] If service fails → fallback message: “Couldn’t recognize meal, please edit manually.”

## Telemetry

- Log: `meal_recognition_started`, `meal_recognition_completed`, `meal_recognition_failed`.
- Metric: avg recognition latency, success rate, % items edited later.

## Tasks (Backend)

- [ ] Implement `/meals/:mealId/recognize` endpoint.
- [ ] Call AI Vision API + nutrition DB mapping.
- [ ] Save items into `meal_items`.
- [ ] Update meal status to `recognized`.
- [ ] Update OpenAPI + regenerate SDK.

## Tasks (Frontend)

- [ ] Poll or subscribe to recognition status.
- [ ] Show spinner → preview list of recognized foods.
- [ ] Display confidence + calories/macros per item.
- [ ] Allow “Edit” → redirects to NU-003.
