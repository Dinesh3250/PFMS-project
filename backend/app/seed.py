# ...existing code...
import sys
import pathlib

# Ensure backend folder is on sys.path so absolute imports like "app.db" work
ROOT = pathlib.Path(__file__).resolve().parents[1]  # backend/
sys.path.insert(0, str(ROOT))

from app.db import Base, engine, SessionLocal
from app.models import Transaction, User
from app.routers.auth import get_password_hash

def seed():
    print("Starting seed process...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Create users
    users_data = [
        ("demo@example.com", "demo123"),
        ("dg@example.com", "dinesh"),
        ("mm@example.com", "maneesh"),
        ("by@example.com", "bhargav"),
        ("hy@example.com", "hema")
    ]

    for email, password in users_data:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"User {email} already exists, skipping.")
            continue
        hashed_pw = get_password_hash(password)
        print(f"Creating user: {email}")
        user = User(
            email=email,
            hashed_password=hashed_pw
        )
        db.add(user)

    print("All users added to session.")

    # Get the demo user for sample transactions
    demo_user = db.query(User).filter(User.email == "demo@example.com").first()
    if demo_user:
        db.add_all([
            Transaction(user_id=demo_user.id, kind="income", amount=5000, category="salary", note="seed"),
            Transaction(user_id=demo_user.id, kind="expense", amount=120, category="groceries", note="seed"),
        ])
    db.commit()
    print("Committed to database.")
    db.close()
    print("Seeded successfully.")

if __name__ == "__main__":
    seed()
# ...existing code...