
# PFMS — MVP Scope (Week 1 Freeze)

**Status:** Frozen for MVP (Weeks 1–6). Changes require a PR updating this file and api-contracts.

## 1. MVP Features

### A) Transactions
- Create income or expense entries.
- List transactions with basic filters (kind: income|expense).
- Show running totals (income, expense, net) for the selected period (default: current month).

**User Stories**
- As a user, I can add an income with amount > 0, category, note.
- As a user, I can add an expense with amount > 0, category, note.
- As a user, I can see a list of my recent transactions and current-month totals.

**Acceptance Criteria**
- POST /transactions returns 201 with the created item.
- GET /transactions returns items ordered by created_at desc.
- Validation errors return { error: "VALIDATION_ERROR", detail: "..." }.

---

### B) Budgets (Monthly Caps)
- Define a monthly cap per category (cap_amount >= 0).
- View current-month utilization per category: spent vs cap.

**Rules**
- Month format: `YYYY-MM`.
- Category match is by exact string equality (case-insensitive compare in UI).
- Utilization = SUM(expense.amount where created_at ∈ month AND category = budget.category).

**User Stories**
- As a user, I can set a monthly budget cap for a category.
- As a user, I can view utilization (spent vs cap) for current month.

**Acceptance Criteria**
- Unique (category, month) per budget.
- GET /budgets?month=YYYY-MM returns list with `{..., utilization}` for each.
- If no matching expenses exist, utilization = 0.

**Edge Cases**
- If cap_amount = 0, utilization still computed; UI must not divide by zero.
- If category appears in transactions but not in budgets, it’s simply not listed in `/budgets` response.

---

### C) Reminders (Bill Minders)
- Track upcoming bills with due date and amount. Listing only; no notifications in MVP.

**Fields**
- name (string, required)
- due_date (date, must be ≥ today for creation)
- amount (decimal >= 0)
- payee (string, optional)
- notes (string, optional)

**User Stories**
- As a user, I can record a bill I need to pay on a certain date.
- As a user, I can list bills due in a date range.

**Acceptance Criteria**
- POST /reminders creates a reminder; GET /reminders?from=&to= filters by date.
- Server validates due_date format and non-negative amount.

---

## 2. Non-Goals (Out of Scope for MVP)
- Authentication and multi-user accounts.
- Recurring rules engine or automatic notifications.
- CSV import/export.
- Fancy charts beyond placeholder totals.
- Categories taxonomy management (free-text only).
- Anything not listed in MVP Features.

---

## 3. Cross-Cutting Conventions (MVP)
- API: JSON only; endpoints `/transactions`, `/budgets`, `/reminders`.
- Fields in request/response: `snake_case`.
- Pagination (where added): `page`, `limit` (defaults can be ignored for MVP).
- Errors: `{ "error": "VALIDATION_ERROR" | "NOT_FOUND" | "SERVER_ERROR", "detail": "..." }`.

---

## 4. Definition of Done (MVP)
- Endpoint implemented, validated, and documented in `docs/api-contracts.md`.
- Service-layer unit tests exist and pass in CI.
- Frontend flow exists from Dashboard and handles failure with a user-facing message.
- CI green: lints + tests + FE build pass.
- Layout is responsive enough to use on a small laptop screen.

---

## 5. Traceability
- ERD: `docs/erd.md` and `docs/erd.png`
- API contracts: `docs/api-contracts.md`
- Conventions & stack: `docs/stack-and-conventions.md`
