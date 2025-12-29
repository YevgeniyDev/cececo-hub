from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.country import Country
from app.models.country_indicator import CountryIndicator
from app.schemas.country import CountryOut, CountryDetailOut, CountryRankOut

router = APIRouter(prefix="/countries", tags=["countries"])


@router.get("", response_model=list[CountryOut])
def list_countries(db: Session = Depends(get_db)):
    return db.query(Country).order_by(Country.id.asc()).all()


@router.get("/ranking", response_model=list[CountryRankOut])
def country_ranking(db: Session = Depends(get_db)):
    """
    Explainable MVP ranking based on normalized indicators (0..1).
    Score is normalized to 0..100.

    IMPORTANT: this is curated MVP scoring; be transparent in UI.
    """
    # Weights must sum to 1.0
    weights: dict[str, float] = {
        "policy_readiness": 0.30,
        "investment_attractiveness": 0.25,
        "renewable_proxy": 0.25,
        "efficiency_need": 0.10,
        "grid_proxy": 0.10,
    }

    countries = db.query(Country).order_by(Country.id.asc()).all()
    if not countries:
        return []

    # Load indicators in one query
    rows = db.query(CountryIndicator).all()
    by_country: dict[int, dict[str, CountryIndicator]] = {}
    for r in rows:
        by_country.setdefault(r.country_id, {})[r.key] = r

    out: list[CountryRankOut] = []
    for c in countries:
        ind_map = by_country.get(c.id, {})

        breakdown = []
        weighted_sum = 0.0
        weight_used = 0.0

        for key, w in weights.items():
            ind = ind_map.get(key)
            v = float(ind.value) if ind else None  # normalized 0..1
            if v is not None:
                weighted_sum += v * w
                weight_used += w

            breakdown.append(
                {
                    "key": key,
                    "value": v,
                    "weight": w,
                }
            )

        # Normalize if some indicators missing
        score01 = (weighted_sum / weight_used) if weight_used > 0 else 0.0
        score = int(round(score01 * 100))

        out.append(
            CountryRankOut(
                country_id=c.id,
                name=c.name,
                iso2=c.iso2,
                region=c.region,
                score=score,
                breakdown=breakdown,
            )
        )

    out.sort(key=lambda x: x.score, reverse=True)
    return out


@router.get("/{country_id}", response_model=CountryDetailOut)
def get_country(country_id: int, db: Session = Depends(get_db)):
    country = (
        db.query(Country)
        .options(
            selectinload(Country.indicators),
            selectinload(Country.policies),
            selectinload(Country.frameworks),
            selectinload(Country.institutions),
            selectinload(Country.targets),
        )
        .filter(Country.id == country_id)
        .first()
    )
    if not country:
        raise HTTPException(status_code=404, detail="Country not found")
    return country
