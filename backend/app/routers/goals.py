from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..db import SessionLocal
from .. import models, schemas
from .auth import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.GoalOut, status_code=201)
def create_goal(goal: schemas.GoalIn, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    obj = models.Goal(user_id=current_user.id, **goal.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)

    # Calculate progress percentage
    progress_percentage = (float(obj.current_amount) / float(obj.target_amount)) * 100 if obj.target_amount > 0 else 0

    return {
        **obj.__dict__,
        "progress_percentage": progress_percentage
    }

@router.get("/", response_model=list[schemas.GoalOut])
def list_goals(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    goals = db.query(models.Goal).filter(models.Goal.user_id == current_user.id).order_by(models.Goal.created_at.desc()).all()
    result = []

    for goal in goals:
        progress_percentage = (float(goal.current_amount) / float(goal.target_amount)) * 100 if goal.target_amount > 0 else 0
        result.append({
            **goal.__dict__,
            "progress_percentage": progress_percentage
        })

    return result

@router.put("/{goal_id}/contribute", response_model=schemas.GoalOut)
def contribute_to_goal(goal_id: int, amount: float, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if amount <= 0:
        raise HTTPException(status_code=400, detail="Contribution amount must be positive")

    goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    goal.current_amount = float(goal.current_amount) + amount

    # Check if goal is completed
    if goal.current_amount >= goal.target_amount:
        goal.is_completed = "true"

    db.commit()
    db.refresh(goal)

    progress_percentage = (float(goal.current_amount) / float(goal.target_amount)) * 100 if goal.target_amount > 0 else 0

    return {
        **goal.__dict__,
        "progress_percentage": progress_percentage
    }

@router.delete("/{goal_id}")
def delete_goal(goal_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")

    db.delete(goal)
    db.commit()
    return {"message": "Goal deleted successfully"}
