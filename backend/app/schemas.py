from pydantic import BaseModel, Field, condecimal
from datetime import datetime
class TxIn(BaseModel):
    kind: str = Field(pattern="^(income|expense)$")
    amount: condecimal(gt=0)
    category: str = "general"
    note: str = ""
class TxOut(TxIn):
    id: int
    created_at: datetime
    class Config: from_attributes = True

class BudgetIn(BaseModel):
    category: str
    month: str = Field(pattern=r"^\d{4}-\d{2}$")
    cap_amount: Decimal = Field(ge=0)

class BudgetOut(BudgetIn):
    id: int
    class Config: from_attributes = True

class ReminderIn(BaseModel):
    name: str
    due_date: date
    amount: Decimal = Field(ge=0)
    payee: str = ""
    notes: str = ""

class ReminderOut(ReminderIn):
    id: int
    class Config: from_attributes = True
