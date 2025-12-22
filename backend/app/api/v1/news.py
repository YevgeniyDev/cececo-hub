from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.admin import require_admin
from app.db.session import get_db
from app.models.news_item import NewsItem
from app.schemas.news_item import NewsItemCreate, NewsItemOut
from app.services.news_scoring import compute_impact_score

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[NewsItemOut])
def list_news(
    country_id: int | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(NewsItem).filter(NewsItem.status == "approved")

    if country_id is not None:
        query = query.filter(NewsItem.country_id == country_id)

    if q:
        like = f"%{q}%"
        query = query.filter((NewsItem.title.ilike(like)) | (NewsItem.summary.ilike(like)))

    return query.order_by(NewsItem.published_at.desc()).limit(50).all()


@router.get("/pending", response_model=list[NewsItemOut], dependencies=[Depends(require_admin)])
def list_pending_news(db: Session = Depends(get_db)):
    return (
        db.query(NewsItem)
        .filter(NewsItem.status == "pending")
        .order_by(NewsItem.published_at.desc())
        .limit(50)
        .all()
    )


@router.post("", response_model=NewsItemOut, dependencies=[Depends(require_admin)])
def create_news(payload: NewsItemCreate, db: Session = Depends(get_db)):
    status = payload.status or "approved"
    if status not in ["approved", "pending"]:
        status = "approved"

    score = compute_impact_score(
        payload.impact_type,
        payload.tags or "",
        payload.title,
        payload.summary,
    )

    item = NewsItem(
        country_id=payload.country_id,
        status=status,  # ✅ now dynamic
        impact_type=payload.impact_type,
        impact_score=score,
        title=payload.title,
        summary=payload.summary,
        tags=payload.tags,
        source_name=payload.source_name,
        source_url=payload.source_url,
        published_at=payload.published_at,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.post("/{news_id}/approve", response_model=NewsItemOut, dependencies=[Depends(require_admin)])
def approve_news(news_id: int, db: Session = Depends(get_db)):
    item = db.query(NewsItem).filter(NewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News not found")
    item.status = "approved"
    db.commit()
    db.refresh(item)
    return item


@router.post("/{news_id}/reject", response_model=NewsItemOut, dependencies=[Depends(require_admin)])
def reject_news(news_id: int, db: Session = Depends(get_db)):
    item = db.query(NewsItem).filter(NewsItem.id == news_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="News not found")
    item.status = "rejected"
    db.commit()
    db.refresh(item)
    return item
