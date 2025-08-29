# 📄 Product Requirement Document (PRD)

## Version 4 – Doctor’s Plan Integration

### 1. Objective

Enable the user to import and follow personalized health plans (nutrition, training, lifestyle) created by a doctor or coach.
The system should track adherence, provide alerts when drifting from the plan, and allow doctors to update plans.

This creates a bridge between self-tracking and professional medical/nutritional oversight.

### 2. Target Users

- **Primary**: You (single user, importing doctor’s recommendations).
- **Secondary (future)**: Doctors or nutritionists who can input/update plans directly via a portal.

### 3. Core Features (V4 Scope)

#### 3.1 Plan Input Module

- User can manually input doctor’s plan:
  - Nutrition targets (calories, macros, meal timing).
  - Training targets (sessions per week, type, intensity).
  - Sleep goals (hours, bedtime consistency).
  - Lifestyle goals (stress coping actions, weight loss target).
- Support upload/import structured plan (PDF or text).
- **Future**: doctor can log in and directly assign plan.

#### 3.2 Adherence Tracker

- Compare actual logs vs. plan goals:
  - **Nutrition**: daily intake vs. calorie/macro targets.
  - **Training**: logged workouts vs. prescribed.
  - **Sleep**: average vs. target.
  - **Stress**: log vs. target reduction.
- Display adherence percentage (daily, weekly, monthly).
- Track streaks and consistency.

#### 3.3 Alerts & Notifications

- **Drift Alerts**:
  - “You are 25% below protein target for 3 days.”
  - “Missed 2 training sessions this week vs. plan.”
- **Positive Alerts**:
  - “You hit your sleep goal 5 nights in a row.”
- **Compensation Advice**:
  - If off track → suggest lighter meal, extra walk, recovery adjustment.

#### 3.4 Companion Layer (Upgraded)

- Integrates plan adherence into daily/weekly summaries.
- Example:
  - “Today you met 80% of your nutrition target but missed your protein goal.”
  - “This week you hit your training plan perfectly — well done!”

#### 3.5 Dashboard Module (Expanded)

- **New Adherence Dashboard** with:
  - Nutrition adherence %
  - Training adherence %
  - Sleep adherence %
  - Stress adherence %
- Visualize plan vs. actual (bars, charts).

### 4. Data Model (Extended)

- **PlanEntity**: nutrition targets, training targets, sleep targets, stress/lifestyle targets, doctor name/date.
- **AdherenceEntry**: actual vs. target, percentage, date.
- **Extend DailySummary**: add adherence score.

### 5. User Flow

User enters doctor’s plan (manual or import).

User logs nutrition, sleep, training, stress as usual (from V1–V3).

System compares logs vs. plan → calculates adherence.

Companion + Dashboard show adherence summaries.

Alerts fire when user drifts significantly from the plan.

### 6. Tech & Architecture Notes

Backend:

Add /plans module (store doctor’s plan).

Add /adherence module (calculate % compliance).

Frontend:

New UI for entering doctor’s plan.

Adherence Dashboard.

Companion messages include adherence feedback.

APIs:

POST /plans (create plan)

GET /plans (view plan)

GET /adherence (daily/weekly/monthly stats)

Security: all plan data tied to user, encrypted in DB.

### 7. Success Metrics (V4)

User can enter/import doctor’s plan with <10 min effort.

Adherence score generated daily with ≥95% accuracy.

≥70% of daily summaries include adherence context.

Drift alerts fire within 24h of missed/low compliance.

### 8. Out of Scope (Future Versions)

Doctor portal for real-time updates (V7).

Wearable/lab integration (V5).

Men’s/Women’s health suite (V6).

---

✅ Summary

Version 4 transforms the app into a doctor-assisted health platform. The user can input a personalized plan, the system tracks adherence, and the companion delivers feedback and alerts. This is the first step toward closing the loop between patient and doctor.
