---
paths:
  - "**/*"
---

# Git Workflow

> Feature branches off `main`, conventional commits, and — because this is graded — a commit
> history that visibly tells the TDD story. The history IS a deliverable.

## Branch Naming

- Feature: `feat/<short-description>`
- Fix: `fix/<short-description>`
- Refactor: `refactor/<short-description>`
- Chore/docs: `chore/<...>`, `docs/<...>`

Never commit feature work directly to `main`.

## Conventional Commits

Format: `<type>: <imperative description>` (≤ 72 chars, no trailing period).

| Type | When |
|---|---|
| `test` | Add a **failing** test (the RED step) |
| `feat` | Make the test pass / add functionality (the GREEN step) |
| `refactor` | Improve code with tests staying green (the REFACTOR step) |
| `fix` | Bug fix (preceded by a `test:` that reproduces it) |
| `docs` | Requirements, architecture, README, ai-notes |
| `chore` | Tooling, deps, config, scaffolding |
| `perf` | Performance improvement |
| `style` | Formatting only, no logic change |

## TDD Commit Cadence (the important part)

Each red→green→refactor transition is its **own** commit, so reviewers can watch the design emerge:

```
test: filter employees by country          ← failing test, committed red
feat: filter employees by country          ← minimal code, committed green
refactor: extract EmployeeFilter type       ← cleanup (only if there was something to clean)
```

Rules:
- **Never** combine a test and its implementation in one commit — that hides the red step.
- A `fix:` is preceded by a `test:` commit reproducing the bug, then `fix:` turns it green.
- Commit messages describe **behavior** ("filter by country"), not mechanics ("add if statement").
- Every commit leaves the tree in a working state (suite green, types clean) — except the intentional
  RED `test:` commit, whose message makes the failing intent explicit.
- Keep commits small and single-purpose; don't bundle unrelated changes.

## Before You Commit the GREEN step

Run `/verify` (or at minimum typecheck + the relevant tests). Don't commit a broken green step.

## Pull Request Flow

1. Branch from latest `main`.
2. Build the feature via `/tdd`.
3. `/verify` — typecheck + lint + test + build all pass.
4. `/review` — code-reviewer agent against the diff; fix findings (each as its own commit).
5. Push, open PR with a short summary + test plan.
6. Squash only if asked — for this assignment the granular history is the point, so prefer
   merge/rebase that **preserves** the red/green/refactor commits.

## Never Commit

- Secrets, `.env`, API keys, tokens (commit `.env.example` instead).
- Generated artifacts: `node_modules/`, `dist/`, the SQLite `*.db` file, coverage output.
- Keep `.gitignore` honest from the first commit.
