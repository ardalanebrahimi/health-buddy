# GitHub Copilot Instructions

**Project:** Health Companion — V1 (MVP)  
**Audience:** Coding agents (Copilot/Claude/LLM-assisted contributors)  
**Mode:** OpenAPI-first • DDD modules • Backend-heavy logic • Offline-first

---

## 1) Mission & Operating Rules

- **Primary goal (V1):** Ship the Nutrition + Biometrics + Dashboard loop with a friendly Companion, per PRD V1.
- **Architecture:** Domain-Driven Design with a future **AI Agent Layer** between Application and Domain. In V1, AI is limited to food recognition (NU-002) and (optional) voice transcription stubs.
- **Source of truth:**
  1. `/documents/features/v1/**` (feature specs)
  2. `/apps/backend/openapi.yaml` (API contract)
  3. `/documents/technical-architecture*.md` (architecture)
  4. Version PRDs in `/documents/Version 1 – MVP/V1-PRD.md`

**Golden Rule:** _Implement one feature ticket at a time. Do **not** improvise APIs or schemas. Update OpenAPI first, then generate SDK, then code._

---

## 2) Repository Structure & Tech Stack

**IMPORTANT:** This project uses **Express + TypeScript** (NOT NestJS) and **npm** (NOT yarn).

```
/apps
/backend # Express + TypeScript (NOT NestJS)
/src
/modules # DDD bounded contexts
/auth /users /nutrition /biometrics /companion /dashboard
/plans /adherence /insights /recommendations /integrations /ai
/common # shared utils, dto, errors, guards
/config
openapi.yaml # single OpenAPI 3.1 contract
/frontend # Angular + Capacitor (mobile-first)
/src/app
/core
/features # feature-first structure
/nutrition /biometrics /dashboard /companion /settings
/shared # UI components, pipes, guards, state
/infra # IaC, dbt, airbyte (future)
/packages
/sdk # generated TS client from OpenAPI
/domain-models # generated shared types (minimal)
/documents
/features/v1 # ONE FILE PER FEATURE (user stories & AC)
/Version 1 – MVP # PRD + waves
technical-architecture-v2.md
```

---

## 3) Implementation Workflow (per Feature)

1. **Read the feature spec** under `/documents/features/v1/...`.
2. **Update `openapi.yaml`** with paths/schemas for this feature only.
3. Run **SDK generation**: `npm run gen:sdk` (NOT yarn). Commit changes in `/packages/sdk`.
4. **Backend (Express + TypeScript)**:
   - Add routes → controllers → services within the corresponding module.
   - Add input validation and DTOs.
   - Implement domain logic **in services** (backend-heavy). The frontend stays thin.
   - Persist via chosen ORM (Postgres). Write migrations for new tables/fields.
   - Add unit tests for services; integration test for routes.
5. **Frontend (Angular standalone)**:
   - Create components as **3 separate files**: `.ts`, `.html`, `.scss` (never inline).
   - Create a feature component under `/features/<module>`.
   - Use the **generated SDK** for API calls (no handwritten fetch).
   - Implement optimistic UI for offline-first flows when the spec requires.
6. **Telemetry**: add logs/metrics specified in the feature (frontend + backend).
7. **Checklist & PR**: use the PR checklist below. One ticket per PR.

> Never merge code that diverges from `openapi.yaml`. The SDK must compile and be used.

---

## 4) Coding Conventions

### 4.1 TypeScript

- Strict mode on (`"strict": true`). No `any` unless justified.
- Use **functional, side-effect-free** helpers; avoid static singletons.
- Prefer composition over inheritance.

### 4.2 Express Backend (NOT NestJS)

- Modules mirror DDD contexts: `nutrition`, `biometrics`, `companion`, `dashboard`, etc.
- Routes: **thin** (validation + mapping only).  
  Services: business logic.  
  Repositories: data access.
- Input validation for all request bodies & params.
- Errors: return envelope `{ error: { code, message } }` with appropriate HTTP status.
- Logging: pino with request IDs (middleware).
- **Swagger UI**: Available at `/api/docs` for interactive API documentation.

### 4.3 Angular (Frontend)

- **Standalone components**; feature-first structure under `/features`.
- **ALWAYS split components into 3 files**: `.ts`, `.html`, `.scss` (never use inline templates/styles).
- State per feature (signals or minimal NgRx if needed). Avoid global mega-stores.
- Use the **generated SDK** for all HTTP. Handle errors with a global interceptor.
- Accessibility: aria-labels, keyboard focus, 44px min targets. Dark/light theme support.

### 4.4 Database Conventions (Postgres)

- Tables: **snake_case**. Columns: **snake_case**.
- JSON fields use `jsonb`. Timestamps are `timestamptz` in UTC.
- Primary keys are `uuid` (server-generated unless offline id supplied).
- Indices on foreign keys and `taken_at` for time-series tables.
- Enums for bounded status values (e.g., `meals.status = draft|recognized|final`).

### 4.5 API & Models

- JSON fields in responses are **camelCase** (SDK friendly). Map to DB snake_case in the backend.
- OpenAPI 3.1: include **examples** for every schema; document error shapes.
- Version path prefix `/v1` (if used) and tag endpoints by module.
- Idempotency: endpoints that may be retried accept `X-Client-Request-Id`.

### 4.6 UI/UX Guidelines

- Mobile-first; responsive layout.
- Avoid inline CSS; use utility classes/stylesheets.
- Charts: keep neutral defaults; accessible labels & tooltips.
- Empty states & skeleton loaders for all list/chart views.

---

## 5) Offline-First & Sync

- Use local DB (IndexedDB/Dexie or Capacitor SQLite). Mirror server tables minimally.
- Queue writes when offline with backoff retries. Show **pending** badges in UI.
- Conflict policy in V1: **server wins** (last write wins). Keep client logs for support.
- For meal flows (NU-008), use **client-generated IDs** and `X-Client-Request-Id` for idempotency.

---

## 6) AI Agent Layer (Awareness for V1)

- In V1, only **NU-002 (Food Recognition)** may call AI Vision + Nutrition DB through a backend service.
- Do **not** call AI from the frontend. Backend wraps vendors and normalizes output with confidence scores.
- Store agent prompts/configs under `/documents/prompts/...` (versioned). Add golden test cases for stability.

---

## 7) Security & Privacy

- Local lock: PIN + biometrics (no remote auth in V1). If user resets PIN → full local wipe.
- Encrypt secrets; never commit keys. Use `.env` with sample `.env.example`.
- PII minimization in logs. No raw images/audio in logs.
- All times in UTC. No implicit time zone conversions in backend.

---

## 8) CI/CD Expectations

- **CI runs**: lint, typecheck, tests, OpenAPI validate, SDK generation.
- PR fails if:
  - `openapi.yaml` invalid or changed without regenerated SDK.
  - Tests fail or coverage drops below baseline.
- Optional: Docker build of backend.

---

## 8) Development Best Practices & Ownership

**Critical Guidelines:**

- **Target correct folders**: Always ensure commands run in the right directory (`apps/backend`, `apps/frontend`, etc.)
- **Never get stuck on app execution**: If asked to test something, use `npm run build` instead of running servers
- **Don't over-engineer**: Ask for clarification rather than guessing requirements
- **Avoid rabbit holes**: If something seems complex or unclear, ask or add to backlog
- **Owner-driven development**: The human owns the code - ask understanding questions rather than making assumptions

**When testing/validation is needed:**

- Backend: `cd apps/backend && npm run build`
- Frontend: `cd apps/frontend && npm run build`
- Never start dev servers unless explicitly requested
- Use build commands to validate code correctness

---

## 9) Branch & Commit Policy

- Branch per ticket: `feat/<module>-<id>-short-title` (e.g., `feat/nutrition-NU-003-edit-items`).
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:` etc.
- One feature per PR. Keep changes scoped; no drive-by refactors.

---

## 10) Pull Request Checklist

- [ ] Feature spec referenced in PR description.
- [ ] `openapi.yaml` updated and **`/packages/sdk` regenerated**.
- [ ] Backend: controller/service/repo + tests implemented.
- [ ] Frontend: uses generated SDK; error & loading states handled.
- [ ] DB migration added (if schema change).
- [ ] Telemetry/logs added per spec.
- [ ] Accessibility pass (labels, focus, contrast).
- [ ] Screenshots/GIFs for UI changes.
- [ ] All checks green (CI).

---

## 11) Quick Commands (suggested)

```bash
# Backend
yarn dev:api            # start NestJS
yarn test:api           # run backend tests
yarn gen:sdk            # regenerate TS SDK from openapi.yaml

# Frontend
yarn dev:web            # start Angular app
yarn lint && yarn typecheck

# DB
yarn db:migrate         # run migrations
yarn db:seed            # optional seed data for local dev
```

---

## 12) Feature Execution Order (Wave Summary)

### Wave 1: CX-002, UP-001, UP-002, UP-003, UP-004 (plus CX-001, CX-003 already in repo).

### Wave 2: NU-001 … NU-005.

### Wave 3: BI-001 … BI-005.

### Wave 4: NU-006, NU-007, BI-006, BI-007, DB-001…DB-006.

### Wave 5: CO-001…CO-005.

### Wave 6: CX-004, NU-008, CX-005, CX-006.

---

## 13) When in Doubt

- Check the feature spec first. If missing details, prefer the PRD V1 and architecture doc.
- Keep logic in the backend; keep the frontend thin.
- Ask for a spec amendment rather than guessing new APIs.
