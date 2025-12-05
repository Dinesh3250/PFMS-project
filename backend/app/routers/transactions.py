from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas
from ..routers.auth import get_current_user
from ..services.transaction_service import create_transaction, list_transactions

router = APIRouter(prefix="/transactions", tags=["transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TxOut, status_code=201)
def create_tx(tx: schemas.TxIn, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return create_transaction(db, tx, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[schemas.TxOut])
def list_tx(kind: str | None = None, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        return list_transactions(db, current_user.id, kind)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/totals")
def get_totals(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        from ..services.transaction_service import get_monthly_totals
        return get_monthly_totals(db, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.delete("/{transaction_id}")
def delete_tx(transaction_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        from ..services.transaction_service import delete_transaction
        return delete_transaction(db, transaction_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
