from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import csv
import io

from app.core.admin import require_admin
from app.db.session import get_db
from app.models.country import Country
from app.models.project import Project
from app.models.investor import Investor

router = APIRouter(prefix="/admin/import", tags=["admin-import"])


CECECO_ISO2 = {"TR", "AZ", "PK", "KZ", "UZ", "KG"}


def _norm(s: str | None) -> str:
    return (s or "").strip()


def _split_list(s: str | None) -> str | None:
    """
    Store as comma-separated string normalized: "Solar, Wind" -> "Solar,Wind"
    """
    v = _norm(s)
    if not v:
        return None
    parts = [p.strip() for p in v.split(",") if p.strip()]
    return ",".join(parts) if parts else None


def _parse_int(s: str | None) -> int | None:
    v = _norm(s)
    if not v:
        return None
    try:
        return int(float(v))
    except Exception:
        return None


def _read_csv(upload: UploadFile) -> list[dict]:
    content = upload.file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty CSV file")

    # handle BOM / utf-8
    text = content.decode("utf-8-sig", errors="replace")
    reader = csv.DictReader(io.StringIO(text))
    rows = []
    for r in reader:
        if r and any(_norm(x) for x in r.values()):
            rows.append(r)
    if not rows:
        raise HTTPException(status_code=400, detail="No rows found in CSV")
    return rows


@router.post("/startups")
def import_startups(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    rows = _read_csv(file)

    countries = db.query(Country).all()
    iso2_to_country = {c.iso2.upper(): c for c in countries}

    created = 0
    updated = 0
    skipped = 0

    for row in rows:
        # CSV has 'name', Project model uses 'title'
        name = _norm(row.get("name"))
        if not name:
            skipped += 1
            continue

        # Support both 'country' (name) and 'country_iso2' (ISO code)
        iso2 = None
        country_name = _norm(row.get("country"))
        country_iso2 = _norm(row.get("country_iso2"))
        
        if country_iso2:
            iso2 = country_iso2.upper()
        elif country_name:
            # Try to find country by name
            country_obj = db.query(Country).filter(Country.name.ilike(country_name)).first()
            if country_obj:
                iso2 = country_obj.iso2.upper()
        
        if not iso2 or iso2 not in CECECO_ISO2:
            skipped += 1
            continue

        country = iso2_to_country.get(iso2)
        if not country:
            skipped += 1
            continue

        # Map CSV fields to Project model fields
        title = name  # CSV 'name' -> Project 'title'
        summary = _norm(row.get("description")) or _norm(row.get("summary")) or None
        website = _norm(row.get("website")) or None
        
        # CSV has 'sectors' (plural, comma-separated), Project has 'sector' (singular)
        sectors_raw = _split_list(row.get("sectors")) or _norm(row.get("sector"))
        sector = None
        if sectors_raw:
            # Take first sector or join if needed
            parts = sectors_raw.split(",")
            sector = parts[0].strip() if parts else None
        
        # CSV has 'stages' (plural, comma-separated), Project has 'stage' (singular)
        stages_raw = _split_list(row.get("stages")) or _norm(row.get("stage"))
        stage = None
        if stages_raw:
            # Take first stage
            parts = stages_raw.split(",")
            stage = parts[0].strip() if parts else None

        source_url = _norm(row.get("source_url")) or None

        # Dedupe rule: title + country (for startups)
        existing = (
            db.query(Project)
            .filter(Project.title == title, Project.country_id == country.id, Project.kind == "startup")
            .first()
        )

        if existing:
            existing.summary = summary or existing.summary
            existing.website = website or existing.website
            existing.sector = sector or existing.sector
            existing.stage = stage or existing.stage
            # optional fields if you add them:
            if hasattr(existing, "source"):
                existing.source = "csv"
            if hasattr(existing, "source_url"):
                existing.source_url = source_url or getattr(existing, "source_url", None)
            if hasattr(existing, "verified"):
                existing.verified = True
            if hasattr(existing, "last_synced_at"):
                existing.last_synced_at = datetime.now(timezone.utc)

            updated += 1
        else:
            obj = Project(
                kind="startup",
                title=title,
                summary=summary or "No description provided",
                website=website,
                country_id=country.id,
                sector=sector,
                stage=stage,
            )
            if hasattr(obj, "source"):
                obj.source = "csv"
            if hasattr(obj, "source_url"):
                obj.source_url = source_url
            if hasattr(obj, "verified"):
                obj.verified = True
            if hasattr(obj, "status"):
                obj.status = "approved"
            if hasattr(obj, "last_synced_at"):
                obj.last_synced_at = datetime.now(timezone.utc)

            db.add(obj)
            created += 1

    db.commit()
    return {"created": created, "updated": updated, "skipped": skipped, "rows": len(rows)}


@router.post("/investors")
def import_investors(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _admin=Depends(require_admin),
):
    rows = _read_csv(file)

    countries = db.query(Country).all()
    iso2_to_country = {c.iso2.upper(): c for c in countries}

    created = 0
    updated = 0
    skipped = 0

    for row in rows:
        name = _norm(row.get("name"))
        if not name:
            skipped += 1
            continue

        investor_type = _norm(row.get("investor_type")).lower()
        if investor_type not in {"fund", "angel", "corporate", "public", "ngo"}:
            skipped += 1
            continue

        # investors can span multiple countries: "TR,KZ"
        iso2s_raw = _norm(row.get("country_iso2"))
        iso2s = [x.strip().upper() for x in iso2s_raw.split(",") if x.strip()]
        iso2s = [x for x in iso2s if x in CECECO_ISO2]
        if not iso2s:
            skipped += 1
            continue

        website = _norm(row.get("website")) or None
        contact_email = _norm(row.get("contact_email")) or None
        sectors = _split_list(row.get("focus_sectors")) or _split_list(row.get("sectors"))
        stages = _split_list(row.get("stages"))
        ticket_min = _parse_int(row.get("ticket_min"))
        ticket_max = _parse_int(row.get("ticket_max"))
        description = _norm(row.get("description")) or _norm(row.get("notes")) or None
        source_url = _norm(row.get("source_url")) or None

        # dedupe rule: name + investor_type
        existing = (
            db.query(Investor)
            .filter(Investor.name == name, Investor.investor_type == investor_type)
            .first()
        )

        if existing:
            existing.website = website or existing.website
            existing.contact_email = contact_email or existing.contact_email
            existing.focus_sectors = sectors or existing.focus_sectors
            existing.stages = stages or existing.stages
            existing.ticket_min = ticket_min if ticket_min is not None else existing.ticket_min
            existing.ticket_max = ticket_max if ticket_max is not None else existing.ticket_max
            if hasattr(existing, "description"):
                existing.description = description or getattr(existing, "description", None)

            # countries relation: attach missing
            if hasattr(existing, "countries") and existing.countries is not None:
                existing_iso2 = {c.iso2.upper() for c in existing.countries}
                for code in iso2s:
                    cobj = iso2_to_country.get(code)
                    if cobj and cobj.iso2.upper() not in existing_iso2:
                        existing.countries.append(cobj)

            if hasattr(existing, "source"):
                existing.source = "csv"
            if hasattr(existing, "source_url"):
                existing.source_url = source_url or getattr(existing, "source_url", None)
            if hasattr(existing, "verified"):
                existing.verified = True
            if hasattr(existing, "last_synced_at"):
                existing.last_synced_at = datetime.now(timezone.utc)

            updated += 1
        else:
            obj = Investor(
                name=name,
                investor_type=investor_type,
                website=website,
                contact_email=contact_email,
                focus_sectors=sectors,
                stages=stages,
                ticket_min=ticket_min,
                ticket_max=ticket_max,
            )
            if hasattr(obj, "description"):
                obj.description = description
            if hasattr(obj, "source"):
                obj.source = "csv"
            if hasattr(obj, "source_url"):
                obj.source_url = source_url
            if hasattr(obj, "verified"):
                obj.verified = True
            if hasattr(obj, "status"):
                obj.status = "approved"
            if hasattr(obj, "last_synced_at"):
                obj.last_synced_at = datetime.now(timezone.utc)

            # attach countries
            country_objs = [iso2_to_country.get(code) for code in iso2s if iso2_to_country.get(code)]
            if country_objs and hasattr(obj, "countries"):
                obj.countries = country_objs

            db.add(obj)
            created += 1

    db.commit()
    return {"created": created, "updated": updated, "skipped": skipped, "rows": len(rows)}

