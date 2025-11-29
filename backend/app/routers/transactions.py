from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import schemas
from ..services.transaction_service import create_transaction, list_transactions

router = APIRouter(prefix="/transactions", tags=["transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.TxOut, status_code=201)
def create_tx(tx: schemas.TxIn, db: Session = Depends(get_db)):
    try:
        return create_transaction(db, tx)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[schemas.TxOut])
def list_tx(kind: str | None = None, db: Session = Depends(get_db)):
    try:
        return list_transactions(db, kind)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/totals")
def get_totals(db: Session = Depends(get_db)):
    try:
        from ..services.transaction_service import get_monthly_totals
        return get_monthly_totals(db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
