POST /transactions
Req: { kind: "income"|"expense", amount: number, category?: string, note?: string }
201 Res: { id, kind, amount, category, note, created_at }
Errors: 400 VALIDATION_ERROR
GET /transactions?kind=income|expense&page=1&limit=50
200 Res: [ { id, kind, amount, ... } ]
POST /budgets
Req: { category, month: "YYYY-MM", cap_amount }
201 Res: { id, category, month, cap_amount }
GET /budgets?month=YYYY-MM
200 Res: [ { id, category, month, cap_amount, utilization: number } ]
POST /reminders
Req: { name, due_date, amount, payee?, notes? }
201 Res: { id, name, due_date, amount, payee, notes }
GET /reminders?from=YYYY-MM-DD&to=YYYY-MM-DD
200 Res: [ ... ]
