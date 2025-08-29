# Cross - CX-003 Data Models & DB Migrations

## User Story

As a developer, I need initial DB schemas and migrations so that V1 data can be persisted reliably.

## Goals

- Create core tables for V1: profile, goals, meals (+items +photos), hydration, biometrics_weight, companion_messages.
- Add indexes and FKs; timestamps; RLS-ready.

## Non-Goals

- Multi-tenant partitions (V7).
- BI warehouse (V5+).

## Schema (Postgres)

- `profiles(id, user_id, sex, age, height_cm, weight_kg, activity_level, baseline_json, created_at, updated_at)`
- `goals(id, user_id, weight_goal_kg, protein_target_g, calorie_target_kcal, created_at, updated_at)`
- `meals(id, user_id, taken_at, status, totals_json, notes, created_at, updated_at)`
- `meal_items(id, meal_id, name, portion_grams, calories, protein, carbs, fat, confidence, edited_by_user)`
- `meal_photos(meal_id, photo_url, width, height, exif_json)`
- `hydration(id, user_id, amount_ml, taken_at, created_at)`
- `biometrics_weight(id, user_id, value_kg, taken_at, created_at)`
- `companion_messages(id, user_id, date, note, created_at)`

## Acceptance Criteria

- [ ] Migrations create tables with FKs and indexes (meal_items.meal_id, biometrics_weight.user_id+taken_at).
- [ ] Enum for `meals.status` = draft|recognized|final.
- [ ] All timestamps in UTC (timestamptz).
- [ ] Seed script creates a demo user and sample records (optional).

## Tasks

- [ ] Prisma/TypeORM models + migrations.
- [ ] README with `yarn db:migrate` instructions.
