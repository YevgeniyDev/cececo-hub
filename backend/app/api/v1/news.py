from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.admin import require_admin
from app.db.session import get_db
from app.models.news_item import NewsItem
from app.models.country import Country
from app.schemas.news_item import NewsItemCreate, NewsItemOut
from app.services.news_scoring import compute_impact_score
from app.services.gdelt import fetch_gdelt_news, map_gdelt_to_news_item
from app.services.country_matching import match_country_from_gdelt

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[NewsItemOut])
def list_news(
    country_id: str | int | None = None,
    q: str | None = None,
    limit: int = 200,
    db: Session = Depends(get_db),
):
    """
    Fetch news from database.
    
    country_id can be:
    - None/empty: All countries (including global)
    - "cececo": Only CECECO countries (exclude global)
    - int: Specific country ID
    """
    # Get all countries for name/ISO2 lookup and filtering
    all_countries = db.query(Country).all()
    country_by_id = {c.id: c for c in all_countries}
    
    # Build query - only approved items
    query = db.query(NewsItem).filter(NewsItem.status == "approved")
    
    # Handle country filter
    if country_id == "cececo":
        # CECECO countries only (exclude global/null)
        country_ids = [c.id for c in all_countries]
        query = query.filter(NewsItem.country_id.in_(country_ids))
    elif country_id is not None:
        try:
            country_id_int = int(country_id)
            query = query.filter(NewsItem.country_id == country_id_int)
        except (ValueError, TypeError):
            pass  # Invalid country_id, ignore filter
    
    # Handle search query
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                NewsItem.title.ilike(search_term),
                NewsItem.summary.ilike(search_term),
            )
        )
    
    # Execute query and enrich with country info
    items = query.order_by(NewsItem.published_at.desc()).limit(limit).all()
    
    # Convert to NewsItemOut format with country info
    result = []
    for item in items:
        country = country_by_id.get(item.country_id) if item.country_id else None
        result.append(NewsItemOut(
            id=item.id,
            country_id=item.country_id,
            country_name=country.name if country else "Global",
            country_iso2=country.iso2 if country else None,
            status=item.status,
            impact_type=item.impact_type,
            impact_score=item.impact_score,
            title=item.title,
            summary=item.summary,
            tags=item.tags,
            source_name=item.source_name,
            source_url=item.source_url,
            image_url=item.image_url,
            published_at=item.published_at,
            created_at=item.created_at,
        ))
    
    return result


@router.post("/ingest/gdelt", dependencies=[Depends(require_admin)])
async def ingest_gdelt_news(
    max_records: int = 500,
    timespan: str = "30d",
    auto_approve: bool = False,
    db: Session = Depends(get_db),
):
    """
    Ingest news from GDELT API and store in database.
    Returns count of inserted and skipped articles.
    
    Defaults:
    - max_records: 500 (increased from 200)
    - timespan: 30d (increased from 7d for more articles)
    """
    all_countries = db.query(Country).all()
    
    # Fetch from all CECECO countries in parallel
    import asyncio
    
    # Increase per-country limit for better coverage
    per_country_limit = max(50, max_records // max(len(all_countries), 1))
    tasks = [
        fetch_gdelt_news(
            country_iso2=country.iso2,
            search_query=None,
            max_records=per_country_limit,
            timespan=timespan,
            english_only=False,  # Get more articles by including all languages
        )
        for country in all_countries
    ]
    
    # Also fetch global articles (no country filter) - increased limit
    tasks.append(
        fetch_gdelt_news(
            country_iso2=None,
            search_query=None,
            max_records=max_records // 2,
            timespan=timespan,
            english_only=False,  # Get more articles
        )
    )
    
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Combine and deduplicate by URL
    gdelt_articles = []
    seen_urls = set()
    for result in results:
        if isinstance(result, Exception):
            continue
        for article in result:
            url = article.get("url") or article.get("url_mobile")
            if url and url not in seen_urls:
                seen_urls.add(url)
                gdelt_articles.append(article)
    
    # Map and insert articles
    inserted = 0
    skipped = 0
    
    for article in gdelt_articles:
        try:
            # Match country
            country_id, country_name, country_iso2 = match_country_from_gdelt(
                article, all_countries
            )
            
            # Map to news item format
            mapped = map_gdelt_to_news_item(
                article,
                country_id=country_id,
                country_name=country_name,
                country_iso2=country_iso2,
            )
            
            # Check if article already exists (by source_url)
            if mapped["source_url"]:
                existing = db.query(NewsItem).filter(
                    NewsItem.source_url == mapped["source_url"]
                ).first()
                if existing:
                    skipped += 1
                    continue
            
            # Create new news item
            status = "approved" if auto_approve else "pending"
            item = NewsItem(
                country_id=mapped["country_id"],
                status=status,
                impact_type=mapped["impact_type"],
                impact_score=mapped["impact_score"],
                title=mapped["title"],
                summary=mapped["summary"],
                tags=mapped["tags"],
                source_name=mapped["source_name"],
                source_url=mapped["source_url"],
                image_url=mapped.get("image_url"),
                published_at=mapped["published_at"],
            )
            db.add(item)
            try:
                db.commit()
                inserted += 1
            except IntegrityError:
                # Unique constraint violation (duplicate source_url)
                db.rollback()
                skipped += 1
        except Exception:
            db.rollback()
            skipped += 1
            continue
    
    return {
        "inserted": inserted,
        "skipped": skipped,
        "total_fetched": len(gdelt_articles),
    }


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
        status=status,
        impact_type=payload.impact_type,
        impact_score=score,
        title=payload.title,
        summary=payload.summary,
        tags=payload.tags,
        source_name=payload.source_name,
        source_url=payload.source_url,
        image_url=payload.image_url,
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
