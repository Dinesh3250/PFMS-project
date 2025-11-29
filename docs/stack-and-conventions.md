# PFMS Tech Stack & Conventions (Week 1 Lock)

## Stack

* Backend: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.x, Uvicorn, SQLite dev.
* Frontend: React 18, Vite, TypeScript strict, ESLint/Prettier.
* Tests: Pytest; Vitest (or at least FE smoke build).
* Tooling: pre-commit (black/ruff/prettier), GitHub Actions CI (already scaffolded).

## Naming

* Endpoints: `/transactions`, `/budgets`, `/reminders`.
* Query params: `snake_case`.
* JSON fields: `snake_case`.
* FE components: `PascalCase`. Variables: `camelCase`.
* Python: PEP8, functions/vars `snake_case`, classes `PascalCase`.

## Error model

```json
{ "error": "VALIDATION_ERROR", "detail": "amount must be > 0" }
