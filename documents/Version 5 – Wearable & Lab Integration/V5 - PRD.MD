# 📄 Product Requirement Document (PRD)

## Version 5 – Wearable & Lab Integration

### 1. Objective

Enhance the app’s accuracy and reduce manual logging effort by integrating wearables, smart devices, and lab results.
The goal is to create a continuous, automated health data stream that augments the manual logs from Versions 1–4.

### 2. Target Users

- **Primary**: You (single-user).
- **Secondary (future)**: General health-conscious users with wearables.
- **Future expansion**: Doctors tracking patient lab data.

### 3. Core Features (V5 Scope)

#### 3.1 Wearable Integration

- **Devices supported (Phase 1)**: Apple Health, Google Fit, Fitbit, Garmin.
- **Data imported automatically**:
  - Steps & distance
  - Heart rate (resting, average, max)
  - Sleep duration & stages
  - Calories burned (activity + basal est.)
- **Sync frequency**: daily background sync or manual refresh.

#### 3.2 Smart Device Integration

- **Supported devices (Phase 1)**:
  - Smart scales (weight, body fat, muscle %, water %)
  - Smart BP monitors
- **Integration method**: Bluetooth sync (via companion apps or direct).

#### 3.3 Lab Result Logging

- **Manual Upload**: user can upload lab results (PDF, text).
- **Structured Entry**: enter lab values manually (glucose, HbA1c, cholesterol, thyroid, testosterone, vitamin D, etc.).
- **Future**: direct lab API integration (if available).

#### 3.4 Dashboard Module (Expanded)

- **Wearable Dashboard**:
  - Steps trend
  - HR trend (resting HR as health marker)
  - Sleep stages (REM, deep, light)
- **Lab Dashboard**:
  - Lab values with reference ranges
  - Highlight abnormal values
- **Integration with Insights (from V3)**:
  - Example: “Resting HR is trending down → improved fitness.”
  - Example: “Vitamin D low — link to mood and fatigue logs.”

#### 3.5 Companion Layer (Upgraded)

- Adds wearable + lab context to summaries:
  - “Your wearable logged 8,200 steps today — great job hitting your target.”
  - “Your resting HR has dropped by 4 bpm this month.”
  - “Your lab shows low vitamin D — this may explain fatigue.”

### 4. Data Model (Extended)

- **WearableEntry**: steps, HR, sleep stages, calories.
- **DeviceEntry**: smart scale values, BP readings.
- **LabEntry**: lab name, value, unit, reference range, date.
- **Extend Insights**: add wearable/lab-based correlations.

### 5. User Flow

- **User connects wearable/smart device via settings.**
- **Data auto-syncs daily or on-demand.**
- **User uploads/enters lab results.**
- **Dashboard shows wearable + lab data integrated with nutrition, training, stress, biometrics.**
- **Companion interprets and delivers insights.**

---
