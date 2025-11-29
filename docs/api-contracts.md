# API Contracts - Version 1

This document outlines the API contracts for the PFMS MVP. All dates use the format YYYY-MM-DD. All months use the format YYYY-MM.

## Transactions

### POST /transactions

**Request Fields (in plain English):**
- kind: A string that must be either "income" or "expense" to indicate the type of transaction.
- amount: A positive number greater than zero representing the transaction amount.
- category: An optional string for the transaction category, defaulting to "general" if not provided.
- note: An optional string for additional notes about the transaction, defaulting to an empty string if not provided.

**Response Fields:**
- id: An integer uniquely identifying the transaction.
- kind: The string value of the transaction type ("income" or "expense").
- amount: The number representing the transaction amount.
- category: The string value of the category.
- note: The string value of the note.
- created_at: A datetime string showing when the transaction was created.

**Error Examples for Validation Failures:**
- If kind is not "income" or "expense": {"error": "VALIDATION_ERROR", "detail": "kind must be 'income' or 'expense'"}
- If amount is not greater than zero: {"error": "VALIDATION_ERROR", "detail": "amount must be greater than 0"}

**Example Request (text):**
kind: "expense", amount: 50.00, category: "food", note: "Lunch"

**Example Response (text):**
id: 123, kind: "expense", amount: 50.00, category: "food", note: "Lunch", created_at: "2023-10-01T12:00:00Z"

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Validate request fields (kind, amount) | Yes | No |
| Save transaction to database | Yes | No |
| Return created transaction data | Yes | No |
| Handle form submission and send request | No | Yes |
| Display success/error messages to user | No | Yes |

### GET /transactions

**Query Parameters, Filters, and Optional Pagination:**
- kind: Optional string filter for "income" or "expense" to show only transactions of that type.
- page: Optional integer for pagination, default not specified.
- limit: Optional integer for pagination, default not specified.

**Response Fields:**
- An array of transaction objects, each with id (integer), kind (string), amount (number), category (string), note (string), created_at (datetime).

**Error Examples for Validation Failures:**
- None specified for this endpoint.

**Example Request (text):**
GET /transactions?kind=expense&page=1&limit=10

**Example Response (text):**
[{id: 123, kind: "expense", amount: 50.00, category: "food", note: "Lunch", created_at: "2023-10-01T12:00:00Z"}, {id: 124, kind: "expense", amount: 20.00, category: "transport", note: "", created_at: "2023-10-02T10:00:00Z"}]

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Filter transactions by kind | Yes | No |
| Handle pagination | Yes | No |
| Retrieve and return transaction list | Yes | No |
| Display list of transactions | No | Yes |
| Handle filter inputs from user | No | Yes |

## Budgets

### POST /budgets

**Request Fields (in plain English):**
- category: A required string specifying the budget category.
- month: A required string in YYYY-MM format indicating the month for the budget.
- cap_amount: A number that must be zero or greater, setting the maximum budget amount for the category in that month.

**Response Fields:**
- id: An integer uniquely identifying the budget.
- category: The string value of the category.
- month: The string value of the month in YYYY-MM format.
- cap_amount: The number representing the cap amount.

**Error Examples for Validation Failures:**
- If month format is invalid: {"error": "VALIDATION_ERROR", "detail": "month must be in YYYY-MM format"}
- If cap_amount is negative: {"error": "VALIDATION_ERROR", "detail": "cap_amount must be greater than or equal to 0"}

**Example Request (text):**
category: "food", month: "2023-10", cap_amount: 500.00

**Example Response (text):**
id: 456, category: "food", month: "2023-10", cap_amount: 500.00

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Validate category, month, cap_amount | Yes | No |
| Ensure unique (category, month) | Yes | No |
| Save budget to database | Yes | No |
| Return created budget data | Yes | No |
| Handle form submission and send request | No | Yes |
| Display success/error messages to user | No | Yes |

### GET /budgets?month=YYYY-MM

**Query Parameters, Filters, and Optional Pagination:**
- month: Required string in YYYY-MM format to filter budgets for that specific month.

**Response Fields:**
- An array of budget objects, each with id (integer), category (string), month (string), cap_amount (number), utilization (number, computed as the sum of expenses for the category in the month).

**Error Examples for Validation Failures:**
- If month format is invalid: {"error": "VALIDATION_ERROR", "detail": "month must be in YYYY-MM format"}

**Example Request (text):**
GET /budgets?month=2023-10

**Example Response (text):**
[{id: 456, category: "food", month: "2023-10", cap_amount: 500.00, utilization: 150.00}, {id: 457, category: "transport", month: "2023-10", cap_amount: 200.00, utilization: 50.00}]

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Filter budgets by month | Yes | No |
| Compute utilization from transactions | Yes | No |
| Retrieve and return budget list with utilization | Yes | No |
| Display budgets with utilization | No | Yes |
| Handle month selection from user | No | Yes |

## Reminders

### POST /reminders

**Request Fields (in plain English):**
- name: A required string providing the name of the reminder.
- due_date: A required date in YYYY-MM-DD format that must be today or in the future.
- amount: A number that must be zero or greater, representing the amount associated with the reminder.
- payee: An optional string for the payee name.
- notes: An optional string for additional notes.

**Response Fields:**
- id: An integer uniquely identifying the reminder.
- name: The string value of the name.
- due_date: The date string in YYYY-MM-DD format.
- amount: The number representing the amount.
- payee: The string value of the payee.
- notes: The string value of the notes.

**Error Examples for Validation Failures:**
- If name is empty: {"error": "VALIDATION_ERROR", "detail": "name is required"}
- If due_date is in the past: {"error": "VALIDATION_ERROR", "detail": "due_date must be today or later"}
- If amount is negative: {"error": "VALIDATION_ERROR", "detail": "amount must be greater than or equal to 0"}

**Example Request (text):**
name: "Electricity Bill", due_date: "2023-10-15", amount: 100.00, payee: "Utility Co", notes: "Monthly bill"

**Example Response (text):**
id: 789, name: "Electricity Bill", due_date: "2023-10-15", amount: 100.00, payee: "Utility Co", notes: "Monthly bill"

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Validate name, due_date, amount | Yes | No |
| Ensure due_date is not in the past | Yes | No |
| Save reminder to database | Yes | No |
| Return created reminder data | Yes | No |
| Handle form submission and send request | No | Yes |
| Display success/error messages to user | No | Yes |

### GET /reminders?from=...&to=...

**Query Parameters, Filters, and Optional Pagination:**
- from: Optional date in YYYY-MM-DD format for the start of the date range.
- to: Optional date in YYYY-MM-DD format for the end of the date range.

**Response Fields:**
- An array of reminder objects, each with id (integer), name (string), due_date (date), amount (number), payee (string), notes (string).

**Error Examples for Validation Failures:**
- If from or to date format is invalid: {"error": "VALIDATION_ERROR", "detail": "date must be in YYYY-MM-DD format"}

**Example Request (text):**
GET /reminders?from=2023-10-01&to=2023-10-31

**Example Response (text):**
[{id: 789, name: "Electricity Bill", due_date: "2023-10-15", amount: 100.00, payee: "Utility Co", notes: "Monthly bill"}, {id: 790, name: "Rent", due_date: "2023-10-01", amount: 1200.00, payee: "Landlord", notes: ""}]

**Backend Responsibilities vs Frontend Responsibilities:**
| Responsibility | Backend | Frontend |
|----------------|---------|----------|
| Filter reminders by date range | Yes | No |
| Retrieve and return reminder list | Yes | No |
| Display list of reminders | No | Yes |
| Handle date range inputs from user | No | Yes |
