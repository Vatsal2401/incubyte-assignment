# ACME Salary Management — Project Config

> Master configuration for Claude Code. Auto-loaded every session. Read this first.

Employee salary management software for an HR Manager persona (org of ~10,000 employees,
multiple countries). Replaces spreadsheet-based salary tracking with a web app that lets
the HR Manager manage salary data and answer questions about how the org pays people.

This is an **Incubyte take-home** — the **process is graded as much as the result**:
strict TDD, many small commits, intentional + documented AI usage. See `docs/` artifacts.

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Runtime | Node.js 20+ | LTS |
| Backend | NestJS 11 + TypeScript (strict) | Layered: module → controller → service → repository |
| ORM / DB | Prisma 6 + **SQLite** | Schema kept **Postgres-portable** — no SQLite-only types |
| Validation | class-validator + class-transformer | DTOs validate all input at the boundary |
| Frontend | React 19 + Vite 6 | SPA that calls the API |
| UI kit | shadcn/ui (Radix + Tailwind) | Accessible primitives, own the components |
| Data layer (web) | TanStack Query + TanStack Table | Server-state caching, virtualized/paginated table |
| Tests | **Vitest 3** | Fast watch, TDD-friendly; same runner for api + web |
| Lint/format | ESLint + Prettier | `strict` TS, no `any` without justification |

## Monorepo Layout

```
/
├── apps/
│   ├── api/                 NestJS backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts       generates 10,000 employees (deterministic)
│   │   └── src/
│   │       ├── employees/    employee module (controller/service/dto/entities)
│   │       ├── salaries/     salary records + analytics
│   │       └── prisma/       PrismaService (DI wrapper)
│   └── web/                  Vite + React SPA
│       └── src/
│           ├── components/   shadcn/ui + feature components
│           ├── features/     employees/, analytics/
│           └── lib/          api client, query hooks
├── docs/
│   ├── requirements.md       one-pager (goal, scope, what's left out + why) — write FIRST
│   ├── architecture.md       diagram + trade-offs
│   └── ai-notes.md           AI lab notebook (prompts, decisions, overrides)
├── .claude/                  workflow tooling (rules, agents, commands, /tdd)
└── CLAUDE.md                 this file
```

## Verification Commands

Run from the repo root. The `/verify` command runs all of these in sequence.

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | zero errors |
| Lint | `npm run lint` | zero errors/warnings (`npm run lint:fix` to autofix) |
| Test | `npm run test` | all green; fast + deterministic |
| Test (watch) | `npm run test:watch` | TDD inner loop |
| Build | `npm run build` | api + web build succeed |
| Seed DB | `npm run seed` | 10,000 employees inserted (idempotent) |
| Dev | `npm run dev` | api + web run concurrently |

## How We Work Here

- **TDD is the house style.** Use `/tdd <feature>` — it drives red → green → refactor with a
  separate commit per phase. No production code without a failing test first. See `.claude/commands/tdd.md`.
- **Requirements before code.** `docs/requirements.md` must exist before feature code.
- **Document AI usage as you go** in `docs/ai-notes.md` — it's a graded artifact, not an afterthought.
- **Verify before committing the green step:** `/verify` (or at least typecheck + the relevant tests).
- **Review before merge:** `/review` dispatches the `code-reviewer` agent against the diff.
- **UI/UX test in a real browser:** `/ui-test` drives the running app via the Browser MCP — walks the
  HR-Manager journeys (dashboard, filters, add/edit, theme, responsive), captures screenshots, and
  flags console/usability issues. Complements the Vitest unit suite.

## Coding Rules (imported — auto-loaded)

@.claude/rules/coding-style.md
@.claude/rules/testing.md
@.claude/rules/git-workflow.md

## Database Notes

- Single `PrismaService` (NestJS provider) is the only DB access point — inject it, don't `new PrismaClient()`.
- Prisma parameterizes all queries (no SQL injection surface) — never drop to raw string-interpolated SQL.
- Keep the schema **Postgres-portable**: stick to `String`/`Int`/`Decimal`/`DateTime`/`Boolean`,
  use `@db`-agnostic types, avoid SQLite-only behavior. Swapping to Postgres should be a `datasource` + URL change only.
- Money: store salary as integer **minor units** (e.g. cents) or Prisma `Decimal` — never float. Always pair an amount with its `currency`.
- The seed (`apps/api/prisma/seed.ts`) must be **deterministic** (fixed RNG seed) so runs and tests are reproducible.

## Performance Posture (10k employees)

- Always paginate list endpoints (`skip`/`take` + total count) — never return all 10k rows.
- Index the columns we filter/sort on (country, department, salary).
- Push filtering/aggregation into the DB (Prisma `groupBy`/`aggregate`), not into JS.
- The web table paginates/virtualizes — it never renders 10k DOM rows at once.
