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
