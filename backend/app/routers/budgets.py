from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import Budget, User
from .. import schemas
from ..services import budget_service
from .auth import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.post("/", response_model=schemas.BudgetOut, status_code=201)
def create_budget(budget: schemas.BudgetIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return budget_service.create_budget(db, budget, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[schemas.BudgetOut])
def list_budgets(month: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return budget_service.get_budgets(db, current_user.id, month)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{budget_id}")
def delete_budget(budget_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        return budget_service.delete_budget(db, budget_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
