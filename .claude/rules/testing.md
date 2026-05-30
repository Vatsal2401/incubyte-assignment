---
paths:
  - "**/*.spec.ts"
  - "**/*.test.ts"
  - "**/*.spec.tsx"
  - "**/*.test.tsx"
  - "**/*.ts"
  - "**/*.tsx"
---

# Testing Rules

> Vitest for both api and web. Tests are first-class — they are written **before** the code
> that makes them pass (TDD). They are also a graded artifact: assertion strength and mock
> handling are scored. Reference `.claude/commands/tdd.md` for the red→green→refactor loop.

## Principles (non-negotiable)

- **Fast** — the unit suite runs in seconds. No real network, no real timers, no sleeps.
- **Deterministic** — same input → same result, every run, any order. No reliance on `Date.now()`,
  `Math.random()`, wall-clock, or test ordering. Inject the clock / seed the RNG.
- **Isolated** — no shared mutable state between tests. Reset mocks in `beforeEach`.
- **Behavioral** — assert observable behavior and exact values, not implementation details.
- **Readable** — a test name states the behavior; the body reads as Arrange / Act / Assert.

## What to test (and what not to)

| Test | Don't bother |
|---|---|
| Services with business logic (salary calc, filtering, aggregation, validation rules) | Prisma schema / entity declarations |
| Money/currency math, edge cases (min>max range, empty filter, zero matches) | Thin controllers that only delegate (cover via API/e2e if at all) |
| DTO validation (class-validator rules reject bad input) | Trivial getters/passthroughs with no logic |
| Custom query logic & pagination boundaries | Third-party library internals |
| React: feature hooks + components with conditional/derived logic | Pure shadcn/ui primitives unchanged |

## Strong assertions

Assert the **value/shape**, not just "it ran".

```ts
// WEAK — passes even when the result is wrong
expect(result).toBeTruthy();
expect(() => service.find()).not.toThrow();

// STRONG — pins the actual contract
expect(result).toEqual({ total: 2, items: [{ id: 1, country: 'IN' }, { id: 2, country: 'IN' }] });
expect(repo.findMany).toHaveBeenCalledWith({ where: { country: 'IN' }, skip: 0, take: 25 });
await expect(service.find({ min: 100, max: 1 })).rejects.toThrow(BadRequestException);
```

## Mocking

- **Mock only at the boundary**: `PrismaService`, HTTP clients, the clock, randomness. Never mock the unit under test.
- Prefer a typed mock of `PrismaService` (e.g. `vitest-mock-extended`'s `mockDeep<PrismaClient>()`) over hand-rolled `any`.
- Use `vi.fn()` for simple stubs, `vi.spyOn()` when original behavior matters.
- `vi.useFakeTimers()` / inject a `Clock` for any time-dependent logic. Seed the RNG for any randomness.
- Reset between tests: `beforeEach(() => vi.clearAllMocks())` (or `restoreAllMocks` when spying).

## Patterns

### NestJS service (mocked Prisma)
```ts
import { Test } from '@nestjs/testing';
import { mockDeep, DeepMockProxy } from 'vitest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';

describe('SalaryService', () => {
  let service: SalaryService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaService>();
    const moduleRef = await Test.createTestingModule({
      providers: [SalaryService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(SalaryService);
  });

  it('averages salaries by country', async () => {
    prisma.employee.groupBy.mockResolvedValue([
      { country: 'IN', _avg: { salaryMinor: 5_000_00 } },
    ] as any);

    const result = await service.averageByCountry();

    expect(result).toEqual([{ country: 'IN', averageMinor: 5_000_00 }]);
  });
});
```

### React feature hook / component
- Test components with React Testing Library + Vitest; query by role/text, assert what the user sees.
- Wrap in a `QueryClientProvider` with retries disabled; mock the api client at the module boundary.

## Anti-patterns (reject in review)

- Writing the test after the code so it can never have failed (TDD bypass).
- `toBeTruthy()` / `not.toThrow()` as the only assertion.
- Mocking everything, then asserting the mocks (tests the test double, not the code).
- Tests that depend on run order, real time, real network, or a real DB file.
- Snapshot tests used to avoid writing a real assertion.
