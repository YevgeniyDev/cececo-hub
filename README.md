---

# CECECO Energy & Climate Transition Hub

A data-driven intelligence platform mapping clean energy projects, startups, investors, and policy frameworks across emerging and transition economies - starting with the CECECO region.

---

## Overview

The **CECECO Energy & Climate Transition Hub** is an open, modular platform designed to make clean energy and climate transition markets **visible, navigable, and investable**.

It connects:

* real projects and startups,
* investors (funds, angels, public programs, NGOs),
* national policies, frameworks, and targets,
* institutions and regulators,
* and normalized readiness indicators,

into **country-level intelligence pages** and ecosystem listings that support **decision-making, investment matching, and policy analysis**.

The platform focuses on **emerging and transition economies** where data fragmentation and weak market visibility slow down climate action.

---

## Key Goals

* Reduce information and transaction costs in clean energy markets
* Improve visibility of projects and startups in underrepresented countries
* Help investors identify aligned opportunities faster
* Translate policies and frameworks into practical market signals
* Support evidence-based policy and ecosystem development

---

## Core Features

### 🌍 Country Intelligence Pages

Each country page provides:

* A concise market briefing
* Normalized readiness indicators (0–100 scale)
* Active projects and startups
* Policy and regulatory mechanisms (“market mechanics”)
* Key institutions and official targets
* Practical guidance on priority opportunities

Pages are **data-derived**, ensuring every country view is unique and comparable.

---

### ⚡ Projects & Startups Directory

* Structured listings by country, sector, and stage
* Covers utility-scale projects, pilots, and distributed solutions
* Includes early-stage startups and ecosystem actors
* Designed to grow via CSV ingestion or API-based pipelines

---

### 💰 Investor Intelligence

* Supports multiple investor types:

  * Funds
  * Angel networks
  * Public / DFI programs
  * NGOs and impact initiatives
* Investor profiles include:

  * Focus sectors
  * Investment stages
  * Ticket sizes
  * Geographic coverage

---

### 🔗 Investor–Project Matching

A transparent matching layer that:

* Scores alignment between investors and projects
* Explains *why* a match exists
* Uses sector, stage, geography, and policy context
* Designed for explainability (not a black-box recommender)

---

### 🏛️ Policy & Framework Mapping

Policies and frameworks are grouped into **market mechanics**, such as:

* Procurement & auctions
* Power Purchase Agreements (PPAs)
* Distributed energy rules
* Grid access and integration
* Incentives and enabling programs
* Efficiency standards

Each entry can include:

* Description
* Status
* Why it matters
* Source URL for credibility

---

### 📊 Readiness Indicators

Each country includes curated, transparent indicators such as:

* Policy readiness
* Investment attractiveness
* Renewable potential
* Efficiency opportunity
* Grid readiness

Indicators are normalized (0–1 internally, displayed as 0–100) and clearly documented.

---

## Supported Countries (Initial Phase)

* Türkiye (TR)
* Azerbaijan (AZ)
* Kazakhstan (KZ)
* Uzbekistan (UZ)
* Kyrgyzstan (KG)
* Pakistan (PK)

The platform is designed to scale easily to additional countries.

---

## Tech Stack

### Frontend

* **Next.js (App Router)**
* Tailwind CSS
* Fully responsive (desktop & mobile)
* Data-driven UI components

### Backend

* **FastAPI**
* SQLAlchemy ORM
* PostgreSQL (or compatible relational DB)
* REST API for all entities

### Data Layer

* Curated seed data (projects, startups, investors, policies)
* CSV-based ingestion supported
* External feeds (e.g. news, research) supported
* Idempotent seeding (safe re-runs)

---

## Repository Structure (High Level)

```
cececo-hub/
├── frontend/           # Next.js frontend
│   ├── app/
│   ├── components/
│   └── styles/
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── models/
│   │   ├── api/
│   │   ├── services/
│   │   └── db/
│   └── seed.py         # Data seeding logic
├── data/
│   ├── startups_seed.csv
│   ├── projects_seed.csv
│   └── investors_seed.csv
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites

* Node.js 18+
* Python 3.10+
* PostgreSQL (or SQLite for local testing)

---

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Set environment variables:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/cececo
```

Run migrations and seed data:

```bash
python seed.py
```

Start the API:

```bash
uvicorn app.main:app --reload
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Set environment variables:

```bash
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

---

## Deployment (Vercel + API)

### Frontend (Vercel)

* Import repository into Vercel
* Framework preset: **Other**
* Build command:

```bash
npm run build
```

* Environment variables:

```bash
NEXT_PUBLIC_API_BASE=https://your-api-domain
```

### Backend

* Deploy via Docker, Fly.io, Render, or similar
* Ensure CORS allows frontend domain
* Database must be persistent

---

## Data Philosophy

* **Transparency over opacity**
* All indicators explain methodology
* Sources are encouraged for all policies and frameworks
* Seed data is curated but replaceable
* Designed to evolve from MVP → institutional-grade platform

---

## Roadmap (High Level)

* Automated data ingestion pipelines
* Advanced investor–project matching
* User accounts and submissions
* Policy impact analytics
* Regional and cross-country comparisons
* Exportable reports and dashboards

---

## Intended Users

* Clean energy startups and developers
* Private investors and funds
* Development finance institutions
* Policymakers and regulators
* Researchers and analysts
* Climate and energy programs

---

## License

**TBD**
(Open-source or mixed license recommended depending on deployment model.)

---
