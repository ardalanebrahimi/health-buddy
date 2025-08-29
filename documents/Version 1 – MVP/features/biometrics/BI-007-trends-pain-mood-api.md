# Biometrics - BI-007 Trends: Pain & Mood Charts (API)

## User Story

As a developer, I need endpoints that return pain and mood time series so that the dashboard can render charts.

## Goals

- Return daily series for last 14/30 days.
- Include latest value highlight flag.

## Non-Goals

- Correlations (V3).

## API

- GET /biometrics/trends?type=pain&range=30d
- GET /biometrics/trends?type=mood&range=30d
  - Response: { "points":[{"t":"2025-08-20","value":6},...], "latestIndex": 12 }

## Data Model

- Reads from biometrics_pain, biometrics_mood.

## Acceptance Criteria

- [ ] Time-ordered arrays; empty safe.
- [ ] latestIndex present when any data exists.

## Tasks (Backend)

- Implement queries + cache.
- OpenAPI + SDK.

## Tasks (Frontend)

- Consumed by DB-004 charts.
