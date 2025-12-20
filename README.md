# CECECO Hub MVP

Monorepo: FastAPI + PostgreSQL + Next.js (App Router) + Docker Compose.

## Quick start (Docker)
```bash
git clone <your-repo-url>
cd cececo-hub

# optional: env files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

docker compose up --build
```

Frontend: http://localhost:3000

Backend Swagger: http://localhost:8000/docs

Dev notes

Backend runs Alembic migrations on start (compose command).

Seed runs on backend startup (idempotent).


---

## 4) Initialize git and commit
From the **root** (`cececo-hub`):

```bash
git init
git add .
git commit -m "Initial CECECO Hub MVP (FastAPI + Next.js + Postgres + Docker)"


If you accidentally added huge stuff:

git rm -r --cached frontend/node_modules frontend/.next
git commit -m "Remove build artifacts"
