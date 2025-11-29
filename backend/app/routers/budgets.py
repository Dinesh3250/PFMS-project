from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Budget
from .. import schemas
from ..services import budget_service

router = APIRouter(prefix="/budgets", tags=["budgets"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.BudgetOut, status_code=201)
def create_budget(budget: schemas.BudgetIn, db: Session = Depends(get_db)):
    # TODO: Use service
    obj = Budget(**budget.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.get("/", response_model=list[schemas.BudgetOut])
def list_budgets(month: str | None = None, db: Session = Depends(get_db)):
    # TODO: Use service, add utilization field
    q = db.query(Budget)
    if month: q = q.filter(Budget.month == month)
    return q.all()
