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
