# 📄 Product Requirement Document (PRD)

## Version 3 – Smart Insights & Recommendations

### 1. Objective

Transform the app from a passive logging tool into an active health companion.
Version 3 introduces smart insights that connect data across modules (nutrition, sleep, training, stress, biometrics) and provide contextual recommendations.

This is the first version where the app feels like a “coach,” not just a diary.

### 2. Target User

- **Primary**: You (single-user).
- **Future**: Expandable to others with personalization.

### 3. Core Features (V3 Scope)

#### 3.1 Insights Engine

- **Nutrition Insights**:
  - Macro balance (protein, carbs, fat).
  - Identify under/over-eating patterns (e.g., “3 days in a row above calorie target”).
  - Snacking frequency detection.
- **Sleep Insights**:
  - Sleep debt over time.
  - Link sleep quality to energy, stress, and workouts.
- **Training Insights**:
  - Training load trends (weekly volume).
  - Correlate pain with training type/intensity.
- **Stress/Mood Insights**:
  - Detect recurring high-stress periods.
  - Link stress levels with poor sleep or overeating.

#### 3.2 Recommendations Engine

- **Nutrition**:
  - “Protein intake is low this week — add one protein-rich snack daily.”
  - “Yesterday’s calories were high — today balance with lighter dinner.”
- **Sleep**:
  - “Average sleep this week is <6h — try moving bedtime 30 min earlier.”
- **Training**:
  - “You trained 4× this week but logged high pain — reduce load and focus on mobility tomorrow.”
- **Stress**:
  - “Stress rated 7/10 for 3 days — schedule a 15 min walk or breathing session.”
- **Compensation Tips**:
  - Cheat-day recovery (e.g., “Add 20 min walk today to balance extra calories yesterday”).

#### 3.3 Companion Layer (Upgraded)

- **Daily messages** include context + advice. Example:
  - “You slept only 5.5h, but planned a heavy workout — consider lowering intensity.”
  - “This week stress has been high and food intake increased. Would you like tips for managing stress eating?”
- **Weekly digest**: summary of progress, patterns, and suggested focus for next week.

#### 3.4 Dashboard Module (Upgraded)

- **Correlation Views**:
  - Nutrition vs weight.
  - Sleep vs stress.
  - Training vs pain.
- **Trend Highlights**: system automatically flags notable patterns.

### 4. Data Model (Extended)

- **Add InsightsEntry**: type (nutrition/sleep/training/stress), description, date.
- **Add RecommendationEntry**: suggestion, trigger condition, user response (accepted/ignored).
- **Extend Companion**: store history of recommendations + user feedback.

### 5. User Flow

User logs food, sleep, training, stress, biometrics (from V1–V2).

Insights Engine runs nightly → generates insights & recommendations.

Companion delivers daily summary with advice + weekly digest.

User accepts/ignores recommendation → stored for learning.

Dashboard highlights correlations & flagged patterns.

### 6. Tech & Architecture Notes

Backend:

Add /insights module (analyzes data).

Add /recommendations module (rules-based engine at first, AI later).

Frontend:

Companion messages UI → highlight advice separately from logs.

Dashboard → add correlations view.

APIs:

GET /insights/daily

GET /insights/weekly

POST /recommendations/feedback

Initial Logic: rule-based triggers (if protein < target 3 days → advice).

Future Logic: ML personalization (later versions).

### 7. Success Metrics (V3)

≥80% of daily summaries include at least 1 insight or recommendation.

≥50% of recommendations receive a user response (accept/ignore).

User reports (self) that companion feels more “coach-like” than in V1–V2.

### 8. Out of Scope (Future Versions)

Doctor’s plan integration (V4).

Wearable/lab data (V5).

Men’s/Women’s health suite (V6).

Multi-user SaaS features (V7).

---

✅ Summary

Version 3 is the “intelligence upgrade”: the app moves from being a tracker to being an assistant/coach. It connects the dots across nutrition, sleep, training, stress, and biometrics, and starts giving practical, actionable advice. This is also the first version where the companion feels personalized and context-aware.
