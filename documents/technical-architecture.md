
# Technical Architecture (v2) — Health Companion Platform

_Last updated: 2025-08-29_

## 0) Goals & Non-Goals
**Goals**
- Modular, backend-centric system that scales from single-user to multi-tenant SaaS.
- Domain-Driven Design (DDD) with clear bounded contexts.
- First-class **AI Agent Layer** embedded between Application and Domain for core contexts.
- Analytics/BI context separated from OLTP with proper ELT and ML-readiness.
- OpenAPI-first contracts to enable generated clients and Copilot-friendly workflows.

**Non-Goals (for now)**
- Full event sourcing for all domains.
- On-device ML training.
- Realtime telemedicine or diagnostics (future R&D).

---

## 1) Bounded Contexts (DDD)
### Core Domains (AI-enabled)
- **Nutrition** (food logging, photo recognition, macro/cals, meal timing)
- **Sleep & Recovery**
- **Training & Movement**
- **Stress & Mental Health**
- **Biometrics** (weight, waist, BP, HR, pain, mood)
- **Companion/Coach** (insights, recommendations, adherence feedback)

### Support Domains (conventional)
- **Auth & Identity**, **User Management**, **Billing/Subscriptions**
- **Plans** (doctor/user goals), **Adherence**, **Messaging**
- **Integrations** (wearables, devices, labs)

### Analytics / BI Context
- **Observability/Events**, **ELT/Modeling**, **Insights Warehouse**
- **Feature Store** (for ML), **Model Registry**

Bounded contexts communicate via **domain events** (async) and **OpenAPI REST** (sync).

---

## 2) Layered Architecture (Ports & Adapters)
```
[ UI (Mobile/Web) ]
        │
   (HTTP/OpenAPI)
        │
[ API Layer / Controllers ]  ← adapters (validation, authz, DTO mapping)
        │
[ Application Layer ]        ← use-cases, orchestrations, transactions (CQRS)
        │
[ AI Agent Layer ]           ← domain agents + orchestrators + policy/prompt ops
        │
[ Domain Layer ]             ← entities, value objects, domain services, events
        │
[ Infrastructure Layer ]     ← repositories (Postgres), queues, caches, external APIs
```
**Key idea:** In core domains, decisioning is delegated to **AI Agents** that operate through **ports** (tools) and are bounded by **policies** and **guardrails**. Support domains follow conventional patterns without AI.

---

## 3) AI Agent Layer (First-Class)
### 3.1 Agent Types (per core domain)
- **NutritionAgent**: food photo parsing, portion estimation, nutrition lookup, uncertainty reporting.
- **SleepAgent**: interprets logs/wearables; flags OSA-like patterns; suggests hygiene adjustments.
- **TrainingAgent**: load analysis, pain-aware progression, safe substitutions.
- **StressAgent**: mood/stress patterns; coping nudges.
- **BiometricsAgent**: trends, thresholds, alerting.
- **CompanionAgent**: cross-domain synthesis; daily/weekly summaries; plans adherence.

### 3.2 Orchestration
- **Orchestrator** (workflow engine): routes tasks between agents; composes multi-step flows
  (e.g., “Photo → Vision → Nutrition DB → Macro calc → Persist → Recommend”).
- **Policy Engine**: rule constraints (e.g., max calorie deltas; medical disclaimers).
- **PromptOps**: versioned prompts, templating, input/output schemas, test fixtures.
- **Guardrails**: schema validation (JSON schemas), tool-calling permissions, PII redaction.

### 3.3 Tools (Ports) exposed to agents
- **VisionTool** (food recognition API)
- **NutritionDBTool** (food → macros lookup; USDA/FDDB, etc.)
- **TranscribeTool** (speech-to-text for journaling; Whisper)
- **WearableTool** (read-only bridge for Apple/Google/Fitbit/Garmin)
- **PlanTool** (read doctor/patient plans)
- **RepoTool** (restricted CRUD via application services)
- **MetricsTool** (threshold checks, e.g., BP out-of-range)

---

## 4) Data Architecture
### 4.1 OLTP (Operational)
- **PostgreSQL** (normalized): users, meals, nutrients, workouts, sleep, stress, biometrics, plans, adherence, messages, recommendations, insights.
- Row-level security (RLS) for multi-tenant future.

### 4.2 Messaging
- **Event Bus**: Kafka or RabbitMQ. Domain events emitted by Application / Domain:
  - `MealLogged`, `SleepLogged`, `WorkoutLogged`, `BiometricsUpdated`, `PlanUpdated`, `RecommendationIssued`.
- Consumers: Insights generator, BI ELT, Notifications.

### 4.3 Analytics / BI
- **Warehouse**: BigQuery, Snowflake, or ClickHouse.
- **ELT**: Airbyte/Fivetran (extract from Postgres), **dbt** for modeling (marts: `nutrition_mart`, `sleep_mart`, `training_mart`, `stress_mart`, `adherence_mart`).
- **Feature Store**: Feast or custom (e.g., in Redis/Parquet) for ML features (rolling means, variability).
- **Model Registry**: MLflow or Weights & Biases.
- **Analytics APIs**: read-only endpoints for dashboards; or direct BI tool (Metabase/Superset).

### 4.4 Observability
- Logs: structured JSON (pino/winston). Tracing: OpenTelemetry. Metrics: Prometheus/Grafana.
- AI traces: prompt/version, latency, token use, error rates, hallucination flags.

---

## 5) Security & Privacy
- OAuth 2.1 / OIDC, JWT access tokens; short-lived tokens with refresh.
- PII encryption at rest (Postgres pgcrypto/KMS). TLS in transit.
- Consent ledger for data sharing (doctor portal). Audit trails for access.
- Data retention policies and user export/delete (GDPR).
- AI safety policies: domain boundaries, PHI minimization, allowlist for tools.

---

## 6) API Strategy (OpenAPI-First)
- Single **OpenAPI 3.1** spec stored in `/backend/openapi.yaml`.
- Per bounded context tag grouping: `nutrition`, `sleep`, `training`, `stress`, `biometrics`, `plans`, `adherence`, `insights`, `recommendations`, `auth`, `users`.
- Codegen:
  - Backend: route stubs from spec (NestJS/Express adapters).
  - Frontend: generated TypeScript client.
- Versioning: `/v1` per major; deprecations via sunset headers.

---

## 7) Suggested Tech Stack
- **Frontend**: Angular + Capacitor (mobile-first), NgRx for state in feature modules.
- **Backend**: Node.js (TypeScript), **NestJS** for modularity, class-validator, class-transformer.
- **DB**: Postgres + Prisma ORM (or TypeORM). Redis for cache/queues (if no Kafka).
- **Queue**: Kafka (preferred) or RabbitMQ; BullMQ for background jobs.
- **AI**: OpenAI (GPT, Whisper), optional vision vendor for food recognition; Guardrails with JSON schema.
- **Infra**: Docker, k8s (later), Terraform/IaC. CI: GitHub Actions.
- **BI**: Airbyte + dbt + BigQuery/ClickHouse; Superset/Metabase for dashboards.

---

## 8) Repos & Folder Structure
```
/apps
  /backend           # NestJS app
    /src
      /modules
        /auth
        /users
        /nutrition
        /sleep
        /training
        /stress
        /biometrics
        /plans
        /adherence
        /insights
        /recommendations
        /companion
        /integrations   # wearables, labs
        /ai             # agents, orchestrators, prompts, guardrails
      /common           # cross-cutting (dto, errors)
      /config
    openapi.yaml
  /frontend           # Angular app
    /src/app
      /core
      /features
        /nutrition
        /sleep
        /training
        /stress
        /biometrics
        /dashboard
        /companion
      /shared
  /infra              # IaC, k8s manifests, dbt project, airbyte configs

/packages
  /sdk                # Generated TS SDK from OpenAPI
  /domain-models      # shared types (generated), kept minimal

/docs
  /adr                # architectural decision records
  /features           # user-story specs per version
  /prompts            # versioned prompts & tests
```

---

## 9) Application Layer (CQRS)
- **Commands**: `LogMeal`, `UpdateSleep`, `RecordWorkout`, `UpdateBiometrics`, `ComputeAdherence`, `IssueRecommendation`.
- **Queries**: `GetDailySummary`, `GetWeeklyDashboard`, `GetCorrelations`.
- Transactions wrap commands; queries hit read-optimized views (materialized views in Postgres or cached projections).

---

## 10) Domain Layer (Examples)
- Entities: `Meal`, `Workout`, `SleepRecord`, `BiometricReading`, `Plan`, `Adherence`, `Recommendation`, `Insight`.
- Value Objects: `Calories`, `Macros`, `HeartRate`, `BloodPressure`, `PainScore`, `StressScore`.
- Domain Services: `AdherenceCalculator`, `TrendAnalyzer` (lightweight, non-AI).

---

## 11) AI Agent Layer — Implementation Notes
- Each Agent implements a common interface:
  ```ts
  interface Agent<Input, Output> {
    name: string;
    policies: Policy[];
    tools: Tool[];
    run(input: Input, context: AgentContext): Promise<Output>;
  }
  ```
- **Orchestrator** composes agents via declarative workflows (e.g., JSON/YAML graphs).
- **PromptOps**: store prompts under `/docs/prompts/{domain}/{name}.md` with examples + unit tests.
- **Evaluation**: golden test cases for agents; automated offline eval suite.

---

## 12) Analytics / BI — Best Practices
- **ELT** from Postgres to Warehouse nightly (or streaming for key events).
- **dbt models** create marts per domain plus “correlation” models (e.g., `nutrition_sleep_corr`).
- **Feature Store** for rolling aggregates used by Insights Engine.
- **ML**: start with rules; graduate to shallow models (XGBoost) before deep learning.
- **Reports**: Superset/Metabase for exploratory; app pulls curated KPIs via read-only endpoints.
- **AI in BI**: controlled LLM agent with SQL-guardrails, read-only access to curated marts only.

---

## 13) Security, Compliance, and Safety
- RLS per tenant; least-privilege DB users.
- Secrets in vault (e.g., HashiCorp Vault).
- Audit logs for PHI access; consent management for doctor sharing.
- Red-team prompts and jailbreak tests for AI agents; block disallowed tool calls.
- Pseudonymize data before ELT; ML trained on de-identified datasets.

---

## 14) Copilot & Contribution Guidelines
- **OpenAPI-first**: update `/apps/backend/openapi.yaml` → regenerate `/packages/sdk` on each change.
- **Feature Specs**: one Markdown file per feature under `/docs/features/vX/` with user story + acceptance criteria + API stubs.
- **Testing**: unit tests per module; contract tests using generated SDK; agent tests with golden prompts.
- **CI**: lint, typecheck, test, build; disallow merging without updated OpenAPI + SDK when endpoints change.

---

## 15) Migration Path (V1 → V7)
- V1: nutrition, biometrics, dashboard, companion (basic). No AI orchestrator yet, but wire `NutritionAgent` for photo parsing.
- V2: add sleep, training, stress modules. Introduce Orchestrator skeleton.
- V3: enable Insights/Recommendations with rule-based policies; CompanionAgent synthesis.
- V4: plans/adherence; policy engine validates guardrails.
- V5: wearables/labs; Integrations context; streaming ELT.
- V6: men’s/women’s suite, pain diary, journaling w/ STT; expanded correlations.
- V7: multi-tenant auth, doctor portal, messaging; consent & audit hardened.

---

## 16) Appendix — Minimal OpenAPI Tags
- `auth`, `users`, `nutrition`, `sleep`, `training`, `stress`, `biometrics`, `plans`, `adherence`, `insights`, `recommendations`, `integrations`, `messages`.

