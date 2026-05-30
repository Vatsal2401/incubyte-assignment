# Review

Dispatch the `code-reviewer` agent to review the current changes against this repo's rules.

## When to use

- After a feature is green and `/verify` passes, before opening a PR.
- After addressing previous review findings (re-review).

## Workflow

1. Determine scope:
   - On a feature branch → review `git diff main...HEAD`.
   - Uncommitted work → review `git diff` + `git diff --staged`.
2. Dispatch the `code-reviewer` agent (`.claude/agents/code-reviewer.md`) with that scope.
3. Relay its findings grouped by severity (CRITICAL → LOW).
4. For each accepted finding, fix it as its **own** commit (`fix:` / `refactor:`), then re-run `/verify`.
5. If anything was CHANGES REQUESTED, re-run `/review` after fixing until APPROVE.

## Usage

```
/review                 # review the current branch/diff
/review <path or area>  # focus the review on a specific area
```
