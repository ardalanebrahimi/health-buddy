# Cross - CX-005 Error Handling & Telemetry

## User Story

As a developer, I want consistent error handling and telemetry so that issues can be diagnosed quickly.

## Goals

- Global error boundary + user-friendly messages.
- Structured logs; basic metrics; crash reporting.

## Non-Goals

- Full observability stack (V5+).

## Acceptance Criteria

- [ ] API errors show helpful toasts (no stack traces).
- [ ] Logs include correlation IDs for requests.
- [ ] Crash reporting wired (e.g., Sentry).

## Tasks (Backend)

- [ ] Pino logger; request IDs; error middleware.

## Tasks (Frontend)

- [ ] Global HTTP interceptor; toast service.
- [ ] Sentry (or similar) integration.
