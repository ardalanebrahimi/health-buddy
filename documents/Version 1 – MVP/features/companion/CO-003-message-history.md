# Companion - CO-003 Message History

## User Story

As a user, I want to scroll my past companion notes so that I can review progress.

## Goals

- List past daily messages by date.
- Quick filter by week.

## Non-Goals

- Search or tagging (future).

## UX / Flow

- Companion → History tab → list of notes (date + text).
- Tap opens day’s daily summary.

## API

- GET /companion/history?days=30

## Data Model

- companion_messages(id, user_id, date, note, created_at)

## Acceptance Criteria

- [ ] Shows last 30 days by default.
- [ ] Tap to open that day’s summary.
- [ ] Empty state handled.

## Tasks (Backend)

- Endpoint + SDK.

## Tasks (Frontend)

- History list UI; link to daily summary.
