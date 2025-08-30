# GitHub Copilot Instructions

**Project:** Health Companion — V1 (MVP)  
**Tech Stack:** Express + TypeScript backend, Angular frontend, PostgreSQL  
**Approach:** OpenAPI-first, DDD modules, Backend-heavy logic

---

## 1) Core Rules

- **Golden Rule:** Update OpenAPI first → generate SDK → implement code. Never improvise APIs.
- **Tech Stack:** Express + TypeScript (NOT NestJS), npm (NOT yarn)
- **Source of truth:** Feature specs in `/documents/features/v1/`, OpenAPI contract in `/apps/backend/openapi.yaml`
- **One feature per PR** - implement tickets individually

---

## 2) Implementation Workflow

1. Read feature spec in `/documents/features/v1/`
2. Update `openapi.yaml` with new paths/schemas
3. Run `npm run gen:sdk` and commit SDK changes
4. **Backend**: Add routes → controllers → services in DDD modules, write tests
5. **Frontend**: Create 3-file components (`.ts/.html/.scss`), use generated SDK
6. Add DB migrations if needed

---

## 3) Key Development Practices

- **Target correct directories**: Commands run in `apps/backend` or `apps/frontend`
- **Testing**: Use `npm run build` instead of starting dev servers
- **Ask for clarification** rather than guessing requirements
- **Keep frontend thin** - business logic stays in backend services

## 4) File Size & Code Structure

- **No large files**: Keep files under 300 lines of code
- **Separate concerns**: Split logic, UI, and types/interfaces into separate files
- **Favor modularity**: Break features into reusable components or services
- **TypeScript strictly**: Separate concerns cleanly, prefer composition over duplication
- **Avoid mixing responsibilities** in the same file

## 5) Agent Behavior Rules

- **Never auto-run/test/debug**: I will handle execution myself
- **Ask before related changes**: If you think a related file needs updates, ask first
- **Clarify ambiguity**: Analyze prompts and ask clarification questions when unclear
- **No assumptions**: Don't invent missing requirements - always confirm first
- **Stay maintainable**: Favor clean code over shortcuts, I control the development process

---

## 6) Documentation Organization

- **Keep root clean**: Never create implementation docs in project root directory
- **Feature documentation**: Place all implementation docs in `/documents/Version 1 – MVP/features/<module>/`
- **Implementation artifacts**: Use naming pattern `<TICKET-ID>-IMPLEMENTATION.md` for detailed checklists
- **Summary docs**: Use `<TICKET-ID>-SUMMARY.md` for high-level overviews
- **Technical guides**: Database setup guides belong in `apps/backend/README_*.md`
- **Example structure**:
  ```
  documents/Version 1 – MVP/features/cross/
  ├── CX-003-data-models-and-migrations.md     # Original spec
  ├── CX-003-IMPLEMENTATION.md                 # Implementation details
  └── CX-003-IMPLEMENTATION-SUMMARY.md         # High-level summary
  ```

---

## 7) Essential Coding Standards

### Backend (Express + TypeScript)

- **Routes**: thin (validation only), **Services**: business logic, **Repositories**: data access
- TypeScript strict mode, no `any` unless justified
- Return errors as `{ error: { code, message } }` with HTTP status
- Input validation for all endpoints

### Frontend (Angular)

- **Always 3 files**: `.ts`, `.html`, `.scss` (never inline)
- Feature-first structure under `/features/<module>`
- Use generated SDK for all API calls
- Standalone components preferred

### Database (PostgreSQL)

- Tables/columns: `snake_case`, JSON responses: `camelCase`
- Primary keys: `uuid`, timestamps: `timestamptz` in UTC
- Migrations required for schema changes

---

## 8) Commands & Validation

```bash
# SDK Generation (after OpenAPI changes)
npm run gen:sdk

# Validation (use these instead of dev servers)
cd apps/backend && npm run build
cd apps/frontend && npm run build
```

---

## 9) When in Doubt

- Check feature spec first, then PRD V1 and architecture docs
- Ask for spec clarification rather than guessing APIs
- Keep logic in backend services, frontend stays thin
