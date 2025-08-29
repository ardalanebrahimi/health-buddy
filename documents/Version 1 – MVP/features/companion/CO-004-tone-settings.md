# Companion - CO-004 Tone Settings

## User Story

As a user, I want to choose the tone of messages so that the app feels right for me.

## Goals

- Tone presets: brief, friendly, neutral.
- Stored in profile settings.

## Non-Goals

- Per-message tone switching.

## UX / Flow

- Settings → Companion Tone → radio buttons (brief/friendly/neutral).

## API

- PATCH /profile/preferences { "companionTone":"friendly" }
- GET /profile/preferences

## Data Model

- profiles.preferences_json.companionTone

## Acceptance Criteria

- [ ] Companion uses selected tone.
- [ ] Default = friendly.

## Tasks (Backend)

- Preferences endpoints; persist JSON.

## Tasks (Frontend)

- Settings UI; apply tone on next generation.
