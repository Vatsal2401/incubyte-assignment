# Delivery Plan & Requirements Coverage

> Living checklist mapping **every** requirement in the assessment to its status, so nothing is
> missed. Updated as the build progresses. (`✅ done · 🚧 in progress · ⬜ todo`)

## 1. Process requirements (graded)

| # | Requirement | Status | Where |
|---|---|---|---|
| 1.1 | Follow **TDD** (red → green → refactor) | 🚧 | `/tdd` workflow, commit history |
| 1.2 | Many **small incremental commits** showing evolution | 🚧 | git history (one commit per TDD phase) |
| 1.3 | Use **AI intentionally**, maintain correctness/quality | 🚧 | `.claude/` tooling, `docs/ai-notes.md` |
| 1.4 | Host on a **public GitHub repo** + send link | ⬜ | needs repo created + pushed |

## 2. Required artifacts

| # | Artifact | Status | Where |
|---|---|---|---|
| 2.1 | One-page **requirements document** | ✅ | `docs/requirements.md` |
| 2.2 | **Architecture diagram** + trade-offs | ✅ | `docs/architecture.md` |
| 2.3 | **Planning / design notes** | ✅ | this file |
| 2.4 | **AI prompts / instructions** used | 🚧 | `docs/ai-notes.md` (kept live) |
| 2.5 | **Trade-off explanations** | ✅ | `requirements.md` + `architecture.md` |
| 2.6 | **Performance considerations** | ✅ | `architecture.md` + `CLAUDE.md` |

## 3. Product functionality (HR Manager persona)

Core jobs from the requirements doc — each built test-first.

| # | Feature | Status |
|---|---|---|
| 3.1 | Domain: Money value object (minor units + currency) | ⬜ |
| 3.2 | Employee CRUD (create, read, update, deactivate) | ⬜ |
| 3.3 | Input validation (DTOs: email, non-negative salary, known currency/country) | ⬜ |
| 3.4 | Paginated + sortable + searchable employee listing | ⬜ |
| 3.5 | Filtering by country, department, salary range (combinable) | ⬜ |
| 3.6 | Analytics: headcount, total spend, avg/min/max, by country & department | ⬜ |
| 3.7 | Persistence via Prisma + SQLite | ⬜ |

## 4. Technical constraints

| # | Constraint | Choice | Status |
|---|---|---|---|
| 4.1 | Backend: Node/TS framework | NestJS 10 + TS (strict) | 🚧 scaffolded |
| 4.2 | Relational DB | Prisma + SQLite (Postgres-portable) | ⬜ schema todo |
| 4.3 | UI: React or Next + component library | React (Vite) + shadcn/ui | ⬜ |
| 4.4 | **Seed script: 10,000 employees** | deterministic faker seed | ⬜ |

## 5. Readiness deliverables

| # | Deliverable | Status | Notes |
|---|---|---|---|
| 5.1 | **Fully functional deployed software** | ⬜ | Dockerfile + host (Render/Fly/Railway). **Needs a hosting account decision.** |
| 5.2 | **Video demo** of the software | ⬜ | I'll write a demo script; **recording needs the user**. |
| 5.3 | Meaningful, fast, deterministic **unit tests** | 🚧 | Vitest, test-first |
| 5.4 | Good structure, readability, maintainability | 🚧 | layered, strict TS, ESLint |
| 5.5 | **README** with clear onboarding (DX) | 🚧 | `README.md` expanded as features land |

## 6. Build sequence (TDD milestones)

1. **Install deps** + commit lockfile.
2. **Prisma schema** (Employee model) + PrismaService — committed before the feature that needs it.
3. **Domain TDD:** Money value object → salary aggregation helpers (pure, fast).
4. **Employees module TDD:** service (CRUD + filter) with mocked Prisma → controller + DTOs.
5. **Analytics module TDD:** aggregation service (groupBy/aggregate) → controller.
6. **Seed script:** 10,000 deterministic employees; assert count.
7. **Web app:** Vite + shadcn scaffold → API client → employee table (paginated/filtered) → employee form → analytics dashboard. Component/hook tests for logic.
8. **End-to-end wiring** + manual verification of all four HR jobs.
9. **Dockerfile + deploy** (single container serving API + built SPA).
10. **README polish** + **demo script** + record video.
11. **Create public GitHub repo + push** full history.

## 7. Needs the user (can't be done autonomously)

- [ ] **GitHub repo**: confirm I should create `vatsal2401/<name>` and push (auth/account).
- [ ] **Hosting choice** for the live deploy (Render / Fly.io / Railway / other) + account login.
- [ ] **Recording the demo video** (I'll provide a scripted walkthrough to record).

> These are flagged early so they don't become last-minute blockers. Everything else proceeds autonomously via TDD.
