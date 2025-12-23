from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_

from app.db.session import get_db
from app.models.project import Project
from app.models.investor import Investor
from app.schemas.project import ProjectCreate, ProjectOut
from app.services.matching import build_matches

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectOut])
def list_projects(
    db: Session = Depends(get_db),
    kind: str | None = Query(default=None, description="project | startup"),
    country_id: int | None = Query(default=None),
    q: str | None = Query(default=None, description="Search title/summary"),
):
    query = db.query(Project)

    if kind:
        query = query.filter(Project.kind == kind)

    if country_id is not None:
        query = query.filter(Project.country_id == country_id)

    if q:
        like = f"%{q}%"
        query = query.filter(or_(Project.title.ilike(like), Project.summary.ilike(like)))

    return query.order_by(Project.created_at.desc()).all()


@router.post("", response_model=ProjectOut, status_code=201)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db)):
    obj = Project(
        kind=payload.kind,
        country_id=payload.country_id,
        title=payload.title,
        summary=payload.summary,
        sector=payload.sector,
        stage=payload.stage,
        website=str(payload.website) if getattr(payload, "website", None) else None,
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.get("/{project_id}/matches")
def get_project_matches(
    project_id: int,
    strict_country: bool = Query(
        default=False,
        description="If true, only investors with matching country are returned",
    ),
    limit: int = Query(
        default=50,
        ge=1,
        le=50,
        description="Max number of matches returned",
    ),
    db: Session = Depends(get_db),
):
    project = db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    investors = db.query(Investor).options(selectinload(Investor.countries)).all()
    matches = build_matches(project, investors, strict_country=strict_country, limit=limit)

    return [
        {
            "score": m["score"],                 # legacy
            "score_100": m["score_100"],         # new
            "why": m["why"],                     # new
            "score_breakdown": m["score_breakdown"],  # new
            "reason_points": m["reason_points"],       # new
            "reasons": m["reasons"],             # legacy (keep)
            "investor": {
                "id": m["investor"].id,
                "name": m["investor"].name,
                "investor_type": m["investor"].investor_type,
                "focus_sectors": m["investor"].focus_sectors,
                "stages": m["investor"].stages,
                "ticket_min": m["investor"].ticket_min,
                "ticket_max": m["investor"].ticket_max,
                "website": m["investor"].website,
                "contact_email": m["investor"].contact_email,
                "countries": [
                    {"id": c.id, "name": c.name, "iso2": c.iso2}
                    for c in (m["investor"].countries or [])
                ],
            },
        }
        for m in matches
    ]
