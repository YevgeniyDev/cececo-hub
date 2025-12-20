from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.db.session import get_db
from app.models.investor import Investor
from app.models.country import Country
from app.schemas.investor import InvestorCreate, InvestorOut

router = APIRouter(prefix="/investors", tags=["investors"])


@router.get("", response_model=list[InvestorOut])
def list_investors(
    db: Session = Depends(get_db),
    q: str | None = Query(default=None, description="Search name/sectors/stages"),
    investor_type: str | None = Query(default=None, description="fund | angel | corporate | public | ngo"),
    country_id: int | None = Query(default=None, description="Filter investors by supported country"),
):
    query = db.query(Investor)

    if investor_type:
        query = query.filter(Investor.investor_type == investor_type)

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Investor.name.ilike(like),
                Investor.focus_sectors.ilike(like),
                Investor.stages.ilike(like),
            )
        )

    if country_id is not None:
        query = query.join(Investor.countries).filter(Country.id == country_id)

    return query.order_by(Investor.name.asc()).all()


@router.post("", response_model=InvestorOut, status_code=201)
def create_investor(payload: InvestorCreate, db: Session = Depends(get_db)):
    inv = Investor(
        name=payload.name,
        investor_type=payload.investor_type,
        focus_sectors=payload.focus_sectors,
        stages=payload.stages,
        ticket_min=payload.ticket_min,
        ticket_max=payload.ticket_max,
        website=str(payload.website) if payload.website else None,
        contact_email=str(payload.contact_email) if payload.contact_email else None,
    )

    # attach countries
    if payload.country_ids:
        countries = db.query(Country).filter(Country.id.in_(payload.country_ids)).all()
        found_ids = {c.id for c in countries}
        missing = [cid for cid in payload.country_ids if cid not in found_ids]
        if missing:
            raise HTTPException(status_code=400, detail=f"Unknown country_ids: {missing}")
        inv.countries = countries

    db.add(inv)
    db.commit()
    db.refresh(inv)
    return inv
