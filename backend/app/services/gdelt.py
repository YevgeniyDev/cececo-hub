"""
GDELT API service for fetching real-time news articles.
"""
from datetime import datetime, timezone
from typing import Any
import httpx

from app.services.news_scoring import compute_impact_score


GDELT_BASE_URL = "https://api.gdeltproject.org/api/v2/doc/doc"


def infer_impact_type(title: str, summary: str) -> str:
    """Infer impact type from article content."""
    text = f"{title} {summary}".lower()
    
    if any(word in text for word in ["policy", "policies", "strategy", "plan", "target"]):
        return "policy"
    elif any(word in text for word in ["regulation", "regulatory", "rule", "code", "standard"]):
        return "regulation"
    elif any(word in text for word in ["project", "pilot", "initiative", "program"]):
        return "project"
    elif any(word in text for word in ["achievement", "milestone", "success", "completed"]):
        return "achievement"
    else:
        return "policy"  # default


def build_gdelt_query(
    country_iso2: str | None = None,
    search_query: str | None = None,
    clean_energy_keywords: bool = True,
) -> str:
    """
    Build GDELT query string with clean energy focus.
    
    Args:
        country_iso2: ISO2 country code (e.g., "TR", "KZ")
        search_query: Additional search terms from user
        clean_energy_keywords: Whether to include clean energy keywords
    """
    query_parts = []
    
    # Base clean energy keywords - simplify to use fewer, more common terms
    # GDELT works better with simpler queries
    if clean_energy_keywords:
        # Use a simpler OR query with the most common terms
        clean_energy_terms = [
            '"renewable energy"',
            '"solar energy"',
            '"wind energy"',
            '"clean energy"',
            '"climate change"',
            '"energy transition"',
        ]
        or_query = f"({' OR '.join(clean_energy_terms)})"
        query_parts.append(or_query)
    
    # Add user search query if provided
    if search_query and search_query.strip():
        user_query = search_query.strip()
        # If user query contains spaces and isn't already quoted, wrap in quotes
        if " " in user_query and not (user_query.startswith('"') and user_query.endswith('"')):
            user_query = f'"{user_query}"'
        query_parts.append(user_query)
    
    # Add country filter if provided
    if country_iso2:
        # GDELT uses sourcecountry with country name (no spaces) or ISO2
        # We'll use ISO2 which should work
        query_parts.append(f"sourcecountry:{country_iso2.upper()}")
    
    final_query = " ".join(query_parts)
    return final_query


async def fetch_gdelt_news(
    country_iso2: str | None = None,
    search_query: str | None = None,
    max_records: int = 50,
    timespan: str = "7d",  # last 7 days
) -> list[dict[str, Any]]:
    """
    Fetch news articles from GDELT API.
    
    Returns list of article dictionaries with GDELT fields.
    """
    query = build_gdelt_query(country_iso2, search_query)
    
    # Debug: print the query being sent
    print(f"[GDELT] Query: {query}")
    
    params = {
        "query": query,
        "mode": "artlist",
        "format": "json",
        "maxrecords": min(max_records, 250),  # GDELT max is 250
        "timespan": timespan,
        "sort": "datedesc",
    }
    
    # Debug: print the full URL
    full_url = f"{GDELT_BASE_URL}?query={query}&mode=artlist&format=json&maxrecords={params['maxrecords']}&timespan={timespan}&sort=datedesc"
    print(f"[GDELT] Request URL: {full_url[:200]}...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(GDELT_BASE_URL, params=params)
            print(f"[GDELT] Response status: {response.status_code}")
            
            response.raise_for_status()
            
            # Try to parse JSON
            try:
                data = response.json()
                print(f"[GDELT] Response type: {type(data)}")
                if isinstance(data, dict):
                    print(f"[GDELT] Response keys: {list(data.keys())}")
                elif isinstance(data, list):
                    print(f"[GDELT] Response list length: {len(data)}")
            except Exception as json_err:
                print(f"[GDELT] JSON parse error: {json_err}")
                print(f"[GDELT] Response text (first 500 chars): {response.text[:500]}")
                return []
            
            # GDELT JSON format: can be a list directly or have "articles" field
            articles = []
            if isinstance(data, list):
                articles = data
                print(f"[GDELT] Found {len(articles)} articles (direct list)")
            elif isinstance(data, dict):
                articles = data.get("articles", [])
                if not articles and "results" in data:
                    articles = data.get("results", [])
                if not articles and "data" in data:
                    articles = data.get("data", [])
                print(f"[GDELT] Found {len(articles)} articles (from dict)")
            else:
                print(f"[GDELT] Unexpected response format: {type(data)}")
            
            return articles
    except httpx.HTTPStatusError as e:
        # Log error but return empty list to avoid breaking the app
        print(f"[GDELT] HTTP error: {e}")
        if e.response is not None:
            print(f"[GDELT] Response status: {e.response.status_code}")
            print(f"[GDELT] Response text: {e.response.text[:500]}")
        return []
    except httpx.RequestError as e:
        print(f"[GDELT] Request error: {e}")
        return []
    except Exception as e:
        print(f"[GDELT] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return []


def map_gdelt_to_news_item(
    gdelt_article: dict[str, Any],
    country_id: int | None = None,
    country_name: str | None = None,
    country_iso2: str | None = None,
) -> dict[str, Any]:
    """
    Map GDELT article to our NewsItem format.
    
    GDELT article structure (from ArtList mode JSON):
    - url: article URL
    - url_mobile: mobile version URL
    - title: article title
    - seendate: publication date (YYYYMMDDHHMMSS format)
    - socialimage: social sharing image URL
    - domain: source domain
    - language: source language
    - sourcecountry: ISO2 country code
    - tone: sentiment score (-100 to +100)
    """
    title = gdelt_article.get("title", "Untitled") or "Untitled"
    url = (
        gdelt_article.get("url") 
        or gdelt_article.get("url_mobile")
        or (gdelt_article.get("urlextras") or {}).get("url")
    )
    
    # Extract summary - GDELT ArtList doesn't provide full article text
    # Try to get snippet or use title as summary
    summary = gdelt_article.get("snippet") or gdelt_article.get("summary") or title
    if not summary or len(summary.strip()) < 10:
        summary = title
    
    # Parse publication date
    seendate = gdelt_article.get("seendate", "") or gdelt_article.get("date", "")
    published_at = datetime.now(timezone.utc)
    if seendate:
        date_str = str(seendate).strip().upper()
        try:
            # Handle ISO format: 20251226T040000Z or 20251226T040000+00:00
            if "T" in date_str:
                # Split date and time parts
                date_part, time_part = date_str.split("T", 1)
                # Remove timezone indicator (Z, +00:00, etc.)
                if time_part.endswith("Z"):
                    time_part = time_part[:-1]
                elif "+" in time_part:
                    time_part = time_part.split("+")[0]
                elif "-" in time_part and len(time_part) > 6:  # Has timezone offset
                    time_part = time_part.split("-")[0]
                
                # Parse: YYYYMMDD and HHMMSS
                if len(date_part) == 8 and len(time_part) >= 6:
                    year = int(date_part[:4])
                    month = int(date_part[4:6])
                    day = int(date_part[6:8])
                    hour = int(time_part[:2]) if len(time_part) >= 2 else 0
                    minute = int(time_part[2:4]) if len(time_part) >= 4 else 0
                    second = int(time_part[4:6]) if len(time_part) >= 6 else 0
                    published_at = datetime(
                        year, month, day, hour, minute, second, tzinfo=timezone.utc
                    )
            elif len(date_str) >= 8:
                # Fallback: Format: YYYYMMDDHHMMSS (no T separator)
                year = int(date_str[:4])
                month = int(date_str[4:6])
                day = int(date_str[6:8])
                hour = int(date_str[8:10]) if len(date_str) >= 10 else 0
                minute = int(date_str[10:12]) if len(date_str) >= 12 else 0
                second = int(date_str[12:14]) if len(date_str) >= 14 else 0
                published_at = datetime(
                    year, month, day, hour, minute, second, tzinfo=timezone.utc
                )
        except (ValueError, IndexError) as e:
            # If parsing fails, use current time
            print(f"[GDELT] Date parse error for '{date_str}': {e}")
            pass
    
    # Infer impact type
    impact_type = infer_impact_type(title, summary)
    
    # Build tags from domain, language, and other metadata
    domain = gdelt_article.get("domain", "") or gdelt_article.get("source", "")
    language = gdelt_article.get("language", "")
    tags_parts = []
    if domain:
        tags_parts.append(domain.replace(".", "_"))  # Replace dots for cleaner tags
    if language:
        tags_parts.append(language)
    # Add clean energy related tags if found in title/summary
    text_lower = f"{title} {summary}".lower()
    if any(term in text_lower for term in ["solar", "photovoltaic", "pv"]):
        tags_parts.append("solar")
    if any(term in text_lower for term in ["wind", "turbine"]):
        tags_parts.append("wind")
    if any(term in text_lower for term in ["grid", "transmission"]):
        tags_parts.append("grid")
    
    tags = ",".join(tags_parts) if tags_parts else "gdelt,clean energy"
    
    # Compute impact score
    impact_score = compute_impact_score(impact_type, tags, title, summary)
    
    # Extract source name from domain
    source_name = domain or gdelt_article.get("source", "GDELT")
    # Clean up domain name for display
    if source_name and "." in source_name:
        source_name = source_name.split(".")[0].title()
    
    # Extract country from GDELT article if not provided
    article_country_iso2 = gdelt_article.get("sourcecountry", "")
    if not country_iso2 and article_country_iso2:
        country_iso2 = article_country_iso2.upper()
    
    return {
        "country_id": country_id,
        "country_name": country_name,
        "country_iso2": country_iso2,
        "status": "approved",  # GDELT articles are pre-filtered
        "impact_type": impact_type,
        "impact_score": impact_score,
        "title": title[:220],  # Truncate to match DB constraint
        "summary": summary[:5000],  # Reasonable limit
        "tags": tags[:400] if tags else None,  # Match DB constraint
        "source_name": source_name[:120] if source_name else None,
        "source_url": url[:600] if url else None,  # Match DB constraint
        "published_at": published_at,
    }

