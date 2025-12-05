# PFMS - Personal Finance Management System

## Overview

PFMS (Personal Finance Management System) is an MVP application designed to help users manage their personal finances. It provides tools for tracking transactions, setting budgets, and managing reminders for upcoming bills. The project is structured as a full-stack application with a Python-based backend using FastAPI and a React-based frontend with TypeScript.

This MVP focuses on core features for weeks 1-6 of development, with a frozen scope to ensure timely delivery. For more details on the project scope, see [docs/scope.md](docs/scope.md).

## Features

### MVP Features
- **Transactions**: Create and list income/expense entries with filters and running totals for the current month.
- **Budgets**: Set monthly caps per category and view utilization (spent vs. cap) for the current month.
- **Reminders**: Track upcoming bills with due dates, amounts, and optional notes (listing only; no notifications in MVP).

### Non-Goals (Out of Scope)
- Authentication and multi-user accounts.
- Recurring rules or automatic notifications.
- CSV import/export.
- Advanced charts beyond basic totals.
- Category taxonomy management (free-text only).

## Tech Stack

- **Backend**: Python 3.11, FastAPI, Pydantic v2, SQLAlchemy 2.x, Uvicorn, SQLite (dev database).
- **Frontend**: React 18, Vite, TypeScript (strict mode), ESLint/Prettier.
- **Tests**: Pytest for backend; Vitest or smoke build for frontend.
- **Tooling**: pre-commit (black/ruff/prettier), GitHub Actions CI.

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js and npm (for frontend)
- Git

### Backend Setup
1. Navigate to the `backend` directory:
   ```
   cd PFMS-project/backend
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run database migrations (if needed):
   ```
   alembic upgrade head
   ```
4. Start the server:
   ```
   uvicorn app.main:app --reload
   ```
   The API will be available at `http://localhost:8000`.

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```
   cd PFMS-project/frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

### Running Tests
- Backend: `pytest` in the `backend` directory.
- Frontend: `npm run test` in the `frontend` directory (if Vitest is configured).

## API Documentation

Detailed API contracts are available in [docs/api-contracts.md](docs/api-contracts.md). Key endpoints include:
- `/transactions`: POST to create, GET to list transactions.
- `/budgets`: POST to create, GET to list budgets with utilization.
- `/reminders`: POST to create, GET to list reminders.

All responses use JSON with `snake_case` fields. Errors follow the format: `{ "error": "VALIDATION_ERROR", "detail": "..." }`.

## Important Notes

### Conventions
- **Naming**: Endpoints and query params use `snake_case`. JSON fields: `snake_case`. Frontend components: `PascalCase`, variables: `camelCase`. Python: PEP8 compliant.
- **Error Model**: Consistent error responses as shown above.
- **Dates**: Use `YYYY-MM-DD` for dates, `YYYY-MM` for months.
- **Validation**: Strict validation on backend; frontend handles user input and displays messages.

### Things to Look Out For
- **MVP Scope Freeze**: Any changes to features require updating [docs/scope.md](docs/scope.md) and [docs/api-contracts.md](docs/api-contracts.md) via PR.
- **Database**: Uses SQLite for development; ensure migrations are run before starting.
- **Frontend Responsiveness**: Designed for small laptop screens; test on various devices.
- **CI/CD**: Ensure lints, tests, and builds pass in GitHub Actions.
- **Pagination**: Basic support where implemented; defaults may be ignored for MVP.
- **Unique Constraints**: Budgets are unique per (category, month); transactions are not enforced uniquely.
- **Edge Cases**: Handle zero cap amounts in budgets (avoid division by zero in UI). Reminders only for future dates.

### Project Structure
- `backend/`: Python FastAPI application with routers, services, models, and tests.
- `frontend/`: React TypeScript app with components and API integration.
- `docs/`: All documentation, including ERD ([docs/erd.md](docs/erd.md)), wireframes, and testing plan.
- `.pre-commit-config.yaml`: Pre-commit hooks for code quality.

## Contributing

- Follow the conventions in [docs/stack-and-conventions.md](docs/stack-and-conventions.md).
- Ensure Definition of Done: Endpoint implemented, tested, documented, and CI green.
- See [docs/testing-plan.md](docs/testing-plan.md) for testing guidelines.
- Use GitHub Actions for CI; check CODEOWNERS for reviews.

For more details, refer to the `docs/` directory.
