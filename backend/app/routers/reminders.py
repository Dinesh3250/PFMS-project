from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/reminders", tags=["reminders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ReminderOut, status_code=201)
def create_reminder(reminder: schemas.ReminderIn, db: Session = Depends(get_db)):
    obj = models.Reminder(**reminder.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/", response_model=list[schemas.ReminderOut])
def list_reminders(from_date: str | None = None, to: str | None = None, db: Session = Depends(get_db)):
    q = db.query(models.Reminder)
    if from_date:
        q = q.filter(models.Reminder.due_date >= from_date)
    if to:
        q = q.filter(models.Reminder.due_date <= to)
    return q.order_by(models.Reminder.due_date).all()
