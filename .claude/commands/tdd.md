# TDD

Drive a feature to completion using **strict Test-Driven Development** — one failing test at a time, minimal code to pass, then refactor — with **a separate commit for every phase** so the git history reads as a transparent record of how the code evolved.

This is the house style for this repo. It exists because the Incubyte assignment is graded as much on the **process** (TDD discipline, small incremental commits, intentional AI usage) as on the result. The commit history IS a deliverable.

> Memory: see `.claude` project memory `project-tdd-process-expectations`, `project-grading-rubric`, `project-assignment-overview` for why this workflow is shaped the way it is.

## The one rule

**No production code is written except to make a failing test pass.** If you want to write code, first write a test that fails because that code doesn't exist yet. Everything below is just the disciplined application of this rule.

## Workflow

### 0. Preflight (once per feature)

1. **Git repo exists?** If not, `git init` and make an initial commit (`chore: initialize project`). Never skip — the history is graded.
2. **Branch:** create a feature branch `feat/<kebab-name>` from `main`. Never build directly on `main`.
3. **Requirements exist?** A one-page requirements doc (`docs/requirements.md`) must exist *before* feature code — it defines scope and, crucially, what is deliberately left out. If missing, write it first and commit (`docs: add requirements`) before any test.
4. **Clean tree:** ensure `git status` is clean before starting the cycle, so each phase commit is atomic.

### 1. Slice into behaviors

Break the requested feature into a **thin, ordered list of testable behaviors** — each small enough that one test with a strong assertion proves it. Order them so each builds on the last (walking skeleton first, edge cases later).

Present the list to the user as a checklist and confirm before coding. Example for "salary filtering":
```
1. returns all employees when no filter applied
2. filters by country
3. filters by salary range (min/max)
4. combines country + range filters
5. returns empty list when nothing matches (not an error)
6. rejects an invalid range (min > max) with a clear error
```

### 2. The micro-cycle — repeat per behavior

For **each** behavior in the list, run RED → GREEN → REFACTOR, committing at each transition:

```
RED      a. Write ONE test for the next behavior. Strong, specific assertion
            (assert the value, not just "truthy"/"no throw").
         b. Run the test. Confirm it fails — and fails for the RIGHT reason
            (assertion failure or missing symbol, NOT a typo/import error).
         c. Commit:  test: <behavior>            ← the failing test, committed red

GREEN    d. Write the MINIMAL code to make it pass. Hard-code if that is honestly
            the simplest thing — the next test will force generalization.
            Do not add unrequested abstraction, fields, or "while I'm here" code.
         e. Run the test (and the full suite). Confirm green, nothing else broke.
         f. Commit:  feat: <behavior>            ← implementation, committed green

REFACTOR g. Improve the design now that it's green: remove duplication, rename for
            intent, extract functions/modules. Tests must stay green throughout.
            If there's nothing to clean, skip — don't refactor for its own sake.
         h. Run the full suite again. Still green.
         i. Commit:  refactor: <what changed>    ← only if step g did something
```

Then move to the next behavior. Keep commits small — a reviewer should be able to read the log top-to-bottom and watch the design emerge.

### 3. Between behaviors — quality gate

After each behavior (or each small batch), run the fast gate: `lint` + `type-check` + full `test` suite. Keep tests **fast and deterministic** — no real network, no real clock, no shared mutable state, no ordering dependence. Fix before moving on; never commit a red suite as "done".

### 4. Feature done

When all behaviors are green:
1. Run the full suite once more with coverage. Core logic should be well-covered (aim high on domain code; don't chase 100% on glue/UI).
2. Self-review the diff against the requirements doc — did scope creep in? Is anything in "deliberately left out" now accidentally built?
3. Optional `/code-review` pass, then fix findings (each fix its own commit).
4. Update `docs/` if the design diverged from the plan.

### 5. Capture the AI trail (artifact)

Incubyte grades *how you used AI*. As you go, keep `docs/ai-notes.md` updated with: the notable prompts/instructions you gave, decisions where you overrode or corrected the AI, and trade-offs considered. This file is a graded artifact — treat it as a lab notebook, not an afterthought.

---

## Commit conventions

Conventional Commits, one logical step per commit. The phase is visible in the type:

| Phase | Type | Example |
|---|---|---|
| Failing test | `test:` | `test: filter employees by country` |
| Make it pass | `feat:` | `feat: filter employees by country` |
| Clean up (green) | `refactor:` | `refactor: extract SalaryFilter value object` |
| Requirements/docs | `docs:` | `docs: add one-page requirements` |
| Tooling/config | `chore:` | `chore: configure vitest + coverage` |
| Bug + its regression test | `fix:` | `fix: reject min>max salary range` |

Rules:
- **Never** mix a test and its implementation in one commit — that hides the red step the reviewers want to see.
- A `fix:` should be preceded by a `test:` commit that reproduces the bug (red), then the `fix:` turns it green.
- Commit messages describe behavior, not mechanics ("filter by country", not "add if-statement to service").
- Do not commit credentials, `.env`, or generated DB files — keep `.gitignore` honest.

---

## Anti-patterns (reject these)

| Anti-pattern | Do instead |
|---|---|
| Writing the implementation, then a test that passes immediately | Test first; watch it fail before writing code |
| One giant commit at the end | Commit every RED/GREEN/REFACTOR transition |
| Weak assertions (`expect(x).toBeTruthy()`) | Assert the exact expected value/shape |
| Testing implementation details / mocking everything | Test observable behavior; mock only true boundaries (network, clock, randomness) |
| Building "deliberately left out" features because they're easy | Honor the scope in `docs/requirements.md` |
| Refactoring while a test is red | Get to green first, then refactor |
| Generalizing before a second test demands it | Hard-code, let the next failing test force the general case |
| Flaky/slow tests (real time, real I/O, order-dependent) | Inject the clock, fake the boundary, isolate state |

---

## Edge cases

| Scenario | Handling |
|---|---|
| First behavior in a fresh repo | Preflight runs `git init` + initial commit before RED |
| Test fails for the wrong reason (typo/import) | Fix the harness, re-run; a real RED is an *assertion* failure, not a crash |
| Behavior turns out too big for one test | Split it into sub-behaviors and re-confirm the list with the user |
| Nothing to refactor | Skip the REFACTOR commit — don't invent cleanup |
| Bug found later | Reproduce with a failing `test:` commit first, then `fix:` to green |
| Pure config/UI glue with no logic to test | A focused smoke/render test is enough; note the choice in `ai-notes.md` |

---

## Usage

```
/tdd <feature or behavior to build>
```

Examples:
```
/tdd salary CRUD for an employee
/tdd filter employees by country and salary range
/tdd CSV export of the current employee view
```
