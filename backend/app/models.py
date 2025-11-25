from sqlalchemy import Column, Integer, String, Numeric, DateTime
from .db import Base
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    kind = Column(String, index=True)          # "income" | "expense"
    amount = Column(Numeric(12,2), nullable=False)
    category = Column(String, default="general")
    note = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    
class Budget(Base):
    __tablename__ = "budgets"
    id = Column(Integer, primary_key=True)
    category = Column(String, nullable=False)
    month = Column(String, nullable=False)  # YYYY-MM
    cap_amount = Column(Numeric(12,2), nullable=False)
    __table_args__ = (UniqueConstraint("category","month", name="uq_budget_cat_month"),)

class Reminder(Base):
    __tablename__ = "reminders"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    due_date = Column(Date, nullable=False)
    amount = Column(Numeric(12,2), nullable=False)
    payee = Column(String, default="")
    notes = Column(String, default="")