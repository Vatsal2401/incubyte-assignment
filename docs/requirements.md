# Requirements — ACME Salary Management

_One-page requirements, written before building. Author: Vatsal · Date: 2026-05-30_

## Goal

Give ACME's **HR Manager** a fast, web-based tool to manage salary data for ~10,000 employees
across multiple countries, replacing error-prone spreadsheets — and let them **answer questions
about how the org pays people** (averages, ranges, spend by country/department) without writing
formulas or pivot tables.

## User & Primary Jobs-to-be-Done

**Persona:** HR Manager — comfortable with spreadsheets, not technical. Needs answers in a few
clicks, trusts the numbers, works across currencies and countries.

1. Find an employee and view/update their salary quickly.
2. Add a new employee with their compensation; offboard one who leaves.
3. Browse/search/filter the workforce by country, department, and salary range without lag.
4. Answer "how do we pay people?" — averages, min/max, headcount, and total spend, sliced by
   country and department.

## Scope (what we WILL build)

| Area | Feature |
|---|---|
| **Employee records** | CRUD: name, email, job title, department, country, currency, salary, status (active/inactive), hire date |
| **Listing** | Server-side paginated, sortable, searchable table (handles 10k rows smoothly) |
| **Filtering** | By country, department, and salary min/max — combinable |
| **Analytics** | Summary dashboard: total headcount & spend, average/min/max salary, breakdown by country and by department |
| **Data integrity** | Validated input (required fields, email format, non-negative salary, currency from a known set) |
| **Seeding** | Deterministic seed of 10,000 realistic employees across countries/departments/currencies |
| **Quality** | Unit tests (TDD) for domain logic; clean layered architecture; documented AI usage |

### Key product decisions

- **Money is stored as integer minor units (cents) + an explicit currency.** No floats — avoids
  rounding drift. Amounts are never summed across currencies without conversion.
- **Analytics are computed in the database** (Prisma `aggregate`/`groupBy`), not in JS, so they
  stay fast at 10k+ rows.
- **One organization, one HR Manager.** No tenancy or per-row ownership model needed.

## Out of Scope — and WHY

Deliberately left out. Each is a conscious trade-off to keep the solution focused, correct, and
well-tested within the assignment's time box, not an oversight.

| Excluded | Why it's safe to exclude now |
|---|---|
| **Authentication / RBAC** | Single trusted HR-Manager persona; auth is well-understood plumbing that would add surface area and tests without exercising the *core* problem (salary data + insights). Architected so an auth guard can be added later without reshaping the domain. |
| **Multi-currency normalization (live FX)** | Real FX rates are a moving external dependency. I store currency explicitly and report **per-currency** totals — honest and correct — rather than faking a blended number with a stale rate. A conversion layer can slot in later. |
| **Salary history / audit trail** | Valuable in production, but doubles the data model and seeding effort. I model current compensation; the schema leaves room to add an append-only `SalaryChange` table without migration pain. |
| **Payroll / payslips / tax** | A different product. The brief is *salary management & insight*, not running payroll. |
| **Bulk Excel import/export** | The brief is to *replace* spreadsheets, not bridge them. Seeding proves we can ingest 10k rows; a CSV import is a thin add-on, not core. |
| **Org hierarchy (manager → reports)** | Adds graph complexity that none of the four core jobs require. Department grouping covers the analytics need. |
| **Real-time collaboration / notifications** | Single-user tool; no concurrent-edit problem to solve. |
| **Soft delete UI / restore** | Status (active/inactive) covers offboarding. Full delete is rare and out of the core loop. |

## Non-Functional Requirements

- **Performance:** list and analytics endpoints respond quickly at 10k rows — pagination + DB-side
  aggregation + indexes on filtered/sorted columns. The UI never renders 10k DOM rows at once.
- **Correctness:** all money math on integer minor units; input validated at the API boundary.
- **Testability:** domain logic covered by fast, deterministic unit tests written test-first.
- **Maintainability:** layered NestJS (controller → service → Prisma), strict TypeScript, conventional commits.
- **Portability:** SQLite for zero-setup dev; schema kept Postgres-portable for a hosted deploy.

## Success Criteria

- HR Manager can do all four core jobs end-to-end in the deployed app.
- 10,000 seeded employees; list/filter/analytics stay smooth.
- Green, fast unit-test suite covering salary/filter/analytics logic.
- Commit history shows the TDD evolution; AI usage is documented.

## Assumptions

- One organization, one HR Manager user; trusted environment.
- A fixed set of supported currencies (e.g. USD, INR, EUR, GBP, AUD) and countries.
- "Salary" means current annual gross base compensation in the employee's local currency.
