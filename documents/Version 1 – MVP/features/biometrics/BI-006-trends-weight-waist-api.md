# Biometrics - BI-006 Trends: Weight & Waist Charts (API)

## User Story

As a developer, I need endpoints that return weight/waist time series so that the dashboard can render trends.

## Goals

- Return ordered time series + simple moving average.
- Range params (14/30/90d).

## Non-Goals

- Correlation analytics (V3).

## API

- GET /biometrics/trends?type=weight&range=30d
  - { "points":[{"t":"2025-08-01","value":110.2},...], "sma7":[...] }
- GET /biometrics/trends?type=waist&range=90d
  - weekly aggregation for waist

## Data Model

- Read from biometrics_weight/waist; optional materialized views.

## Acceptance Criteria

- [ ] Time-ordered arrays with timestamps.
- [ ] Includes SMA7 for weight.
- [ ] Handles empty data gracefully.

## Tasks (Backend)

- Implement queries + cache.
- OpenAPI + SDK.

## Tasks (Frontend)

- Consumed by DB-003 charts.
