# Companion - CO-002 Reminder Notifications

## User Story

As a user, I want daily reminders to log meals and weight so that I stay consistent.

## Goals

- Configurable notifications (e.g., meal logging at 1pm, weight at 9am).
- Push/local notifications.
- Toggle reminders in settings.

## Non-Goals

- Smart adaptive reminders (V3+).

## Assumptions

- Mobile app with Capacitor push/local notifications plugin.

## UX / Flow

1. User opens Settings → Reminders.
2. Toggle Meal Reminder (time: default 13:00).
3. Toggle Weight Reminder (time: default 09:00).
4. Notifications fire locally at set times.

## API

- None (local config).
- Later sync in backend for multi-device.

## Data Model

- Local storage: `{ reminders: { meal: "13:00", weight: "09:00" } }`.

## Acceptance Criteria

- [ ] User can enable/disable reminders per type.
- [ ] Notifications appear at correct time daily.
- [ ] If disabled → no notifications.
- [ ] Works offline.

## Tasks (Frontend)

- [ ] Settings UI for reminders.
- [ ] Capacitor Local Notifications integration.
- [ ] Persist settings locally.

## Tasks (Backend)

- None (V1).
