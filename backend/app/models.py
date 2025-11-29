from sqlalchemy import Column, Integer, String, Numeric, DateTime, Date, CheckConstraint, UniqueConstraint
from .db import Base
from datetime import datetime, date

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String, index=True)          # "income" | "expense"
    amount = Column(Numeric(12,2), nullable=False)
    category = Column(String, default="general")
    note = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    __table_args__ = (
        CheckConstraint("kind IN ('income', 'expense')", name="ck_transaction_kind"),
        CheckConstraint("amount > 0", name="ck_transaction_amount_positive"),
    )

class Budget(Base):
    __tablename__ = "budgets"
    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False)
    month = Column(String, nullable=False)  # YYYY-MM
    cap_amount = Column(Numeric(12,2), nullable=False)
    __table_args__ = (
        UniqueConstraint("category","month", name="uq_budget_cat_month"),
        CheckConstraint("cap_amount >= 0", name="ck_budget_cap_amount_non_negative"),
    )

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    due_date = Column(Date, nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    payee = Column(String, default="")
    notes = Column(String, default="")
    __table_args__ = (
        CheckConstraint("amount >= 0", name="ck_reminder_amount_non_negative"),
        CheckConstraint("due_date > date('now', '-1 day')", name="ck_reminder_due_date_future"),  # SQLite specific, adjust for other DBs
    )
