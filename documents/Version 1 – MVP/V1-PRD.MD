# 📄 Product Requirement Document (PRD)

## Version 1 – MVP: Health Companion (Self-Logging Core)

### 1. Objective

Build a mobile-first health companion app (with optional web support) that enables simple, daily self-logging of nutrition and key health metrics, supported by an AI companion layer that summarizes data and motivates the user.
This MVP is designed for one user (yourself) but structured modularly so it can later expand to support multiple users, doctors, and specialized modules (e.g., men’s/women’s health suites).

### 2. Target User

- **Primary user (MVP)**: You (single-user mode).
- **Future**: Other individuals (general public), doctors/health coaches.

### 3. Core Features (MVP Scope)

#### 3.1 User Profile Module

- Collect basic demographics: age, sex, height, weight, activity level.
- Collect baseline health info: known conditions, pain areas, goals.
- Allow definition of personal goals (weight, fitness, sleep, pain).
- Support future branching (men’s/women’s health questionnaires).

#### 3.2 Nutrition Module

- Photo-based food logging:
  - Take a picture of meal/snack.
  - AI detects food type, portion size, estimates calories & macros.
  - Manual correction/editing (food type, quantity).
- Daily nutrition summary: calories, macros (protein, carbs, fats), hydration.
- Weekly overview: average intake vs. goals.

#### 3.3 Biometrics Module

- Manual tracking of:
  - Weight (daily)
  - Waist circumference (weekly)
  - Blood pressure & resting heart rate (manual entry)
  - Pain log (scale 1–10, location, notes)
  - Mood/energy log (quick scale or emoji selector)
- Visualize trends (simple charts: daily, weekly averages).

#### 3.4 Dashboard Module

- **Home screen**:
  - Daily summary (nutrition intake, key biometrics, motivational note).
  - Not a data-heavy dashboard — focus on companion view.
- **Dashboard (secondary view)**:
  - Nutrition graph (daily/weekly calories & macros).
  - Weight & waist trends.
  - Pain & mood chart.
  - Modular widget-based design → expandable later.

#### 3.5 Companion Layer (MVP)

- **Tone**: Friendly coach/companion, not clinical.
- **Daily summary**: "Here’s how today went — nutrition, weight, pain, energy."
- **Motivation**: Gentle reminders & encouragement.
- **Future hooks**: Smart recommendations (planned for V2+).

### 4. Data Model

- **User Profile**: demographics, goals.
- **Meal Logs**: photo, detected items, manual edits, calories, macros.
- **Biometrics**: weight, waist, BP, HR, pain, mood.
- **Daily Summary**: aggregates nutrition + biometrics.
- **Dashboard Data**: visualization of logs.

### 5. User Flow

- **Onboarding**: enter profile, goals.
- **Daily use**:
  - Take photo → food recognized → calories/macros suggested → user edits if needed.
  - Log weight, pain, mood (quick input).
  - Companion summary: daily feedback & motivation.
  - Dashboard: user checks trends weekly.

### 6. Tech & Architecture Notes

Mobile-first (Android/iOS), web optional.

Modular architecture: nutrition, biometrics, dashboard, companion as separate modules.

AI service integration: photo recognition for food (initially via external API).

Local-first storage with sync to cloud.

Security: private, single-user.

### 7. Success Metrics (MVP)

Daily food logging adherence ≥70%.

Daily biometric input adherence ≥60%.

User able to view at least 3 meaningful trend charts (nutrition, weight, pain).

Companion summary delivered daily without fail.

### 8. Out of Scope (Future Versions)

Sleep, training, stress tracking (V2).

Recommendation engine (V3).

Doctor plan integration (V4).

Wearable integration (V5).

Men’s/Women’s health suite (V6, with questionnaire branching).

Multi-user support & doctor portal (V7).

✅ Summary

This MVP delivers core tracking + companion feedback: food (photos), biometrics, dashboard, daily summary. It is intentionally modular so you can layer on sleep, training, stress, and eventually men’s/women’s health in later versions.
