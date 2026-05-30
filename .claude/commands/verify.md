# Verify

Run the full verification loop. All checks must pass before committing a GREEN step or opening a PR.

## When to use

- Before committing the GREEN step of a TDD cycle (or at least run the relevant tests).
- Before `/review` and before opening a PR.
- After applying review fixes.

## Steps

Read the **Verification Commands** table in `CLAUDE.md` for exact commands. Run in sequence,
stop and report on the first failure:

1. **Typecheck** — `npm run typecheck` → zero errors.
2. **Lint** — `npm run lint` → zero errors/warnings. If auto-fixable, run `npm run lint:fix` and re-check.
3. **Test** — `npm run test` → all green, fast, deterministic.
4. **Build** — `npm run build` → api + web build succeed.

If a command doesn't exist yet (early in scaffolding), note it as `N/A (not wired)` rather than failing.

## Output

```
Verification Report
  Typecheck:  PASS / FAIL (N errors)
  Lint:       PASS / FAIL (N issues)
  Tests:      PASS / FAIL (N/N passing, Xs)
  Build:      PASS / FAIL (Xs)

  Status: READY / NOT READY — <first failure>
```

## Usage

```
/verify
```
