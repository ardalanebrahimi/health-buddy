# Cross - CX-001 OpenAPI 3.1 Skeleton & SDK

## User Story

As a developer, I want an OpenAPI-first backend so that the frontend can use a generated SDK and stay in sync with contracts.

## Goals

- Single `openapi.yaml` with tags for V1 modules.
- CI step to generate TypeScript SDK package.
- Example controller stubs wired to spec.

## Non-Goals

- Full endpoint coverage beyond V1 features.

## Assumptions

- Backend is NestJS; generator is openapi-typescript-codegen (or similar).

## Scope (initial paths)

- `/profile`, `/goals`
- `/meals`, `/meals/photo`, `/meals/{mealId}/recognize`, `/nutrition/summary`
- `/hydration`
- `/biometrics/weight` (+ `/latest`)
- `/daily-summary`
- `/companion/daily`, `/companion/history`

## Acceptance Criteria

- [ ] `openapi.yaml` validates (3.1) and commits in repo.
- [ ] `packages/sdk` generated with typed clients.
- [ ] Frontend imports SDK for at least one call (smoke test).
- [ ] CI fails if spec invalid or SDK not regenerated after changes.

## Tasks (Backend)

- [ ] Author `openapi.yaml` with tags + schemas.
- [ ] Add script `yarn gen:sdk`.
- [ ] Wire NestJS route stubs to spec (routing-controllers or adapters).

## Tasks (Frontend)

- [ ] Use SDK for one endpoint (e.g., `GET /daily-summary`).
- [ ] Provide example of error handling with typed responses.

## Telemetry

- Build step logs: SDK gen success/failure.
