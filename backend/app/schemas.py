from pydantic import BaseModel, Field
from decimal import Decimal
from datetime import datetime, date
from typing import Optional
class TxIn(BaseModel):
    kind: str = Field(pattern="^(income|expense)$")
    amount: Decimal = Field(gt=0)
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
    utilization: float = 0.0
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

class GoalIn(BaseModel):
    name: str
    target_amount: Decimal = Field(gt=0)
    target_date: date | None = None
    category: str = "savings"
    description: str = ""

class GoalOut(GoalIn):
    id: int
    current_amount: Decimal = 0.0
    is_completed: str = "false"
    progress_percentage: float = 0.0
    created_at: datetime
    class Config: from_attributes = True

class UserCreate(BaseModel):
    email: str = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, description="User's password")

class UserOut(BaseModel):
    id: int
    email: str
    is_active: str = "true"
    created_at: datetime
    class Config: from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
