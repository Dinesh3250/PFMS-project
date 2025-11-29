# Backend Service Design

This document outlines the design of the service layer in the PFMS backend, including the responsibilities of each service, separation of concerns, error handling, and return values.

## Service Overview

The backend follows a layered architecture with clear separation of concerns:

- **Router Layer**: Handles HTTP requests/responses, input validation via Pydantic schemas, and delegates to services.
- **Service Layer**: Contains business logic, orchestrates operations, and enforces business rules.
- **Repository Layer**: Handles all database interactions (reads/writes) using SQLAlchemy.

## Services and Their Operations

### TransactionService

**Operations:**
- `add_transaction(db, tx_data)`: Creates a new transaction with validation (kind must be "income" or "expense", amount > 0).
- `list_transactions(db, kind=None, page=None, limit=None)`: Retrieves transactions, optionally filtered by kind, with pagination support.
- `get_transaction_totals(db, period="current_month")`: Computes income, expense, and net totals for the specified period.

**Business Rules:**
- Transactions must have valid kind and positive amount.
- Category defaults to "general" if not provided.
- Totals are calculated from transaction sums.

### BudgetService

**Operations:**
- `add_budget(db, budget_data)`: Creates a new budget with validation (unique category-month pair, cap_amount >= 0).
- `list_budgets_by_month(db, month)`: Retrieves budgets for a specific month, including computed utilization.
- `compute_utilization(db, category, month)`: Calculates spent amount as sum of expenses for the category in the month.

**Business Rules:**
- Budgets are unique per (category, month).
- Utilization is computed dynamically from transaction data.
- Cap amount must be >= 0.

### ReminderService

**Operations:**
- `add_reminder(db, reminder_data)`: Creates a new reminder with validation (due_date >= today, amount >= 0).
- `list_reminders_in_range(db, from_date=None, to_date=None)`: Retrieves reminders within the specified date range.

**Business Rules:**
- Due dates cannot be in the past.
- Amount must be >= 0.
- Reminders are listed in chronological order by due date.

## Separation of Concerns

### Service Layer Responsibilities
- **Business Logic**: Enforce business rules and validations.
- **Orchestration**: Coordinate between multiple repository calls if needed.
- **Data Transformation**: Convert between domain models and response schemas.
- **Error Handling**: Raise appropriate exceptions for business rule violations.

### Repository Layer Responsibilities
- **Database Operations**: All SQLAlchemy queries and mutations.
- **Data Access**: CRUD operations on models.
- **No Business Logic**: Pure data retrieval/manipulation without rules.

## Error and Validation Flows

### Service-Level Validation
Services perform business rule validation and raise exceptions that routers catch and convert to HTTP responses.

**Validation Errors:**
- Invalid input data (e.g., negative amounts, invalid dates).
- Business rule violations (e.g., duplicate budgets, past due dates).
- Data integrity issues (e.g., missing required fields).

**Error Types:**
- `ValueError`: For invalid input values.
- `IntegrityError`: For database constraint violations (e.g., unique constraints).
- Custom exceptions for specific business rules.

**Flow:**
1. Router receives request and validates with Pydantic schemas.
2. Router calls service method with validated data.
3. Service performs business rule validation.
4. If validation fails, service raises exception.
5. Router catches exception and returns appropriate HTTP error response.

### Example Error Flow
```python
# In service
def add_budget(db, budget_data):
    if budget_data.cap_amount < 0:
        raise ValueError("Cap amount must be >= 0")
    # Check for existing budget
    existing = db.query(Budget).filter_by(
        category=budget_data.category,
        month=budget_data.month
    ).first()
    if existing:
        raise ValueError("Budget already exists for this category and month")
    # Proceed with creation...

# In router
@router.post("/")
def create_budget(budget: schemas.BudgetIn, db: Session = Depends(get_db)):
    try:
        return budget_service.add_budget(db, budget)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

## Service Return Values

Each service method MUST return data in a format that routers can directly use for responses. Services should return:

### For Create Operations
- The created model instance (SQLAlchemy model) for the router to return as response_model.

### For List Operations
- A list of model instances or dictionaries with all required fields.
- For computed fields (like utilization), include them in the returned data.

### For Totals/Aggregations
- A dictionary with the computed values.

### Key Requirements
- Return SQLAlchemy model instances where possible (routers use response_model for serialization).
- Include all computed fields in the returned data.
- Do not return raw database results that need further processing by the router.
- Ensure returned data matches the expected response schemas.

### Examples
```python
# TransactionService.add_transaction
def add_transaction(db, tx_data):
    # ... validation ...
    obj = Transaction(**tx_data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj  # Router uses this for TxOut response

# BudgetService.list_budgets_by_month
def list_budgets_by_month(db, month):
    budgets = db.query(Budget).filter_by(month=month).all()
    result = []
    for budget in budgets:
        utilization = compute_utilization(db, budget.category, month)
        result.append({
            "id": budget.id,
            "category": budget.category,
            "month": budget.month,
            "cap_amount": budget.cap_amount,
            "utilization": utilization
        })
    return result  # Router returns this list
