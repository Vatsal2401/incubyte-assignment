# AI Usage Notes

> A running lab notebook of how AI was used to build this project — the prompts and workflow,
> the decisions where I steered or overrode the AI, and the trade-offs considered. This is an
> intentional artifact: it shows *how* AI was delegated to, not just that it was used.

## Workflow & tooling

I drove development through a custom Claude Code workflow committed in `.claude/`:

- **`/tdd <feature>`** — enforces strict red → green → refactor with a separate commit per phase,
  so the git history is a transparent record of how the code evolved (no big lump commits).
- **`.claude/rules/`** — coding-style, testing, and git-workflow rules auto-loaded into every
  session (imported by `CLAUDE.md`), so the AI follows project conventions without re-prompting.
- **`code-reviewer` agent + `/review`** — an independent AI pass reviews each feature diff against
  those rules before merge.
- **`/verify`** — runs typecheck + lint + test + build as a gate before committing the green step.

Rationale: rather than one-shot "build me an app" prompting, I encoded the *process* (TDD, small
commits, review) into reusable tooling and delegated execution to it. The tooling itself is a
reviewable artifact of intentional AI use.

## Decision log

Record notable decisions here as the project evolves — especially where I disagreed with or
corrected an AI suggestion.

| Date | Decision | AI suggested | What I chose & why |
|---|---|---|---|
| 2026-05-30 | Database | (open) Supabase or SQLite | **SQLite + Prisma**, Postgres-portable schema — zero-setup offline DX for reviewers, deterministic tests/seed; one-line swap to Postgres if a hosted deploy is needed later. |
| 2026-05-30 | `.claude` tooling scope | Could port the full saleshandy-edge rig (6 agents, domain skills) | Brought only the pieces that map to the grading rubric; **deliberately skipped** the heavy e2e/spec/coverage agents and NestJS-specific skills as over-engineering for this scope. |
| 2026-05-30 | Analytics headcount helpers | AI could DRY `headcountByCountry`/`ByDepartment` into one parameterized method | Kept them explicit — parameterizing Prisma's typed `groupBy` forces an untyped cast; a little duplication beat the wrong (untyped) abstraction. |
| 2026-05-30 | Combined analytics endpoint | Three separate endpoints | One `GET /analytics/overview` running 3 aggregations via `Promise.all` — one round-trip for the dashboard, better UX. |

### Lessons / corrections during the build

- **Run the *full* gate, not just `vitest`.** SWC transpiles tests without type-checking, so a Prisma `groupBy` mock-typing error passed the test run but failed `tsc`. Fixed with a typed mock cast (`fix:` commit) and now run typecheck+lint+test each cycle. This is exactly why the `/verify` gate exists.

## Notable prompts

Capture prompts/instructions worth showing a reviewer (the ones that shaped architecture or
caught a bug). Keep them short and link to the resulting commit where useful.

- _(add as you go)_

## Trade-offs & things deliberately left out

Cross-reference `docs/requirements.md` (scope) and `docs/architecture.md` (design). Note here any
place where AI proposed something I cut for scope/time and why.

- _(add as you go)_
