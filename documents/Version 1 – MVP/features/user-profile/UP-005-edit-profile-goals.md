# User Profile - UP-005 Edit Profile & Goals

## User Story

As a user, I want to edit my profile and goals so that my targets stay current.

## Goals

- Edit demographics, baseline notes.
- Edit goals (weight target, calorie/protein targets).

## Non-Goals

- Plan adherence (V4).

## Assumptions

- Initial profile/goals exist (UP-001/003).

## UX / Flow

1. Settings → Profile.
2. Edit fields, validation on save.
3. Toast on success; summary updates.

## API

- **GET /profile**, **PATCH /profile**
- **GET /goals**, **PUT /goals**

## Data Model

- Reuse `profiles`, `goals`.

## Acceptance Criteria

- [ ] Edits persist and reflected across app.
- [ ] Validation (height, weight ranges).
- [ ] Works offline with queued sync.

## Telemetry

- Log: `profile_updated`, `goals_updated`.

## Tasks (Backend)

- [ ] PATCH/PUT handlers; validation.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Forms + client validation.
- [ ] Optimistic update + rollback on error.
