from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from ..models import Budget, Transaction
import re

def create_budget(db, budget_data):
    # Validate month format
    if not re.match(r'^\d{4}-\d{2}$', budget_data.month):
        raise ValueError("Month must be in YYYY-MM format")
    if budget_data.cap_amount < 0:
        raise ValueError("Cap amount must be greater than or equal to 0")

    # Check for unique (category, month)
    existing = db.query(Budget).filter(
        Budget.category == budget_data.category,
        Budget.month == budget_data.month
    ).first()
    if existing:
        raise ValueError("Budget for this category and month already exists")

    # Create budget
    budget = Budget(**budget_data.model_dump())
    db.add(budget)
    db.commit()
    db.refresh(budget)
    return budget

def compute_utilization(db, category, month):
    # Sum of expenses for category in month
    # Month format: YYYY-MM
    year, month_num = month.split('-')
    start_date = f"{year}-{month_num}-01"
    if month_num == '12':
        end_year = str(int(year) + 1)
        end_date = f"{end_year}-01-01"
    else:
        end_month = str(int(month_num) + 1).zfill(2)
        end_date = f"{year}-{end_month}-01"

    total_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.kind == 'expense',
        Transaction.category == category,
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).scalar() or 0

    return float(total_expense)

def get_budgets(db, month=None):
    query = db.query(Budget)
    if month:
        if not re.match(r'^\d{4}-\d{2}$', month):
            raise ValueError("Month must be in YYYY-MM format")
        query = query.filter(Budget.month == month)

    budgets = query.all()
    # Add utilization to each budget
    for budget in budgets:
        budget.utilization = compute_utilization(db, budget.category, budget.month)

    return budgets
