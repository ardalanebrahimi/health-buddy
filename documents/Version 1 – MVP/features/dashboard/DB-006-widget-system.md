# Dashboard - DB-006 Widget System

## User Story

As a user, I want modular widgets on the dashboard so that the system can easily add/remove sections as features grow.

## Goals

- Dashboard built as list of configurable widgets.
- Each widget pulls from its own endpoint.
- Widgets register via config, order adjustable later.

## Non-Goals

- User personalization (V2+).

## Assumptions

- Widgets = Angular components bound to SDK calls.

## UX / Flow

1. Home screen loads widget container.
2. Container queries config, renders widgets (daily summary, nutrition, weight, etc.).
3. Future modules can add new widgets without breaking layout.

## API

- None (config local for now).
- Future: `/dashboard/config`.

## Acceptance Criteria

- [ ] Dashboard loads from widget registry.
- [ ] Widgets can be added/removed without rewriting container.
- [ ] Default set: Daily Summary, Nutrition Graph, Weight Trend.

## Tasks (Frontend)

- [ ] WidgetContainer component.
- [ ] Registry file with widget list.
- [ ] Load order static for V1.
- [ ] Styling: card layout, responsive.

## Tasks (Backend)

- None (until config API needed).
