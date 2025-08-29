# 📑 Comprehensive Health Companion App (Draft)

## 1. Core Layer (Foundation)

### User Profile Module

- Basic demographics, health history, goals
- Doctor's personalized plan input

### Data Capture Framework

- Manual entry (food, sleep, activity, metrics, mood, pain)
- Photo-based input (food recognition, portion estimate, nutrition lookup)
- Future integrations: wearables (steps, HR, sleep), smart scales, BP monitors

### Dashboard / Analytics Layer

- Modular widgets (nutrition, sleep, training, pain, stress, weight trends)
- Global summary dashboard (status + coach notes)
- Drill-down dashboards per module

## 2. Nutrition & Eating Module

- Photo food logging with AI recognition (auto food, portion, calories, macros)
- Manual correction/editing
- Daily/weekly nutrition summary (calories, protein, fiber, macros, hydration)
- Habit markers: meal timing, snacking frequency, fasting windows
- Alerts: drift from target, consistency trends
- Recommendations: adjustments, "compensate for cheat day" guidance

## 3. Training & Movement Module

- Workout logging (manual: exercise, reps, sets, load, RPE; or simple duration/intensity)
- Prescribed plan vs. actual adherence
- Track cardio (duration, HR if available)
- Track steps / NEAT (manual at first, wearable later)
- Pain/adaptation notes after workouts
- Recommendations: training load adjustment, safe exercise cues

## 4. Sleep & Recovery Module

- Manual sleep logs (bedtime, wake, perceived quality)
- Add symptoms: snoring, apnea awareness, nocturia, dreams, bruxism, daytime sleepiness
- Later: wearable sleep data (duration, efficiency, HRV)
- Trends: sleep debt, quality score, correlation with food/exercise/stress
- Recommendations: bedtime hygiene, recovery priority days

## 5. Biometrics & Health Metrics Module

### Manual inputs:

- Weight, waist, BP, HR, pain level, mood, energy
- Weekly averages and progress charts
- Pain diary (location, severity, triggers)
- Alerts: high BP, rapid weight changes, persistent high pain
- Future labs tracking: integrate key blood values (doctor entry)

## 6. Stress & Mental Health Module

- Stress self-report (scale 1–10, context)
- Mood tracking (emoji/quick log)
- Stress coping actions (nature, social, music, meditation)
- Recommendations: micro-break reminders, recovery suggestions
- Later: integrate journaling or CBT-style micro-coaching

## 7. Men's Health & Lifestyle Module (optional extension)

- Libido/sexual health tracking (scale/logs)
- Symptom diary for hormones (fatigue, muscle, hair changes, etc.)
- Energy & productivity tracking
- Later: doctor-lab integration (testosterone, thyroid, metabolic markers)

## 8. Coaching & Companion Layer

### Companion view (home screen):

- Today's status (summary, motivational message, priority action)
- Coach tone: friendly, supportive, not clinical

### Recommendations Engine:

- Combine module data into holistic advice ("Low sleep + high stress → reduce training intensity today")

### Alerts:

- Drift from plan (food, training, sleep)
- Positive reinforcement (streaks, consistency)
- Smart compensation tips ("today add 20 min walk to balance yesterday")

## 9. Doctor / Professional Portal (Future Vision)

- Doctor can input personalized plan/goals
- View patient's tracked data (nutrition, sleep, biometrics, adherence)
- Suggest updates directly in app
- Patient receives plan updates + alerts

## 10. System & Architecture

- Modular architecture: each module independent, syncs into central dashboard + recommendation engine
- Mobile-first, offline-friendly logging
- Cloud sync for dashboards & future web portal
- Privacy & security: local-first data with user consent for doctor sharing

## 🧭 Notes / Design Guidelines

- **MVP Phase**: start with Nutrition module (photo + calories) + basic Dashboard (weight, pain, sleep, training logs).
- **Expansion**: Add Sleep + Training modules next (since they're strongly linked to your health issues).
- **Tone**: Companion-first (daily AI coach face), dashboard as secondary.
- **Flexibility**: Every module should stand alone but integrate at dashboard + recommendation engine level.
- **Future path**: From personal app → generalized app with doctor buy-in.
