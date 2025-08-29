# Dashboard - DB-005 Date Range & Filter Controls

## User Story

As a user, I want to change date ranges and filters on charts so that I can explore my data.

## Goals

- Range presets: 7d, 14d, 30d, 90d.
- Module-specific filters (e.g., macros on/off).

## Non-Goals

- Custom arbitrary ranges (future).

## UX / Flow

- Each chart has a range dropdown (default depends on chart).
- Filters shown as simple toggles.

## Acceptance Criteria

- [ ] Changing range updates API query and chart.
- [ ] Filters persist per session.
- [ ] Defaults sensible per widget.

## Tasks (Frontend)

- Range control component (shared).
- Local persistence for selections.
