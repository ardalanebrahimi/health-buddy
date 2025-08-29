# Companion - CO-005 Voice Memo Capture (Record Only)

## User Story

As a user, I want to record a short voice memo so that I can capture how I feel without typing.

## Goals

- Capture audio (≤60s), store file + optional transcript.
- No analysis yet (store & view only).

## Non-Goals

- NLU or recommendations (future V3/V6).

## Assumptions

- Use device mic; Whisper (or OS STT) optional for transcript.

## UX / Flow

1. Tap mic → record up to 60s → stop → Save.
2. Memo appears in history list with date + duration; transcript if enabled.

## API

- POST /companion/memo (multipart: audio, takenAt)
  - Response: { "id":"uuid","audioUrl":"...","transcript": "optional" }
- GET /companion/memo/recent?limit=20

## Data Model

- companion_memos(id, user_id, audio_url, transcript, taken_at, created_at)

## Acceptance Criteria

- [ ] Record, save, and list memos.
- [ ] Optional transcript toggled in settings.
- [ ] 60s limit enforced; graceful errors.

## Tasks (Backend)

- Endpoint + storage (S3/GCS).
- Optional STT job.

## Tasks (Frontend)

- Recorder UI (Capacitor plugin).
- List + playback + delete (optional confirm).
