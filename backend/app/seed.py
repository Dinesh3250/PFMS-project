from app.db import Base, engine, SessionLocal
from app.models import Transaction
Base.metadata.create_all(bind=engine)
db = SessionLocal()
db.add_all([
    Transaction(kind="income", amount=5000, category="salary", note="seed"),
    Transaction(kind="expense", amount=120, category="groceries", note="seed"),
])
db.commit(); db.close()
print("Seeded.")
