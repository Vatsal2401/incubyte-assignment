# UI Test

Drive the running app in a real browser via the **Browser MCP** to verify the UI/UX works the way
a user (the HR Manager persona) experiences it — not just that the unit tests pass. Captures
screenshots, walks the core journeys, and reports usability/accessibility/console issues.

This complements the Vitest suite: unit tests prove logic in isolation; this proves the *experience*
end-to-end against the real API and rendered DOM. Use it before a demo, after a UI change, or to
sanity-check responsiveness and theming.

## Prerequisites

1. **App running.** Either the single-container build (`npm run build:prod` then start the API → app
   at `http://localhost:3000`) or dev mode (`npm run dev` → web at `http://localhost:5173`, API at
   `:3000`). The DB should be seeded (`npm run seed`).
2. **Browser MCP connected.** The Browser MCP tools talk to a real tab through the browser extension.
   If a call returns *"No connection to browser extension"*, ask the user to click the Browser MCP
   extension icon and press **Connect**, then retry. Never fake a result — if it can't connect, stop
   and report that the step needs the user.

## Tools used

`mcp__browser-mcp__browser_navigate`, `browser_snapshot` (accessibility tree — use for assertions and
to get element refs), `browser_screenshot` (visual evidence), `browser_click`, `browser_type`,
`browser_select_option`, `browser_press_key`, `browser_hover`, `browser_wait`,
`browser_get_console_logs`.

> Prefer `browser_snapshot` over `browser_screenshot` for **assertions** (it's text the model can
> read and check); use `browser_screenshot` to capture **evidence** at each milestone.

## Workflow

For each journey: navigate → wait for load → snapshot (assert expected content) → screenshot
(evidence) → read console logs (flag errors/warnings) → interact → re-assert.

### 1. Dashboard (`/`)
- Navigate to the base URL. Snapshot: assert the sidebar (Dashboard/Employees/Analytics), the KPI
  cards (headcount, countries, departments), and both charts render.
- Assert the headcount KPI shows a number (data loaded from `/api/analytics/overview`, not a spinner).
- `browser_get_console_logs` → there must be **no uncaught errors** (a failed fetch or render error fails this step).
- Screenshot `dashboard`.

### 2. Theme toggle
- Click the theme toggle (aria-label "Toggle theme"). Snapshot/screenshot to confirm dark mode applied
  (background/foreground inverted). Toggle back. Screenshot `dark-mode`.

### 3. Employees (`/employees`)
- Click the **Employees** nav item. Assert the URL/active state changed and the table renders rows.
- **Search:** type a name fragment in the search box → assert the row count narrows.
- **Filter:** select a country and a department → assert results update and pagination total changes.
- **Salary range:** enter min/max → assert filtering applies; enter min > max → assert a graceful
  result (no crash; API returns 400 surfaced as the error state).
- **Pagination:** click Next/Previous → assert the page indicator and rows change.
- Screenshot `employees-filtered`.

### 4. Add employee (create flow)
- Click **Add employee** → assert the dialog opens. Fill name, email, job title, salary, hire date;
  pick department/country/currency. Submit.
- Assert the dialog closes and the new employee appears (or the total increments). Read console logs.
- **Validation:** open the dialog, submit with an invalid email / negative salary → assert the form
  blocks submission (native validation) — no bad request is sent.
- Screenshot `add-employee`.

### 5. Edit + deactivate
- Click **Edit** on a row → assert the form pre-fills. Change the salary → save → assert the row updates.
- Click **Deactivate** on an active row → assert the status badge flips to `inactive`.

### 6. Analytics (`/analytics`)
- Navigate via the sidebar. Assert the per-currency stats table (total/avg/min/max) and the two
  breakdown bar charts render. Screenshot `analytics`.

### 7. Responsive / mobile
- Reload at a narrow viewport (if the MCP supports sizing) or check the mobile menu button appears and
  opens the off-canvas sidebar. Assert nav still works. Screenshot `mobile-nav`.

## Output format

```
## UI Test Report — <date / build>

Journey                 Result   Notes
Dashboard loads + data   PASS     KPIs + 2 charts rendered, 0 console errors
Theme toggle             PASS     dark mode applied + persisted
Employees: search        PASS     "ada" → N rows
Employees: filters       PASS     country+dept narrowed total to N
Pagination               PASS
Add employee             PASS     created, total +1
Form validation          PASS     invalid email blocked client-side
Edit + deactivate        PASS     salary updated; status → inactive
Analytics                PASS     stats table + charts
Responsive nav           PASS     off-canvas sidebar opens

Screenshots: dashboard, dark-mode, employees-filtered, add-employee, analytics, mobile-nav
Console errors: none
Findings: <usability/a11y notes, or "none">

Verdict: SHIP / FIX — <top issue if any>
```

Only mark a journey PASS if the snapshot actually shows the expected state. Report console errors and
any UX rough edges (slow load, layout shift, unclear empty states) as findings — those are the
high-value observations.

## Usage

```
/ui-test                 # full journey pass against the running app
/ui-test dashboard       # focus one journey
/ui-test http://localhost:5173   # target a specific base URL (default http://localhost:3000)
```
