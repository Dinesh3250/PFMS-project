from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas
from .auth import get_current_user

router = APIRouter(prefix="/reminders", tags=["reminders"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ReminderOut, status_code=201)
def create_reminder(reminder: schemas.ReminderIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    obj = models.Reminder(user_id=current_user.id, **reminder.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.get("/", response_model=list[schemas.ReminderOut])
def list_reminders(from_date: str | None = None, to: str | None = None, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    q = db.query(models.Reminder).filter(models.Reminder.user_id == current_user.id)
    if from_date:
        q = q.filter(models.Reminder.due_date >= from_date)
    if to:
        q = q.filter(models.Reminder.due_date <= to)
    return q.order_by(models.Reminder.due_date).all()

@router.delete("/{reminder_id}")
def delete_reminder(reminder_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id, models.Reminder.user_id == current_user.id).first()
    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()
    return {"message": "Reminder deleted successfully"}
