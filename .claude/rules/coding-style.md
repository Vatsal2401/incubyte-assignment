---
paths:
  - "**/*.ts"
  - "**/*.tsx"
---

# Coding Style

> TypeScript conventions for the NestJS API and the React/Vite web app.

## TypeScript

- `strict: true` in every tsconfig — no exceptions.
- No `any` without a `// justified: <reason>` comment. Prefer `unknown` + narrowing.
- Prefer discriminated unions over type assertions (`as`). Avoid `!` non-null assertions.
- Model domain values with precise types (e.g. `Currency = 'USD' | 'INR' | ...`), not bare `string`.

## File Organization

- One primary export per file (a service, a controller, a component, a DTO).
- File size: aim ≤ 250 lines; 400 is the hard ceiling — split first.
- Function length ≤ 50 lines; nesting depth ≤ 3 — extract helpers / early-return.
- Tests are colocated: `salary.service.ts` → `salary.service.spec.ts`.

## Naming

- **Files**: kebab-case with role suffix — `employee.service.ts`, `create-employee.dto.ts`, `salary-table.tsx`.
- **Classes**: PascalCase with suffix — `EmployeeService`, `CreateEmployeeDto`.
- **React components**: PascalCase files & symbols — `SalaryTable.tsx`.
- **Hooks**: `useThing` — `useEmployees.ts`.
- **Constants**: SCREAMING_SNAKE_CASE — `DEFAULT_PAGE_SIZE = 25`.
- **Booleans**: `is/has/can` prefix — `isActive`, `hasManager`.

## NestJS (api)

- Controllers stay **thin**: validate (via DTO) → delegate to service → return. No business logic in controllers.
- Business logic lives in **services**; DB access goes through `PrismaService`.
- Every request body/query is a **DTO with class-validator decorators**. Enable a global
  `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })` to strip/reject unknown fields (mass-assignment guard).
- Throw **NestJS HTTP exceptions** (`NotFoundException`, `BadRequestException`, `ConflictException`)
  with clear messages — never `throw new Error()` for an expected business failure (it becomes a generic 500).
- Use the Nest `Logger` (`new Logger(ClassName.name)`) — never `console.log` in api code.

## React / Vite (web)

- Function components + hooks only. No class components.
- Server state via **TanStack Query** (`useQuery`/`useMutation`) — don't hand-roll fetch-in-`useEffect` with `useState`.
- Keep components presentational where possible; lift data-fetching into feature hooks (`features/employees/useEmployees.ts`).
- Use shadcn/ui primitives; don't reinvent buttons/inputs/dialogs.
- No business/money math in the render path — format via a shared `formatMoney(amountMinor, currency)` helper.

## Money & Dates

- Salary amounts: integer **minor units** (cents) or Prisma `Decimal`. Never `number` float arithmetic on currency.
- Always carry `currency` alongside an amount. Never sum across currencies without converting.
- Dates: store/transport ISO 8601 UTC; format only at the view layer.

## Immutability & Errors

- Don't mutate function params. Use spread / `map`/`filter`/`reduce` over in-place mutation.
- Handle async errors — no unhandled rejections. Wrap external/DB calls that can fail.
- Fail loud in dev: surface validation and not-found cases as proper HTTP status codes.

## Hygiene

- No `console.log`, `debugger`, or commented-out code blocks committed (version control is the history).
- No magic numbers — name them (`DEFAULT_PAGE_SIZE`, `MAX_PAGE_SIZE`).
- No secrets in source. Config via env (`.env` is gitignored; commit `.env.example`).
