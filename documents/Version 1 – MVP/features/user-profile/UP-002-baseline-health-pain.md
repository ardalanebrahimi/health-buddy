# User Profile - UP-002 Baseline Health & Pain Areas

## User Story

As a user, I want to record my baseline health and pain areas so that the system knows my starting point.

## Goals

- Capture known conditions and pain locations.
- Store free-text notes.

## Non-Goals

- Ongoing pain tracking (handled in BI-004).

## Assumptions

- Part of onboarding wizard.

## UX / Flow

1. After demographics → Baseline Health screen.
2. Fields: known conditions (multi-select), pain areas (multi-select: lower back, shoulders, elbows, coccyx, other), free-text notes.
3. Save → continue to goals.

## API

- **PATCH /profile/baseline**
  - `{ "conditions":["overweight"],"painAreas":["lower_back","shoulders"],"notes":"chronic back pain" }`

## Data Model

- `profiles.baseline_json` (jsonb).

## Acceptance Criteria

- [ ] User can select multiple conditions/pain areas.
- [ ] Free-text notes saved.
- [ ] Returned in GET /profile.

## Tasks (Backend)

- [ ] PATCH endpoint.
- [ ] JSON schema validation.
- [ ] OpenAPI + SDK.

## Tasks (Frontend)

- [ ] Multi-select UI.
- [ ] Notes text box.
- [ ] Call API + local cache.
