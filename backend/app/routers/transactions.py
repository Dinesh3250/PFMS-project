from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from app.models import Transaction
from app import schemas


router = APIRouter(prefix="/transactions", tags=["transactions"])

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

@router.get("/health")
def health(): return {"status": "ok"}

@router.post("/", response_model=schemas.TxOut, status_code=201)
def create_tx(tx: schemas.TxIn, db: Session = Depends(get_db)):
    obj = models.Transaction(**tx.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.get("/", response_model=list[schemas.TxOut])
def list_tx(kind: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.Transaction)
    if kind: q = q.filter(models.Transaction.kind == kind)
    return q.order_by(models.Transaction.created_at.desc()).all()
