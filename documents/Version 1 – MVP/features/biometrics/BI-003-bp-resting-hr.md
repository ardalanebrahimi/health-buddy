# Biometrics - BI-003 BP & Resting HR

## User Story

As a user, I want to log blood pressure and resting heart rate so that I can monitor cardiovascular metrics.

## Goals

- Log systolic/diastolic (mmHg), pulse (bpm).
- Log resting HR (bpm) separately.

## Non-Goals

- Hypertension risk advice (future insights).

## UX / Flow

- BP form: systolic, diastolic, pulse, takenAt.
- Resting HR form: bpm, takenAt.

## API

- POST /biometrics/bp { "systolic": 128, "diastolic": 82, "pulse": 72, "takenAt": "..." }
- GET /biometrics/bp/recent?limit=10
- POST /biometrics/hr { "bpm": 62, "takenAt": "..." }
- GET /biometrics/hr/recent?limit=10

## Data Model

- biometrics_bp(id, user_id, systolic, diastolic, pulse, taken_at, created_at)
- biometrics_hr(id, user_id, bpm, taken_at, created_at)

## Acceptance Criteria

- [ ] Entries saved & listed.
- [ ] Validation: BP/HR reasonable ranges.
- [ ] Latest values appear in daily summary if from today.

## Tasks (Backend)

- Endpoints + validation + SDK.

## Tasks (Frontend)

- Forms + recent list; offline support.
