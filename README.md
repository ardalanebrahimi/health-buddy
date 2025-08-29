# Health Companion 🏥💪

A comprehensive health tracking application designed to help users monitor their wellness journey through biometrics, nutrition, mood tracking, and AI-powered insights.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (LTS version 18 or higher)
- **npm** (version 9 or higher)

### Development Setup

1. **Install dependencies**:

   ```cmd
   npm run install:all
   ```

2. **Start the backend API**:

   ```cmd
   npm run dev:api
   ```

   The API server will start on `http://localhost:3000`

   - Health check: `http://localhost:3000/health`
   - OpenAPI spec: `http://localhost:3000/api/openapi.yaml`

3. **Start the frontend** (in a new terminal):
   ```cmd
   npm run dev:web
   ```
   The Angular app will start on `http://localhost:4200`

### Build for Production

- **Backend**: `npm run build:api`
- **Frontend**: `npm run build:web`

### SDK Generation

Once APIs are defined in the OpenAPI spec, generate the TypeScript SDK:

```cmd
npm run gen:sdk
```

_(Note: OpenAPI generator needs to be installed separately when ready to generate)_

## 📖 Documentation

This repository contains detailed documentation for the Health Companion project, organized by development phases and feature areas.

### 📋 Project Overview

- **[Main Documentation Index](documents/index.md)** - Central hub for all project documentation
- **[Technical Architecture](documents/technical-architecture.md)** - System design and technical specifications
- **[Versioning Roadmap](documents/versioning-roadmap.md)** - Development phases and timeline

## 🗺️ Development Roadmap

### Version 1 - MVP 🚀

**[V1 Product Requirements Document](documents/Version%201%20–%20MVP/V1-PRD.MD)**  
**[V1 Feature List](documents/Version%201%20–%20MVP/V1-feature-list.MD)**

**Core Features:**

#### 📊 Biometrics Tracking

- [Weight Quick Log](documents/Version%201%20–%20MVP/features/biometrics/BI-001-weight-quick-log.md) - Simple weight tracking
- [Waist Circumference](documents/Version%201%20–%20MVP/features/biometrics/BI-002-waist-circumference.md) - Body measurements
- [Blood Pressure & Resting Heart Rate](documents/Version%201%20–%20MVP/features/biometrics/BI-003-bp-resting-hr.md) - Vital signs monitoring
- [Pain Log](documents/Version%201%20–%20MVP/features/biometrics/BI-004-pain-log.md) - Pain tracking and management
- [Mood & Energy Quick Log](documents/Version%201%20–%20MVP/features/biometrics/BI-005-mood-energy-quick-log.md) - Mental wellness tracking
- [Weight & Waist Trends API](documents/Version%201%20–%20MVP/features/biometrics/BI-006-trends-weight-waist-api.md) - Physical health analytics
- [Pain & Mood Trends API](documents/Version%201%20–%20MVP/features/biometrics/BI-007-trends-pain-mood-api.md) - Mental health analytics

#### 🤖 AI Companion

- [Daily Summary Generation](documents/Version%201%20–%20MVP/features/companion/CO-001-generate-daily-summary.md) - AI-powered health insights
- [Reminder Notifications](documents/Version%201%20–%20MVP/features/companion/CO-002-reminder-notifications.md) - Smart health reminders
- [Message History](documents/Version%201%20–%20MVP/features/companion/CO-003-message-history.md) - Conversation tracking
- [Tone Settings](documents/Version%201%20–%20MVP/features/companion/CO-004-tone-settings.md) - Personalized AI interaction
- [Voice Memo Capture](documents/Version%201%20–%20MVP/features/companion/CO-005-voice-memo-capture.md) - Voice-based logging

#### 🔧 Cross-Platform Infrastructure

- [OpenAPI Skeleton & SDK](documents/Version%201%20–%20MVP/features/cross/CX-001-openapi-skeleton-and-sdk.md) - API foundation
- [Authentication & Local Lock](documents/Version%201%20–%20MVP/features/cross/CX-002-auth-local-lock.md) - Security framework
- [Data Models & Migrations](documents/Version%201%20–%20MVP/features/cross/CX-003-data-models-and-migrations.md) - Database design
- [Local-First Storage & Sync](documents/Version%201%20–%20MVP/features/cross/CX-004-local-first-storage-sync.md) - Offline capabilities
- [Error Handling & Telemetry](documents/Version%201%20–%20MVP/features/cross/CX-005-error-handling-telemetry.md) - System monitoring
- [Theming & Accessibility](documents/Version%201%20–%20MVP/features/cross/CX-006-theming-accessibility.md) - UI/UX framework

#### 📈 Dashboard & Analytics

- [Daily Summary Card](documents/Version%201%20–%20MVP/features/dashboard/DB-001-daily-summary-card.md) - Health overview widget
- [Nutrition Graphs](documents/Version%201%20–%20MVP/features/dashboard/DB-002-nutrition-graphs.md) - Dietary analytics visualization
- [Weight & Waist Trends](documents/Version%201%20–%20MVP/features/dashboard/DB-003-weight-waist-trends.md) - Body metrics charts
- [Pain & Mood Charts](documents/Version%201%20–%20MVP/features/dashboard/DB-004-pain-mood-charts.md) - Wellness trend visualization
- [Date Range Filters](documents/Version%201%20–%20MVP/features/dashboard/DB-005-date-range-filters.md) - Timeline controls
- [Widget System](documents/Version%201%20–%20MVP/features/dashboard/DB-006-widget-system.md) - Customizable dashboard

#### 🍎 Nutrition Tracking

- [Meal Photo Capture & Upload](documents/Version%201%20–%20MVP/features/nutrition/NU-001-capture-upload-meal-photo.md) - Visual food logging
- [Food Recognition](documents/Version%201%20–%20MVP/features/nutrition/NU-002-food-recognition.md) - AI-powered food identification
- [Edit Detected Items & Portions](documents/Version%201%20–%20MVP/features/nutrition/NU-003-edit-detected-items-portions.md) - Manual food adjustments
- [Manual Meal Entry](documents/Version%201%20–%20MVP/features/nutrition/NU-004-manual-meal-entry.md) - Text-based food logging
- [Hydration Quick Log](documents/Version%201%20–%20MVP/features/nutrition/NU-005-hydration-quick-log.md) - Water intake tracking
- [Daily Nutrition Summary](documents/Version%201%20–%20MVP/features/nutrition/NU-006-daily-nutrition-summary.md) - Daily dietary overview
- [Weekly Overview](documents/Version%201%20–%20MVP/features/nutrition/NU-007-weekly-overview.md) - Weekly nutrition trends
- [Offline Queue & Sync](documents/Version%201%20–%20MVP/features/nutrition/NU-008-offline-queue-sync-meals.md) - Offline meal logging

#### 👤 User Profile & Onboarding

- [Onboarding & Demographics](documents/Version%201%20–%20MVP/features/user-profile/UP-001-onboarding-demographics.md) - User setup process
- [Baseline Health & Pain Assessment](documents/Version%201%20–%20MVP/features/user-profile/UP-002-baseline-health-pain.md) - Initial health evaluation
- [Goal Setting](documents/Version%201%20–%20MVP/features/user-profile/UP-003-goal-setting.md) - Personal health objectives
- [Profile Sync](documents/Version%201%20–%20MVP/features/user-profile/UP-004-profile-sync.md) - Data synchronization
- [Edit Profile & Goals](documents/Version%201%20–%20MVP/features/user-profile/UP-005-edit-profile-goals.md) - Profile management

### Future Versions 🔮

#### Version 2 - Lifestyle Expansion

**[V2 Product Requirements Document](documents/Version%202%20–%20Lifestyle%20Expansion/V2%20-%20PRD.MD)**

#### Version 3 - Smart Insights & Recommendations

**[V3 Product Requirements Document](documents/Version%203%20–%20Smart%20Insights%20&%20Recommendations/V3%20-%20PRD.MD)**

#### Version 4 - Doctor's Plan Integration

**[V4 Product Requirements Document](documents/Version%204%20–%20Doctor's%20Plan%20Integration/V4%20-%20PRD.MD)**

#### Version 5 - Wearable & Lab Integration

**[V5 Product Requirements Document](documents/Version%205%20–%20Wearable%20&%20Lab%20Integration/V5%20-%20PRD.MD)**

#### Version 6 - Full Lifestyle

**[V6 Product Requirements Document](documents/Version%206%20–%20Full%20Lifestyle/V6%20-%20PRD.MD)**

#### Version 7 - AI Coach

**[V7 Product Requirements Document](documents/Version%207%20–%20AI%20Coach/V7%20-%20PRD.MD)**

#### Version 7 - Doctor Portal & SaaS Expansion

**[V7 Doctor Portal PRD](documents/Version%207%20–%20Doctor%20Portal%20&%20SaaS%20Expansion/V7%20-%20PRD.MD)**

## 🚀 Getting Started

1. Start with the [Technical Architecture](documents/technical-architecture.md) to understand the system design
2. Review the [V1 Product Requirements Document](documents/Version%201%20–%20MVP/V1-PRD.MD) for MVP scope
3. Check the [V1 Feature List](documents/Version%201%20–%20MVP/V1-feature-list.MD) for detailed feature breakdown
4. Explore individual feature specifications in the respective folders

## 📁 Repository Structure

```
health-buddy/
├── README.md                          # This file
├── documents/                         # All project documentation
│   ├── index.md                      # Documentation index
│   ├── technical-architecture.md     # System architecture
│   ├── versioning-roadmap.md        # Development timeline
│   └── Version X - [Name]/          # Version-specific documentation
│       ├── VX-PRD.MD                # Product requirements
│       └── features/                # Feature specifications
│           ├── biometrics/          # Health tracking features
│           ├── companion/           # AI companion features
│           ├── cross/               # Cross-platform infrastructure
│           ├── dashboard/           # Analytics & visualization
│           ├── nutrition/           # Food & nutrition tracking
│           └── user-profile/        # User management
```

## 📝 Contributing

When contributing to this project:

1. Follow the established documentation structure
2. Update relevant feature specifications when making changes
3. Maintain consistency with the technical architecture
4. Update this README when adding new major sections or versions

---

**Health Buddy** - Your personal wellness companion 🌟
