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


@router.get("")
def list_news(
    country_id: str | int | None = None,
    q: str | None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Fetch news from database with pagination.
    
    country_id can be:
    - None/empty: All countries (including global)
    - "cececo": Only CECECO countries (exclude global)
    - int: Specific country ID
    
    Returns:
    {
        "items": [...],
        "total": int,
        "limit": int,
        "offset": int,
        "has_more": bool
    }
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
    
    # Get total count before pagination
    total = query.count()
    
    # Execute query with pagination and enrich with country info
    items = query.order_by(NewsItem.published_at.desc()).offset(offset).limit(limit).all()
    
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
    
    return {
        "items": result,
        "total": total,
        "limit": limit,
        "offset": offset,
        "has_more": offset + limit < total,
    }


@router.post("/ingest/gdelt", dependencies=[Depends(require_admin)])
async def ingest_gdelt_news(
    max_records: int = 5000,
    per_country: int = 500,
    global_limit: int = 2000,
    timespan: str = "7d",
    auto_approve: bool = False,
    db: Session = Depends(get_db),
):
    """
    Ingest news from GDELT API and store in database.
    No limit on how much can be preloaded - all fetched articles are stored.
    Returns count of inserted and skipped articles.
    
    Args:
        max_records: Legacy parameter (now uses per_country * num_countries + global_limit)
        per_country: Number of articles to fetch per country (default: 500)
        global_limit: Number of global articles to fetch (default: 2000)
        timespan: Time range for news (default: "7d")
        auto_approve: If True, news items are created with status="approved" (default: False)
    """
    all_countries = db.query(Country).all()
    iso2_to_country = {c.iso2.upper(): c for c in all_countries}
    
    # Fetch from all CECECO countries in parallel
    import asyncio
    
    # Track which country each fetch is for
    country_tasks = [
        (country, fetch_gdelt_news(
            country_iso2=country.iso2,
            search_query=None,
            max_records=per_country,
            timespan=timespan,
        ))
        for country in all_countries
    ]
    
    # Also fetch global articles (no country filter)
    global_task = (None, fetch_gdelt_news(
        country_iso2=None,
        search_query=None,
        max_records=global_limit,
        timespan=timespan,
    ))
    
    # Execute all tasks
    all_tasks = [task for _, task in country_tasks] + [global_task[1]]
    results = await asyncio.gather(*all_tasks, return_exceptions=True)
    
    # Combine articles with their country context
    gdelt_articles_with_context = []
    seen_urls = set()
    
    # Process country-specific results
    for i, (country, _) in enumerate(country_tasks):
        result = results[i]
        if isinstance(result, Exception):
            continue
        for article in result:
            url = article.get("url") or article.get("url_mobile")
            if url and url not in seen_urls:
                seen_urls.add(url)
                # Tag article with the country we fetched for
                gdelt_articles_with_context.append((article, country))
    
    # Process global results
    global_result = results[len(country_tasks)]
    if not isinstance(global_result, Exception):
        for article in global_result:
            url = article.get("url") or article.get("url_mobile")
            if url and url not in seen_urls:
                seen_urls.add(url)
                gdelt_articles_with_context.append((article, None))
    
    # Map and insert articles
    inserted = 0
    skipped = 0
    
    for article, fetch_country in gdelt_articles_with_context:
        try:
            # Match country - if we fetched with a country filter, prioritize that country
            if fetch_country:
                # When we fetch with sourcecountry filter, articles should be from that country
                # Try matching first to see if GDELT confirms it
                matched_id, matched_name, matched_iso2 = match_country_from_gdelt(
                    article, all_countries
                )
                # If match confirms the fetch country, use it; otherwise use fetch country as fallback
                if matched_id == fetch_country.id:
                    country_id, country_name, country_iso2 = matched_id, matched_name, matched_iso2
                else:
                    # Use the country we filtered for (most reliable)
                    country_id = fetch_country.id
                    country_name = fetch_country.name
                    country_iso2 = fetch_country.iso2
            else:
                # For global articles, try to match from content
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
        "total_fetched": len(gdelt_articles_with_context),
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
