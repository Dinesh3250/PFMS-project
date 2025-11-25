from fastapi import FastAPI
from .db import Base, engine
from .routers import transactions

Base.metadata.create_all(bind=engine)
app = FastAPI(title="PFMS API")
app.include_router(transactions.router)

@app.get("/")
def root(): return {"service": "pfms", "status": "running"}
