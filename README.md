# ACME Salary Management

Web-based salary management software for the HR Manager of an organization with ~10,000
employees across multiple countries. Replaces spreadsheet-based salary tracking with a tool to
manage salary data and answer questions about how the org pays people.

> Built as an Incubyte take-home with **strict TDD** and **incremental commits** — the git
> history is meant to be read top-to-bottom to see how the solution evolved.

## Status

🚧 Early scaffolding. See [`docs/requirements.md`](docs/requirements.md) for scope.

## Tech Stack

- **Backend:** NestJS 11 + TypeScript (strict)
- **Database:** Prisma 6 + SQLite (schema kept Postgres-portable)
- **Frontend:** React 19 + Vite 6 + shadcn/ui + TanStack Query/Table
- **Tests:** Vitest 3

## Getting Started

```bash
npm install                 # install workspaces
cp .env.example apps/api/.env
npm run seed                # seed 10,000 employees (deterministic)
npm run dev                 # run api + web concurrently
```

> Scripts are wired up as the app is built — see [`CLAUDE.md`](CLAUDE.md) for the command contract.

## How This Was Built (AI usage)

Development was driven through a committed Claude Code workflow in [`.claude/`](.claude):

- **`/tdd`** enforces red → green → refactor with a separate commit per phase.
- **`.claude/rules/`** auto-load the coding-style, testing, and git conventions every session.
- **`/review`** runs an independent `code-reviewer` agent against each feature diff.
- **`/verify`** gates the green step on typecheck + lint + test + build.

See [`docs/ai-notes.md`](docs/ai-notes.md) for the decision log and trade-offs.

## Documentation

- [`docs/requirements.md`](docs/requirements.md) — one-page requirements (goal, scope, what's left out)
- [`docs/architecture.md`](docs/architecture.md) — architecture diagram + trade-offs
- [`docs/ai-notes.md`](docs/ai-notes.md) — AI usage notes & decision log
