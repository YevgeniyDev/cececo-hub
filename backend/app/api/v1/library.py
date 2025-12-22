from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.admin import require_admin
from app.db.session import get_db
from app.models.resource import Resource
from app.schemas.resource import ResourceCreate, ResourceOut

router = APIRouter(prefix="/library", tags=["library"])


@router.get("", response_model=list[ResourceOut])
def list_resources(
    country_id: int | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Resource).filter(Resource.status == "approved")

    if country_id is not None:
        query = query.filter(Resource.country_id == country_id)

    if q:
        like = f"%{q}%"
        query = query.filter((Resource.title.ilike(like)) | (Resource.abstract.ilike(like)))

    return query.order_by(Resource.submitted_at.desc()).limit(50).all()


@router.post("/submit", response_model=ResourceOut)
def submit_resource(payload: ResourceCreate, db: Session = Depends(get_db)):
    item = Resource(
        country_id=payload.country_id,
        status="pending",
        resource_type=payload.resource_type,
        title=payload.title,
        abstract=payload.abstract,
        url=payload.url,
        tags=payload.tags,
        published_at=payload.published_at,
        submitted_by_name=payload.submitted_by_name,
        submitted_by_email=payload.submitted_by_email,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/pending", response_model=list[ResourceOut], dependencies=[Depends(require_admin)])
def list_pending(db: Session = Depends(get_db)):
    return db.query(Resource).filter(Resource.status == "pending").order_by(Resource.submitted_at.desc()).limit(50).all()


@router.post("/{resource_id}/approve", response_model=ResourceOut, dependencies=[Depends(require_admin)])
def approve_resource(resource_id: int, db: Session = Depends(get_db)):
    item = db.query(Resource).filter(Resource.id == resource_id).first()
    if not item:
        return None
    item.status = "approved"
    db.commit()
    db.refresh(item)
    return item


@router.post("/{resource_id}/reject", response_model=ResourceOut, dependencies=[Depends(require_admin)])
def reject_resource(resource_id: int, db: Session = Depends(get_db)):
    item = db.query(Resource).filter(Resource.id == resource_id).first()
    if not item:
        return None
    item.status = "rejected"
    db.commit()
    db.refresh(item)
    return item
