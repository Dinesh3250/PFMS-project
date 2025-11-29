# Frontend Sprint 1 Specification

This document details the UI flows, error handling, loading states, and data management for Sprint 1 of the PFMS frontend.

## UI Flow for Submitting a Transaction

### Happy Path
1. User navigates to "Add Transaction" form from Transactions list or Dashboard.
2. User fills in:
   - Kind: Selects "Income" or "Expense" (required).
   - Amount: Enters positive number (required).
   - Category: Enters text or leaves as "general" (optional).
   - Note: Enters additional text (optional).
3. User clicks "Add Transaction" button.
4. Form shows loading spinner on button.
5. On success: Form clears, success message displays ("Transaction added successfully"), user redirected to Transactions list.
6. Transactions list refreshes to show new transaction.

### Error Handling
- **Client-side validation**: Amount must be > 0, kind must be selected. Show inline error messages below fields.
- **Server validation fails**: Display error banner with message from API (e.g., "Amount must be greater than 0").
- **Network error**: Display "Failed to add transaction. Please try again." with retry option.

## UI Flow for Submitting a Budget Cap

### Happy Path
1. User navigates to "Add Budget" form from Budgets list.
2. User fills in:
   - Category: Enters text (required).
   - Month: Enters YYYY-MM format (required).
   - Cap Amount: Enters number >= 0 (required).
3. User clicks "Add Budget" button.
4. Form shows loading spinner on button.
5. On success: Form clears, success message displays ("Budget added successfully"), user redirected to Budgets list.
6. Budgets list refreshes to show new budget.

### Error Handling
- **Client-side validation**: Month in YYYY-MM format, cap amount >= 0. Show inline errors.
- **Server validation fails**: Display error banner (e.g., "Budget already exists for this category and month").
- **Network error**: Display "Failed to add budget. Please try again." with retry option.

## UI Flow for Submitting a Reminder

### Happy Path
1. User navigates to "Add Reminder" form from Reminders list.
2. User fills in:
   - Name: Enters text (required).
   - Due Date: Selects date >= today (required).
   - Amount: Enters number >= 0 (required).
   - Payee: Enters text (optional).
   - Notes: Enters text (optional).
3. User clicks "Add Reminder" button.
4. Form shows loading spinner on button.
5. On success: Form clears, success message displays ("Reminder added successfully"), user redirected to Reminders list.
6. Reminders list refreshes to show new reminder.

### Error Handling
- **Client-side validation**: Due date >= today, amount >= 0. Show inline errors.
- **Server validation fails**: Display error banner (e.g., "Due date must be today or later").
- **Network error**: Display "Failed to add reminder. Please try again." with retry option.

## Error Flow (Invalid Input, Backend Validation Fails)

### General Error Handling
- **Inline Validation Errors**: Display below each field in red text (e.g., "Amount must be greater than 0").
- **Server Error Banner**: Fixed banner at top of form/page with error message from API response.
- **Network Errors**: Generic message with retry button that re-submits the form.
- **Form State**: Keep user input on validation errors, clear on success.

### Error Message Display
- Use consistent styling: Red text for errors, green for success.
- Error banner: Dismissible, appears above form content.
- Success message: Auto-dismiss after 3 seconds or user navigation.

## Loading States

### Form Submission
- Button text changes to "Adding..." with spinner icon.
- Disable all form inputs during submission.
- Prevent multiple submissions.

### Page Loading
- Skeleton loaders for lists (show placeholder rows).
- Spinner for dashboard totals.
- Loading indicator for data fetches.

### Navigation
- No loading states for navigation (assume instant).

## Success States

### Form Success
- Clear form fields.
- Display success message.
- Redirect to list page after 1 second.
- Refresh list data to show new item.

### List Refresh
- Show brief "Updated" indicator after refresh.
- Update totals/dashboard data immediately.

## Refresh Triggers

### Automatic Refresh
- Dashboard: Load on page mount, refresh when navigating back from forms.
- Lists: Load on page mount, refresh after successful form submission.

### Manual Refresh
- Pull-to-refresh on mobile (future).
- Refresh button on lists (optional for MVP).

### Data Consistency
- No real-time updates (polling not required for MVP).
- Refresh on navigation to ensure latest data.

## Dashboard "Data Hydration" Flow

### Initial Load
1. Page mounts, show loading spinners for totals.
2. Fetch transactions for current month via GET /transactions (no filter).
3. Compute totals: Sum income, sum expenses, net = income - expenses.
4. Display totals, hide spinners.

### Error Handling
- If fetch fails: Show "Failed to load dashboard data. Please try again." with retry button.
- Retry: Re-fetch data, show loading again.

### Refresh Triggers
- On page mount (initial load).
- When returning from form pages (after successful submission).
- Manual refresh button (optional).

### Data Dependencies
- Dashboard depends only on transaction data.
- No caching required for MVP.
- Totals recalculated on every load.

### Performance Considerations
- Single API call to get all transactions.
- Client-side computation of totals.
- No pagination for dashboard (assume small dataset).
