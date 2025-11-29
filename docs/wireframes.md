# Wireframes for PFMS MVP

This document outlines simple, clear wireframes for the key pages in the Personal Finance Management System (PFMS) MVP. Each wireframe includes required fields, layout hierarchy, error message display, and navigation between pages.

## Navigation Structure
- Top navigation bar or sidebar with links to: Dashboard, Transactions, Budgets, Reminders.
- Each page has a consistent header with the page title and navigation.
- Footer with any global actions (e.g., logout placeholder, but out of scope for MVP).

## 1. Dashboard
**Purpose:** Overview of financial status, with quick access to main features.

**Layout Hierarchy:**
- Header: Page title "Dashboard" + Navigation links.
- Main Content:
  - Summary Cards: Income Total, Expense Total, Net Total (for current month).
  - Quick Links: Buttons to "View Transactions", "View Budgets", "View Reminders".
- Footer: Placeholder for future features.

**Required Fields:** None (display-only).

**Error Messages:** Displayed in a banner at the top if API fails (e.g., "Failed to load dashboard data. Please try again.").

**Navigation:** Links in header/sidebar to Transactions, Budgets, Reminders. Quick links navigate to respective list pages.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
|                             |
| Income: $XXXX.XX            |
| Expense: $XXXX.XX           |
| Net: $XXXX.XX               |
|                             |
| [View Transactions] [View Budgets] [View Reminders] |
|                             |
+-----------------------------+
```

## 2. Transactions List
**Purpose:** Display list of transactions with filters and totals.

**Layout Hierarchy:**
- Header: Page title "Transactions" + Navigation links + "Add Transaction" button.
- Filters: Dropdown for kind (All, Income, Expense).
- List: Table with columns: Date, Kind, Amount, Category, Note, Actions (Edit/Delete placeholders).
- Totals: Income Total, Expense Total, Net Total (for filtered period).
- Pagination: Placeholder for future.

**Required Fields:** None (list view).

**Error Messages:** Banner at top if fetch fails (e.g., "Failed to load transactions.").

**Navigation:** Header links to Dashboard, Budgets, Reminders. "Add Transaction" button to Add Transaction form.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Add Transaction]           |
| Filter: [All v]             |
|                             |
| Date | Kind | Amount | Category | Note | Actions |
|------|------|--------|----------|------|---------|
| ...  | ...  | ...    | ...      | ...  | [Edit] [Del] |
|                             |
| Income: $XXXX.XX Expense: $XXXX.XX Net: $XXXX.XX |
+-----------------------------+
```

## 3. Add Transaction Form
**Purpose:** Form to create a new transaction.

**Layout Hierarchy:**
- Header: Page title "Add Transaction" + Navigation links + "Cancel" button.
- Form:
  - Kind: Radio buttons (Income, Expense) - required.
  - Amount: Number input (>0) - required.
  - Category: Text input - optional (default "general").
  - Note: Text input - optional.
  - Submit Button: "Add Transaction".
- Error Messages: Below each field or in a summary banner.

**Required Fields:** Kind, Amount.

**Error Messages:** Inline below fields (e.g., "Amount must be greater than 0"). Banner for server errors (e.g., "Failed to add transaction.").

**Navigation:** Header links to Dashboard, Transactions, etc. "Cancel" back to Transactions List. Success redirects to Transactions List.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Cancel]                    |
|                             |
| Kind: ( ) Income ( ) Expense |
| Amount: [_____]             |
| Category: [_____]           |
| Note: [_____]               |
|                             |
| [Add Transaction]           |
|                             |
| Error: Amount must be > 0   |
+-----------------------------+
```

## 4. Budgets List
**Purpose:** Display budgets with utilization for current month.

**Layout Hierarchy:**
- Header: Page title "Budgets" + Navigation links + "Add Budget" button.
- List: Table with columns: Category, Month, Cap Amount, Spent, Utilization (%).
- No filters in MVP.

**Required Fields:** None (list view).

**Error Messages:** Banner if fetch fails (e.g., "Failed to load budgets.").

**Navigation:** Header links to Dashboard, Transactions, Reminders. "Add Budget" to Add Budget form.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Add Budget]                |
|                             |
| Category | Month | Cap | Spent | Utilization |
|----------|-------|-----|-------|-------------|
| ...      | ...   | ... | ...   | ...%        |
+-----------------------------+
```

## 5. Add Budget Form
**Purpose:** Form to create a new budget.

**Layout Hierarchy:**
- Header: Page title "Add Budget" + Navigation links + "Cancel" button.
- Form:
  - Category: Text input - required.
  - Month: Text input (YYYY-MM format) - required.
  - Cap Amount: Number input (>=0) - required.
  - Submit Button: "Add Budget".
- Error Messages: Below fields or banner.

**Required Fields:** Category, Month, Cap Amount.

**Error Messages:** Inline (e.g., "Month must be in YYYY-MM format"). Banner for duplicates or server errors.

**Navigation:** Header links. "Cancel" to Budgets List. Success to Budgets List.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Cancel]                    |
|                             |
| Category: [_____]           |
| Month: [_____]              |
| Cap Amount: [_____]         |
|                             |
| [Add Budget]                |
|                             |
| Error: Month format invalid |
+-----------------------------+
```

## 6. Reminders List
**Purpose:** Display list of reminders with date filters.

**Layout Hierarchy:**
- Header: Page title "Reminders" + Navigation links + "Add Reminder" button.
- Filters: Date range inputs (From, To).
- List: Table with columns: Name, Due Date, Amount, Payee, Notes, Actions.
- No totals.

**Required Fields:** None.

**Error Messages:** Banner if fetch fails.

**Navigation:** Header links. "Add Reminder" to Add Reminder form.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Add Reminder]              |
| From: [_____] To: [_____]   |
|                             |
| Name | Due Date | Amount | Payee | Notes | Actions |
|------|----------|--------|-------|-------|---------|
| ...  | ...      | ...    | ...   | ...   | [Edit] [Del] |
+-----------------------------+
```

## 7. Add Reminder Form
**Purpose:** Form to create a new reminder.

**Layout Hierarchy:**
- Header: Page title "Add Reminder" + Navigation links + "Cancel" button.
- Form:
  - Name: Text input - required.
  - Due Date: Date input (>= today) - required.
  - Amount: Number input (>=0) - required.
  - Payee: Text input - optional.
  - Notes: Text input - optional.
  - Submit Button: "Add Reminder".
- Error Messages: Below fields or banner.

**Required Fields:** Name, Due Date, Amount.

**Error Messages:** Inline (e.g., "Due date must be today or later"). Banner for server errors.

**Navigation:** Header links. "Cancel" to Reminders List. Success to Reminders List.

```
+-----------------------------+
| Dashboard | Transactions | Budgets | Reminders |
+-----------------------------+
| [Cancel]                    |
|                             |
| Name: [_____]               |
| Due Date: [_____]           |
| Amount: [_____]             |
| Payee: [_____]              |
| Notes: [_____]              |
|                             |
| [Add Reminder]              |
|                             |
| Error: Due date invalid     |
+-----------------------------+
