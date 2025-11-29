# Backend Package Structure and Model Alignment TODO

- [x] Update backend/app/models.py to add missing constraints (e.g., CHECK on Transaction.kind, amount > 0)
- [x] Create backend/app/services/ directory
- [x] Create backend/app/services/transaction_service.py (stub)
- [x] Create backend/app/services/budget_service.py (stub)
- [x] Create backend/app/services/reminder_service.py (stub)
- [x] Create backend/app/routers/budgets.py with POST and GET endpoints
- [x] Create backend/app/routers/reminders.py with POST and GET endpoints
- [x] Update backend/app/main.py to include budgets and reminders routers
