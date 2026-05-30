# ACME Salary Management

Web-based salary management software for the HR Manager of an organization with ~10,000
employees across multiple countries. Replaces spreadsheet-based salary tracking with a tool to
manage salary data and answer questions about how the org pays people.

> Built as an Incubyte take-home with **strict TDD** and **incremental commits** — the git
> history is meant to be read top-to-bottom to see how the solution evolved.

## Live demo & video

- 🌐 **Live app:** https://incubyte-assignment.autoreels.in
- 🎥 **Video walkthrough:** https://www.loom.com/share/4ac1643647b446bb94ddaed59f55c79b

Seeded with 10,000 employees. Try the dashboard, filter the employee table, add/edit a record, and toggle dark mode.

## Status

✅ Functional end-to-end and deployed. See [`docs/requirements.md`](docs/requirements.md) for scope.

## Tech Stack

- **Backend:** NestJS 11 + TypeScript (strict)
- **Database:** Prisma 6 + SQLite (schema kept Postgres-portable)
- **Frontend:** React 19 + Vite 6 + shadcn/ui + TanStack Query/Table
- **Tests:** Vitest 3

## Getting Started

```bash
npm install                 # install workspaces
cp .env.example apps/api/.env
npm run db:setup            # create the SQLite db + apply migrations
npm run seed                # seed 10,000 employees (deterministic)
npm run dev                 # run api (:3000) + web (:5173) concurrently
```

Then open http://localhost:5173. Other useful commands:

```bash
npm test                    # run all unit tests (api + web)
npm run typecheck           # strict TypeScript check across both apps
npm run build               # production build of both apps
```

> See [`CLAUDE.md`](CLAUDE.md) for the full command contract.

## How This Was Built (AI usage)

Development was driven through a committed Claude Code workflow in [`.claude/`](.claude):

- **`/tdd`** enforces red → green → refactor with a separate commit per phase.
- **`.claude/rules/`** auto-load the coding-style, testing, and git conventions every session.
- **`/review`** runs an independent `code-reviewer` agent against each feature diff.
- **`/verify`** gates the green step on typecheck + lint + test + build.

See [`docs/ai-notes.md`](docs/ai-notes.md) for the decision log and trade-offs.

## Deployment

The whole stack runs via **docker-compose** — each app has its own Dockerfile:

```
caddy   (apps … official image) → HTTPS (auto Let's Encrypt), routes / → web, /api → api
web     (apps/web/Dockerfile)   → Vite build served by nginx
api     (apps/api/Dockerfile)   → NestJS + Prisma; SQLite on a named volume; migrates + seeds on first boot
```

```bash
# On any Docker host (DNS A-record → host IP, ports 80/443 open):
git clone https://github.com/Vatsal2401/incubyte-assignment.git
cd incubyte-assignment
docker compose up -d --build      # build images and start all services
```

Live instance: a GCP VM running this compose stack, with `incubyte-assignment.autoreels.in`
pointed at it via Vercel DNS; Caddy provisions and renews the TLS certificate automatically.

## Documentation

- [`docs/requirements.md`](docs/requirements.md) — one-page requirements (goal, scope, what's left out)
- [`docs/architecture.md`](docs/architecture.md) — architecture diagram + trade-offs
- [`docs/ai-notes.md`](docs/ai-notes.md) — AI usage notes & decision log
- [`docs/plan.md`](docs/plan.md) — delivery checklist mapping every requirement
