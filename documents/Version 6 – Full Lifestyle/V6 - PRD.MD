# 📄 Product Requirement Document (PRD)

## Version 6 – Full Lifestyle & Men’s/Women’s Health Suite

### 1. Objective

Expand the app into a comprehensive health suite that personalizes based on gender-specific needs and adds depth in mental health and pain management.
The goal is to cover all pillars of lifestyle and health — body, mind, hormones, and long-term wellbeing.

### 2. Target Users

- **Primary**: You (single-user), selecting “men’s” path.
- **Secondary (future)**: General public, with a questionnaire at onboarding to personalize:
  - Men’s health suite
  - Women’s health suite

### 3. Core Features (V6 Scope)

#### 3.1 Men’s/Women’s Health Questionnaire (Onboarding Extension)

- At first login (or settings update), user chooses male / female / other → custom path.
- **Men’s health focus**: libido, erectile function, testosterone-related symptoms, muscle strength, abdominal fat, hair changes.
- **Women’s health focus**: menstrual cycle tracking, PMS symptoms, menopause/perimenopause tracking, bone health.
- **Shared**: thyroid-related symptoms, fertility/energy questions.
- Companion tailors questions, dashboards, and insights accordingly.

#### 3.2 Pain Diary (Expanded)

- **Detailed pain logging**:
  - Location (body map selector).
  - Severity (1–10).
  - Trigger (exercise, sitting, stress, sleep quality).
- **Correlation engine**: link pain to training load, sleep, stress, posture.
- **Dashboard**: pain heatmap + trend chart.

#### 3.3 Mental Health & Stress Module (Expanded)

- Beyond simple mood/stress logs (from V2):
  - Journaling: text/voice notes stored & transcribed.
  - CBT-style micro-coaching prompts (optional).
  - Track habits for wellbeing (meditation, screen time, social contact).
- **Correlation engine**: “Stress consistently high → poor sleep + increased snacking.”
- **Companion tone**: empathetic, supportive, not diagnostic.

#### 3.4 Lifestyle & Hormonal Insights

- **Men’s health examples**:
  - “Libido dropped alongside high stress and low sleep.”
  - “Waist circumference increased despite stable weight — abdominal fat risk.”
- **Women’s health examples**:
  - “Cycle tracking shows PMS symptoms correlate with poor sleep.”
  - “Hot flashes logged → may be linked to menopause stage.”
- **Shared insights**: connect hormone-related logs with mood, sleep, and nutrition.

#### 3.5 Companion Layer (Advanced)

- **Conversational intake**:
  - “Tell me what’s bothering you today” → captured as structured note (voice → text).
  - Companion routes data into relevant module (pain, mood, men’s/women’s health).
- **Context-aware insights**:
  - “You logged fatigue and stress, combined with poor sleep — would you like recovery tips?”
- **Weekly holistic summary**: body + mind + hormones.

#### 3.6 Dashboard Module (Expanded)

- **Holistic health dashboard**:
  - Nutrition, sleep, training, stress, pain, and men’s/women’s metrics.
- **Correlation views**:
  - Hormones vs. sleep/mood.
  - Pain vs. training load.
  - Stress vs. snacking.
- **Custom dashboards** depending on gender path.

### 4. Data Model (Extended)

- **HealthQuestionnaire**: gender path, answers, preferences.
- **PainEntry**: location, severity, trigger.
- **JournalEntry**: text, optional audio transcription.
- **HormonalEntry**: men’s/women’s-specific metrics (e.g., libido, cycle day).
- **Extend Insights**: correlations across pain, hormones, mental health.

### 5. User Flow

- **Onboarding (or settings)**: choose men’s/women’s health path.
- **Daily**: log pain, stress, mental state, hormonal/sexual health markers.
- **Companion**: asks contextual questions when irregularities appear.
- **Weekly**: user receives holistic summary (mind + body + hormones).
- **Dashboard**: explore correlations (pain triggers, mood cycles, libido vs sleep, etc.).

### 6. Tech & Architecture Notes

- **Backend**:
  - Add /questionnaire module.
  - Add /pain, /mentalhealth, /hormones modules.
- **Frontend**:
  - Dynamic onboarding (path selection).
  - Pain body map UI.
  - Journaling UI (text + voice input).
  - Gender-specific dashboards.
- **APIs**:
  - POST /pain
  - POST /mentalhealth/journal
  - POST /hormones
  - GET /correlations
- **AI services**:
  - Whisper API for voice-to-text journaling.
  - GPT for journaling insights (later).

### 7. Success Metrics (V6)

- ≥70% of users (you, later others) complete onboarding questionnaire.
- ≥50% log pain/mood/hormonal entries weekly.
- Companion references men’s/women’s health insights ≥30% of weekly summaries.
- Pain correlations detected in ≥80% of logs with training/sleep/stress context.

### 8. Out of Scope (Future Versions)

- Multi-user support (V7).
- Doctor portal (V7).
- Predictive ML for early diagnosis (future).

---

✅ **Summary**

Version 6 turns the app into a holistic health suite with gender-specific personalization. It integrates pain tracking, advanced stress/mental health features, and hormonal/lifestyle insights.
This is the version where the companion feels closest to a personal health assistant, able to record what you tell it, correlate across multiple domains, and give meaningful context-aware feedback.
