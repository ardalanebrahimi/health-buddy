# 📄 Version 1 – MVP Feature List

## 1. User Profile Module

**Goal**: Capture demographics, baseline health, and goals.

### UP-001 Onboarding: Demographics Form

- **Story**: As a user, I enter age, sex, height, weight, activity level.
- **API**: `POST /profile`, `GET /profile`
- **UI**: `/onboarding/profile`

### UP-002 Baseline Health & Pain Areas

- **Story**: I record known conditions, pain locations, free-text notes.
- **API**: `PATCH /profile/baseline`

### UP-003 Goal Setting (weight/fitness/sleep/pain)

- **Story**: I define personal goals; can edit later.
- **API**: `PUT /goals`, `GET /goals`

### UP-004 Profile Storage & Sync

- **Story**: Profile persists offline, syncs when online.
- **Infra**: Local cache + background sync job

### UP-005 Edit Profile & Goals

- **Story**: I can update any field from settings.
- **UI**: `/settings/profile`

---

## 2. Nutrition Module

**Goal**: Photo-first meal logging with manual corrections; daily/weekly summaries.

### NU-001 Capture/Upload Meal Photo

- **Story**: I add a meal via camera or gallery.
- **API**: `POST /meals/photo`
- **UI**: FAB “+ meal”

### NU-002 Food Recognition (AI Call)

- **Story**: System proposes items + portion + kcal/macros.
- **API**: `POST /meals/recognize` (to AI proxy)

### NU-003 Edit Detected Items & Portions

- **Story**: I correct food names/grams/servings.
- **API**: `PATCH /meals/:id/items`

### NU-004 Manual Meal (No Photo)

- **Story**: I can log by searching food DB & entering quantity.
- **API**: `POST /meals`

### NU-005 Hydration Quick Log

- **Story**: I tap to add 250/500ml water shots; see daily liters.
- **API**: `POST /hydration`

### NU-006 Daily Nutrition Summary

- **Story**: See today’s kcal, protein, carbs, fat, water.
- **API**: `GET /nutrition/summary?date=…`

### NU-007 Weekly Overview

- **Story**: See 7-day averages vs personal targets.
- **API**: `GET /nutrition/weekly`

### NU-008 Offline Queue & Sync for Meals

- **Story**: I can log meals offline; they sync later.
- **Infra**: Job + local queue

---

## 3. Biometrics Module

**Goal**: Quick manual logs + simple trend charts.

### BI-001 Weight Quick Log

- **Story**: Daily weight with date/time; edit last entry.
- **API**: `POST /biometrics/weight`, `GET /biometrics/weight`

### BI-002 Waist Circumference (Weekly)

- **API**: `POST /biometrics/waist`

### BI-003 BP & Resting HR

- **API**: `POST /biometrics/bp`, `POST /biometrics/hr`

### BI-004 Pain Log

- **Story**: 1–10 scale, location, note.
- **API**: `POST /biometrics/pain`

### BI-005 Mood/Energy Quick Log

- **Story**: Emoji/slider for mood & energy.
- **API**: `POST /biometrics/mood`, `POST /biometrics/energy`

### BI-006 Trends: Weight & Waist Charts

- **API**: `GET /biometrics/trends?type=weight|waist`

### BI-007 Trends: Pain & Mood Charts

- **API**: `GET /biometrics/trends?type=pain|mood`

---

## 4. Dashboard Module

**Goal**: Companion-focused home + secondary data dashboard.

### DB-001 Home: Daily Summary Card

- **Story**: Today’s kcal/macros, water, latest weight, pain, energy + 1 motivational note.
- **API**: `GET /daily-summary?date=…`

### DB-002 Dashboard: Nutrition Graphs

- **Story**: Daily/weekly kcal & macros bar/line charts.
- **API**: `GET /nutrition/summary`, `GET /nutrition/weekly`

### DB-003 Dashboard: Weight & Waist Trends

- **Story**: Line charts with weekly averages.
- **API**: `GET /biometrics/trends`

### DB-004 Dashboard: Pain & Mood Charts

- **Story**: Area/line charts for recent 14–30 days.
- **API**: `GET /biometrics/trends`

### DB-005 Date Range & Filter Controls

- **Story**: Switch day/week views, pick date ranges.

### DB-006 Widget System (Extensible)

- **Story**: Widgets register via config; supports future modules.

---

## 5. Companion Layer (MVP)

**Goal**: Friendly daily feedback (no “smart” coaching yet).

### CO-001 Generate Daily Summary Text

- **Story**: System composes 2–3 sentences from today’s logs.
- **API**: `GET /companion/daily?date=…`

### CO-002 Reminder Notifications

- **Story**: Nudges to log meals/weight by configurable times.
- **Infra**: Sched job + push

### CO-003 Message History

- **Story**: View last 7–30 days of summaries.
- **API**: `GET /companion/history`

### CO-004 Tone Settings

- **Story**: Choose tone (neutral/friendly/brief).

### CO-005 Voice Memo Capture (Record Only)

- **Story**: Tap mic to record a short note; store audio + transcript (no analysis yet).
- **API**: `POST /companion/memo`

---

## 6. Cross-Cutting / Platform

**Goal**: Make the app implementable and testable from day one.

### CX-001 OpenAPI 3.1 Skeleton & Generated SDK

- **Files**: `/apps/backend/openapi.yaml → /packages/sdk`

### CX-002 Auth (Single-User Mode) + Local Lock

- **Story**: Local PIN/biometric to open app; no multi-tenant yet.

### CX-003 Data Models & DB Migrations

- **Entities**: Profile, Goal, Meal, MealItem, Hydration, BiometricReading (weight/waist/bp/hr), PainEntry, MoodEntry, DailySummary, CompanionMessage.

### CX-004 Local-First Storage & Sync Jobs

- **Story**: Log offline; sync on reconnect; conflict resolution = last-write-wins.

### CX-005 Error Handling & Telemetry

- **Story**: Structured logs, crash reporting, basic metrics.

### CX-006 Theming & Accessibility Baseline

- **Story**: Dark mode; minimum tap sizes; screen reader labels.

---

## Recommended Implementation Order (Parallelizable)

- **Wave A (infra + primitives)**: CX-001/002/003, UP-001/002/003, BI-001/002.
- **Wave B (nutrition core)**: NU-001/002/003/004 + NU-006; DB-001.
- **Wave C (biometrics & charts)**: BI-003/004/005/006/007; DB-002/003/004/005.
- **Wave D (polish & companion)**: NU-005/007/008; CO-001/002/003/004; DB-006; UP-005; CX-004/005/006.
- **(Optional stretch)**: Voice memo CO-005.

---

## 🗺 Final Waves Plan – V1 MVP

### Wave 1 – Foundations & Profile

(Get the app skeleton running, profile stored, and schema/API contracts in place.)

- **CX-001**: OpenAPI Skeleton & SDK
- **CX-003**: Data Models & DB Migrations
- **CX-002**: Auth (Single-User Mode) + Local Lock
- **UP-001**: Onboarding: Demographics Form
- **UP-002**: Baseline Health & Pain Areas
- **UP-003**: Goal Setting (weight/fitness/sleep/pain)
- **UP-004**: Profile Storage & Sync

### Wave 2 – Nutrition Core

(Enable food logging end-to-end, from photo → recognition → edit → manual entry.)

- **NU-001**: Capture/Upload Meal Photo
- **NU-002**: Food Recognition
- **NU-003**: Edit Detected Items & Portions
- **NU-004**: Manual Meal Entry (No Photo)
- **NU-005**: Hydration Quick Log

### Wave 3 – Biometrics Core

(Enable basic health logs beyond food: weight, waist, BP/HR, pain, mood/energy.)

- **BI-001**: Weight Quick Log
- **BI-002**: Waist Circumference (Weekly)
- **BI-003**: BP & Resting HR
- **BI-004**: Pain Log
- **BI-005**: Mood/Energy Quick Log

### Wave 4 – Summaries & Dashboards

(Aggregate and visualize data for daily/weekly tracking.)

- **NU-006**: Daily Nutrition Summary
- **NU-007**: Weekly Overview
- **BI-006**: Trends: Weight & Waist Charts
- **BI-007**: Trends: Pain & Mood Charts
- **DB-001**: Daily Summary Card (Home)
- **DB-002**: Nutrition Graphs
- **DB-003**: Weight & Waist Trends
- **DB-004**: Pain & Mood Charts
- **DB-005**: Date Range & Filter Controls
- **DB-006**: Widget System

### Wave 5 – Companion Basics

(Make the app feel alive and supportive — nudges, notes, and personal tone.)

- **CO-001**: Generate Daily Summary Text
- **CO-002**: Reminder Notifications
- **CO-003**: Message History
- **CO-004**: Tone Settings
- **CO-005**: Voice Memo Capture (Record Only)

### Wave 6 – Cross-Cutting Robustness

(Make it production-ready: offline, errors, theming, telemetry.)

- **CX-004**: Local-First Storage & Sync Jobs
- **NU-008**: Offline Queue & Sync for Meals (nutrition-specific, extends CX-004)
- **CX-005**: Error Handling & Telemetry
- **CX-006**: Theming & Accessibility

### ✅ Why this plan works

- **Wave 1–3**: Focus on input (profile + food + biometrics).
- **Wave 4**: Build output (summaries + dashboards).
- **Wave 5**: Add companion (engagement layer).
- **Wave 6**: Hardening (offline-first, error handling, theming).

This ensures you can ship a usable loop by Wave 2–3, then enrich with dashboards/companion in Waves 4–5, and harden for real-world use in Wave 6.
