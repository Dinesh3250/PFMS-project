from fastapi import FastAPI
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware
from .db import Base, engine
from .routers import transactions_router, budgets_router, reminders_router

Base.metadata.create_all(bind=engine)
app = FastAPI(title="PFMS API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions_router)
app.include_router(budgets_router)
app.include_router(reminders_router)

@app.get("/")
def root(): return {"service": "pfms", "status": "running"}

@app.get("/favicon.ico")
def favicon():
    return Response(status_code=204)
