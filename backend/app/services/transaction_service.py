from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import Transaction
from ..schemas import TxIn, TxOut
from datetime import datetime
from typing import List, Optional

def create_transaction(db: Session, tx_data: TxIn) -> TxOut:
    """
    Create a new transaction with validation.
    """
    # Business rule validation
    if tx_data.amount <= 0:
        raise ValueError("Amount must be greater than 0")
    if tx_data.kind not in ["income", "expense"]:
        raise ValueError("Kind must be 'income' or 'expense'")

    # Create transaction
    db_tx = Transaction(
        kind=tx_data.kind,
        amount=tx_data.amount,
        category=tx_data.category or "general",
        note=tx_data.note or ""
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return TxOut.model_validate(db_tx)

def list_transactions(db: Session, kind: Optional[str] = None) -> List[TxOut]:
    """
    List transactions, optionally filtered by kind.
    """
    query = db.query(Transaction)
    if kind:
        if kind not in ["income", "expense"]:
            raise ValueError("Kind must be 'income' or 'expense'")
        query = query.filter(Transaction.kind == kind)
    transactions = query.order_by(Transaction.created_at.desc()).all()
    return [TxOut.model_validate(tx) for tx in transactions]

def get_monthly_totals(db: Session) -> dict:
    """
    Get totals for current month: income, expense, net.
    """
    current_month = datetime.utcnow().strftime("%Y-%m")
    start_date = datetime.strptime(current_month + "-01", "%Y-%m-%d")

    # Calculate next month for end date
    if start_date.month == 12:
        end_date = start_date.replace(year=start_date.year + 1, month=1, day=1)
    else:
        end_date = start_date.replace(month=start_date.month + 1, day=1)

    # Sum income
    income_sum = db.query(func.sum(Transaction.amount)).filter(
        Transaction.kind == "income",
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).scalar() or 0

    # Sum expense
    expense_sum = db.query(func.sum(Transaction.amount)).filter(
        Transaction.kind == "expense",
        Transaction.created_at >= start_date,
        Transaction.created_at < end_date
    ).scalar() or 0

    return {
        "income": float(income_sum),
        "expense": float(expense_sum),
        "net": float(income_sum - expense_sum)
    }
