from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.admin import require_admin
from app.db.session import get_db
from app.models.news_item import NewsItem
from app.models.country import Country
from app.schemas.news_item import NewsItemCreate, NewsItemOut
from app.services.news_scoring import compute_impact_score
from app.services.gdelt import fetch_gdelt_news, map_gdelt_to_news_item

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[NewsItemOut])
async def list_news(
    country_id: str | int | None = None,
    q: str | None = None,
    db: Session = Depends(get_db),
):
    """
    Fetch news from GDELT API instead of database.
    Maps GDELT articles to NewsItem format.
    
    country_id can be:
    - None/empty: All countries (including global)
    - "cececo": Only CECECO countries (exclude global)
    - int: Specific country ID
    """
    try:
        # Get all countries for lookup
        all_countries = db.query(Country).all()
        iso2_to_country = {c.iso2.upper(): c for c in all_countries}
        cececo_iso2_codes = {c.iso2.upper() for c in all_countries}
        
        # Create country name mappings (handle variations and alternative names)
        # GDELT might return different country name formats
        country_name_to_country = {}
        for c in all_countries:
            # Normalize and store multiple variations
            name_upper = c.name.upper()
            country_name_to_country[name_upper] = c
            
            # Add alternative names/variations for all countries
            if c.name == "Türkiye":
                country_name_to_country["TURKEY"] = c
                country_name_to_country["TURKIYE"] = c
            elif c.name == "Azerbaijan":
                country_name_to_country["AZERBAIJAN"] = c
            elif c.name == "Kazakhstan":
                country_name_to_country["KAZAKHSTAN"] = c
                country_name_to_country["KAZAK"] = c
            elif c.name == "Uzbekistan":
                country_name_to_country["UZBEKISTAN"] = c
                country_name_to_country["UZBEK"] = c
            elif c.name == "Kyrgyzstan":
                country_name_to_country["KYRGYZSTAN"] = c
                country_name_to_country["KYRGYZ"] = c
            elif c.name == "Pakistan":
                country_name_to_country["PAKISTAN"] = c
            # Also add ISO2 code as a name variation (in case GDELT uses it as name)
            country_name_to_country[c.iso2.upper()] = c
        
        # Handle special "cececo" filter
        filter_cececo_only = False
        country_iso2 = None
        country = None
        
        if country_id == "cececo":
            # Special filter: CECECO countries only (exclude global)
            # We'll fetch from all CECECO countries
            filter_cececo_only = True
            print(f"[News API] Filtering by CECECO countries only - fetching from {len(all_countries)} countries")
        elif country_id is not None:
            # Try to parse as integer for specific country
            try:
                country_id_int = int(country_id)
                country = db.query(Country).filter(Country.id == country_id_int).first()
                if country:
                    country_iso2 = country.iso2
                    print(f"[News API] Filtering by country: {country.name} ({country_iso2})")
            except (ValueError, TypeError):
                # Invalid country_id, treat as no filter
                pass
        
        print(f"[News API] Fetching GDELT news - country_iso2={country_iso2}, filter_cececo_only={filter_cececo_only}, q={q}")
        
        # Fetch from GDELT
        if filter_cececo_only:
            # For CECECO filter: fetch from all CECECO countries in parallel
            import asyncio
            
            # Create tasks for each country
            # Calculate per-country limit to get ~200 total articles
            # With 6 countries, ~33 per country = ~200 total
            per_country_limit = max(30, 200 // max(len(all_countries), 1))
            tasks = [
                fetch_gdelt_news(
                    country_iso2=country.iso2,
                    search_query=q,
                    max_records=per_country_limit,
                    timespan="7d",
                )
                for country in all_countries
            ]
            
            # Fetch from all countries in parallel
            results = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Combine all results and deduplicate by URL
            gdelt_articles = []
            seen_urls = set()
            for result in results:
                if isinstance(result, Exception):
                    print(f"[News API] Error fetching from one country: {result}")
                    continue
                for article in result:
                    url = article.get("url") or article.get("url_mobile")
                    if url and url not in seen_urls:
                        seen_urls.add(url)
                        gdelt_articles.append(article)
            
            print(f"[News API] Received {len(gdelt_articles)} unique articles from all CECECO countries")
        else:
            # Single country or no filter
            if country_id and country:
                # For single country: try GDELT's country filter first, then fallback to matching
                print(f"[News API] Attempting to fetch with GDELT country filter: {country.iso2}")
                gdelt_articles_with_filter = await fetch_gdelt_news(
                    country_iso2=country.iso2,
                    search_query=q,
                    max_records=200,
                    timespan="7d",
                )
                print(f"[News API] GDELT country filter returned {len(gdelt_articles_with_filter)} articles")
                
                # If we got results with country filter, use those
                # Otherwise, fetch without filter and match manually
                if len(gdelt_articles_with_filter) > 0:
                    gdelt_articles = gdelt_articles_with_filter
                    print(f"[News API] Using {len(gdelt_articles)} articles from GDELT country filter")
                else:
                    # Fallback: fetch without country filter and match manually
                    print(f"[News API] GDELT country filter returned no results, fetching all and matching manually")
                    gdelt_articles = await fetch_gdelt_news(
                        country_iso2=None,
                        search_query=q,
                        max_records=200,
                        timespan="7d",
                    )
                    print(f"[News API] Received {len(gdelt_articles)} articles from GDELT (will filter by country matching)")
            else:
                # No country filter - fetch all
                gdelt_articles = await fetch_gdelt_news(
                    country_iso2=None,
                    search_query=q,
                    max_records=200,
                    timespan="7d",
                )
                print(f"[News API] Received {len(gdelt_articles)} articles from GDELT (no country filter)")
        
        # Map to NewsItem format (as dicts, not DB objects)
        news_items = []
        for article in gdelt_articles:
            try:
                # Extract country from article if available
                # GDELT sourcecountry can be ISO2 code or country name
                article_source_country = article.get("sourcecountry", "").strip()
                article_country_iso2 = article_source_country.upper()
                article_country = None
                article_country_id = None
                article_country_name = None
                matched_country = None
                
                # Debug: log what GDELT returns for sourcecountry (first few articles only)
                if len(news_items) < 5 and article_source_country:
                    print(f"[News API] Article sourcecountry from GDELT: '{article_source_country}' (normalized: '{article_country_iso2}')")
                
                # Try to match by ISO2 code first (exact match)
                if article_country_iso2 and article_country_iso2 in iso2_to_country:
                    matched_country = iso2_to_country[article_country_iso2]
                    if len(news_items) < 5:
                        print(f"[News API] Matched by ISO2: {article_country_iso2} -> {matched_country.name}")
                # Try to match by country name (exact match in our mapping)
                elif article_country_iso2 and article_country_iso2 in country_name_to_country:
                    matched_country = country_name_to_country[article_country_iso2]
                    if len(news_items) < 5:
                        print(f"[News API] Matched by name mapping: {article_country_iso2} -> {matched_country.name}")
                # Try matching without spaces and special chars
                elif article_country_iso2:
                    # Remove spaces, dashes, and other special chars
                    cleaned = article_country_iso2.replace(" ", "").replace("-", "").replace("_", "")
                    if cleaned in country_name_to_country:
                        matched_country = country_name_to_country[cleaned]
                        if len(news_items) < 5:
                            print(f"[News API] Matched by cleaned name: {cleaned} -> {matched_country.name}")
                    # Try fuzzy/partial matching - check if any country name contains the article country or vice versa
                    else:
                        # First try: check if article country is a substring of any country name
                        for country_name_key, country_obj in country_name_to_country.items():
                            # Skip ISO2 codes for fuzzy matching (only match names)
                            if len(country_name_key) <= 2:
                                continue
                            if (article_country_iso2 in country_name_key or 
                                country_name_key in article_country_iso2):
                                matched_country = country_obj
                                if len(news_items) < 5:
                                    print(f"[News API] Matched by fuzzy: '{article_country_iso2}' <-> '{country_name_key}' -> {country_obj.name}")
                                break
                        
                        # If still no match, try matching against actual country names from DB
                        if not matched_country:
                            for c in all_countries:
                                country_name_upper = c.name.upper()
                                # Check if article country matches or contains country name
                                if (article_country_iso2 == country_name_upper or
                                    article_country_iso2 in country_name_upper or
                                    country_name_upper in article_country_iso2):
                                    matched_country = c
                                    if len(news_items) < 5:
                                        print(f"[News API] Matched by DB name fuzzy: '{article_country_iso2}' <-> '{country_name_upper}' -> {c.name}")
                                    break
                
                # If CECECO filter is active, skip global articles
                if filter_cececo_only:
                    if not matched_country:
                        continue  # Skip this article (it's global or not in CECECO)
                
                # If specific country_id filter was provided, only include articles from that country
                if country_id and country and country_id != "cececo":
                    # Only include this article if it matches the filtered country
                    if matched_country and matched_country.id == country.id:
                        article_country_id = country.id
                        article_country_name = country.name
                        article_country_iso2 = country.iso2
                        if len(news_items) < 5:
                            print(f"[News API] ✓ Including article for {country.name}: sourcecountry='{article_source_country}'")
                    else:
                        # Article doesn't match the filtered country - skip it
                        if len(news_items) < 5 and article_source_country:
                            matched_info = matched_country.name if matched_country else "None"
                            print(f"[News API] ✗ Skipping article: sourcecountry '{article_source_country}' (matched: {matched_info}) doesn't match filtered country {country.name}")
                        continue
                # Otherwise, use matched country from article
                elif matched_country:
                    article_country = matched_country
                    article_country_id = article_country.id
                    article_country_name = article_country.name
                    article_country_iso2 = article_country.iso2
                else:
                    # Article doesn't match any country in our database - mark as global
                    # But if CECECO filter is active, we already skipped it above
                    article_country_name = "Global"
                    article_country_iso2 = None
                
                mapped = map_gdelt_to_news_item(
                    article,
                    country_id=article_country_id,
                    country_name=article_country_name,
                    country_iso2=article_country_iso2,
                )
                # Create a NewsItemOut-like dict (we'll convert to proper objects)
                news_items.append({
                    "id": abs(hash(article.get("url", str(article))) % (10**9)),  # Generate pseudo-ID from URL
                    "country_id": mapped["country_id"],
                    "country_name": mapped["country_name"],
                    "country_iso2": mapped["country_iso2"],
                    "status": mapped["status"],
                    "impact_type": mapped["impact_type"],
                    "impact_score": mapped["impact_score"],
                    "title": mapped["title"],
                    "summary": mapped["summary"],
                    "tags": mapped["tags"],
                    "source_name": mapped["source_name"],
                    "source_url": mapped["source_url"],
                    "published_at": mapped["published_at"],
                    "created_at": mapped["published_at"],  # Use published_at as created_at
                })
            except Exception as map_err:
                print(f"[News API] Error mapping article: {map_err}")
                import traceback
                traceback.print_exc()
                continue
        
        print(f"[News API] Successfully mapped {len(news_items)} news items")
        
        # Sort by published_at descending
        news_items.sort(key=lambda x: x["published_at"], reverse=True)
        
        return news_items
    except Exception as e:
        print(f"[News API] Error in list_news: {e}")
        import traceback
        traceback.print_exc()
        # Return empty list on error to avoid breaking frontend
        return []


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
