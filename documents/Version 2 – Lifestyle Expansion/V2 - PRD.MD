# 📄 Product Requirement Document (PRD)

## Version 2 – Lifestyle Expansion

### 1. Objective

Expand the MVP into a comprehensive lifestyle logger by adding sleep, training, and stress tracking modules. The goal is to go beyond food and biometrics to capture the daily context of health. This version still focuses on manual logging, but it sets the foundation for smart insights (Version 3).

### 2. Target User

- **Primary**: Same as Version 1 (you, single user).
- **Future**: Extensible for general users.

### 3. Core Features (V2 Scope)

#### 3.1 Sleep & Recovery Module

- **Manual Logging**: bedtime, wake time, sleep duration, sleep quality (scale 1–10).
- **Symptoms Log**: snoring, apneas noticed, nocturia (bathroom visits), bad dreams, teeth grinding, daytime sleepiness.
- **Visuals**: daily/weekly sleep charts (duration + quality).
- **Future Hook**: Wearable integration (planned V5).

#### 3.2 Training & Movement Module

- **Workout Log**:
  - Exercise type (strength, cardio, mobility).
  - For strength: exercise name, sets, reps, weight, RPE.
  - For cardio: type, duration, intensity.
- **Activity Log**: steps (manual entry for now).
- **Pain/limitation notes**: e.g., “elbow sore after workout.”
- **Visuals**: weekly training volume, cardio duration.
- **Future Hook**: Plan vs. actual adherence (V4).

#### 3.3 Stress & Mental Health Module

- **Stress log**: daily scale 1–10.
- **Mood log**: emoji or short text.
- **Coping actions**: (select or type) → nature, family time, music, etc.
- **Visuals**: mood/stress trend chart, correlation with sleep/nutrition (future).
- **Future Hook**: journaling, CBT micro-coach (V6).

#### 3.4 Dashboard Module (Expanded)

- **Daily overview**:
  - Nutrition (from V1)
  - Biometrics (from V1)
  - Sleep (new)
  - Training (new)
  - Stress/mood (new)
- **Weekly dashboard**: roll-up of nutrition, sleep, training, stress.
- **Navigation**: companion still primary home → dashboard secondary.

#### 3.5 Companion Layer (Upgraded)

- **Daily check-in**: “How did you sleep? Any stress today?”
- **Summaries**: “This week you slept avg 6h, trained 2×, stress 7/10.”
- **Tone**: still friendly, supportive; no deep analysis yet.

### 4. Data Model (New/Extended Entities)

- **SleepEntry**: bedtime, wake time, duration, quality, symptoms.
- **WorkoutEntry**: type, exercises (sets, reps, weight), duration, notes.
- **StressEntry**: stress level, coping actions.
- **MoodEntry**: mood scale/emoji, optional note.
- **Extend DailySummary**: add sleep duration, training volume, stress/mood avg.

### 5. User Flow

- **Morning**: log previous night’s sleep (bed/wake, quality).
- **During day**: log workouts (or steps), log mood/stress as needed.
- **Evening**: quick stress/mood log.
- **Companion**: shows summary of food + biometrics + sleep + training + stress.
- **Dashboard**: user checks trends weekly.

---
