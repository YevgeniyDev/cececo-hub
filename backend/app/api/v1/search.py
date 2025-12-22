from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.news_item import NewsItem
from app.models.country_policy import CountryPolicy
from app.models.country_framework import CountryFramework
from app.models.resource import Resource

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def search(q: str, country_id: int | None = None, db: Session = Depends(get_db)):
    like = f"%{q}%"

    news_q = db.query(NewsItem).filter(NewsItem.status == "approved")
    res_q = db.query(Resource).filter(Resource.status == "approved")
    pol_q = db.query(CountryPolicy)
    fw_q = db.query(CountryFramework)

    if country_id is not None:
        news_q = news_q.filter(NewsItem.country_id == country_id)
        res_q = res_q.filter(Resource.country_id == country_id)
        pol_q = pol_q.filter(CountryPolicy.country_id == country_id)
        fw_q = fw_q.filter(CountryFramework.country_id == country_id)

    news = (
        news_q.filter((NewsItem.title.ilike(like)) | (NewsItem.summary.ilike(like)))
        .order_by(NewsItem.published_at.desc())
        .limit(20)
        .all()
    )

    resources = (
        res_q.filter((Resource.title.ilike(like)) | (Resource.abstract.ilike(like)))
        .order_by(Resource.submitted_at.desc())
        .limit(20)
        .all()
    )

    policies = (
        pol_q.filter((CountryPolicy.title.ilike(like)) | (CountryPolicy.summary.ilike(like)))
        .limit(20)
        .all()
    )

    frameworks = (
        fw_q.filter((CountryFramework.name.ilike(like)) | (CountryFramework.description.ilike(like)))
        .limit(20)
        .all()
    )

    # Minimal, clear response (no extra schema layer needed for MVP)
    return {
        "news": [
            {
                "id": n.id,
                "country_id": n.country_id,
                "title": n.title,
                "summary": n.summary,
                "impact_type": n.impact_type,
                "impact_score": n.impact_score,
                "published_at": n.published_at,
                "source_url": n.source_url,
            }
            for n in news
        ],
        "resources": [
            {
                "id": r.id,
                "country_id": r.country_id,
                "title": r.title,
                "abstract": r.abstract,
                "url": r.url,
                "resource_type": r.resource_type,
                "published_at": r.published_at,
            }
            for r in resources
        ],
        "policies": [{"id": p.id, "country_id": p.country_id, "title": p.title} for p in policies],
        "frameworks": [{"id": f.id, "country_id": f.country_id, "name": f.name} for f in frameworks],
    }
