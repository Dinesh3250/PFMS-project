# PFMS ERD (Week 1 Draft)

## Entities

* `Transaction(id PK, kind enum[income|expense], amount decimal(12,2) > 0, category text, note text, created_at datetime)`
* `Budget(id PK, category text, month char(7) 'YYYY-MM', cap_amount decimal(12,2) >= 0)`
* `Reminder(id PK, name text, due_date date > today-1, amount decimal(12,2) >= 0, payee text, notes text)`

## Relationships

* Budgets are per category per month; Transactions reference category; Utilization is computed:
  `spent(category, month) = SUM(amount where kind='expense' and created_at in month)`

## Constraints

* `Transaction.kind ∈ {income, expense}`
* `Budget unique (category, month)`
* Pseudo-FK by category; no hard FK because categories are free-text in MVP.

## Sample SQL (for sanity-check locally)

```sql
CREATE TABLE transactions(
  id INTEGER PRIMARY KEY,
  kind TEXT CHECK(kind IN ('income','expense')) NOT NULL,
  amount NUMERIC(12,2) CHECK(amount > 0) NOT NULL,
  category TEXT DEFAULT 'general',
  note TEXT DEFAULT '',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE budgets(
  id INTEGER PRIMARY KEY,
  category TEXT NOT NULL,
  month CHAR(7) NOT NULL,
  cap_amount NUMERIC(12,2) CHECK(cap_amount >= 0) NOT NULL,
  UNIQUE(category, month)
);
CREATE TABLE reminders(
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC(12,2) CHECK(amount >= 0) NOT NULL,
  payee TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);
