from __future__ import annotations

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.country import Country
from app.models.project import Project
from app.models.investor import Investor

SEED_COUNTRIES = [
    ("Azerbaijan", "AZ"),
    ("Türkiye", "TR"),
    ("Pakistan", "PK"),
    ("Kazakhstan", "KZ"),
    ("Uzbekistan", "UZ"),
    ("Kyrgyzstan", "KG"),
]

# kind, country_iso2, title, summary, sector, stage, website
SEED_PROJECTS = [
    ("project", "KZ", "Grid Flex Pilot", "Pilot to improve grid flexibility and demand response coordination.", "Grid", "pilot", None),
    ("project", "TR", "Rooftop Solar Acceleration", "Toolkit for rooftop PV rollout: permitting, financing, and standards.", "Solar", "scaling", None),
    ("project", "AZ", "Wind Resource Screening", "Nationwide screening of wind potential sites with simple feasibility scoring.", "Wind", "planning", None),
    ("project", "KG", "Microhydro Modernization", "Upgrade package for microhydro plants: controls, monitoring, and safety.", "Hydro", "pilot", None),
    ("startup", "UZ", "AgriSolar", "Solar-powered irrigation + monitoring for farms and cooperatives.", "AgriTech", "seed", "https://example.com"),
    ("startup", "PK", "BatterySwap", "Swappable battery network for light EV fleets and last-mile delivery.", "Mobility", "pre-seed", None),
    ("startup", "KZ", "HeatSense", "Smart heat monitoring to cut losses in district heating and buildings.", "Efficiency", "seed", None),
]

SEED_INVESTORS = [
    ("GreenBridge Capital", "fund", "Solar,Wind,Grid", "seed,seriesA", 250000, 2000000, None, None),
    ("Steppe Angels", "angel", "Efficiency,Mobility,AgriTech", "pre-seed,seed", 25000, 150000, None, None),
    ("Eurasia Energy Ventures", "fund", "Hydro,Grid,Storage", "seriesA,seriesB", 500000, 5000000, None, None),
    ("National Climate Program", "public", "Policy,Grid,Efficiency", "pilot,scaling", None, None, None, None),
    ("Impact for Regions", "ngo", "AgriTech,Efficiency,Water", "pilot,seed", 50000, 500000, None, None),
]

INVESTOR_COUNTRY_MAP = {
    "GreenBridge Capital": ["KZ", "TR"],
    "Steppe Angels": ["KZ", "UZ"],
    "Eurasia Energy Ventures": ["AZ", "PK"],
    "National Climate Program": ["KZ", "KG", "UZ"],
    "Impact for Regions": ["PK", "KG", "UZ"],
}


def seed_initial_data() -> None:
    db: Session = SessionLocal()
    try:
        # 1) Countries: add only missing
        existing_iso2 = {c.iso2 for c in db.query(Country).all()}
        added_any_country = False

        for name, iso2 in SEED_COUNTRIES:
            if iso2 not in existing_iso2:
                db.add(Country(name=name, iso2=iso2, region="ECO/CECECO"))
                added_any_country = True

        if added_any_country:
            db.commit()

        # Refresh countries map
        countries = db.query(Country).all()
        iso2_to_country = {c.iso2: c for c in countries}
        iso2_to_id = {c.iso2: c.id for c in countries}

        # 2) Projects/Startups: seed only if table empty
        if db.query(Project).count() == 0:
            for kind, iso2, title, summary, sector, stage, website in SEED_PROJECTS:
                country_id = iso2_to_id.get(iso2)
                if not country_id:
                    continue

                db.add(
                    Project(
                        kind=kind,
                        country_id=country_id,
                        title=title,
                        summary=summary,
                        sector=sector,
                        stage=stage,
                        website=website,
                    )
                )
            db.commit()

        # 3) Investors: seed only if table empty
        if db.query(Investor).count() == 0:
            for name, itype, sectors, stages, tmin, tmax, website, email in SEED_INVESTORS:
                db.add(
                    Investor(
                        name=name,
                        investor_type=itype,
                        focus_sectors=sectors,
                        stages=stages,
                        ticket_min=tmin,
                        ticket_max=tmax,
                        website=website,
                        contact_email=email,
                    )
                )
            db.commit()

        # 4) Investor ↔ Country assignment (only if empty for that investor)
        investors = db.query(Investor).all()
        by_name = {i.name: i for i in investors}

        changed = False
        for inv_name, iso2s in INVESTOR_COUNTRY_MAP.items():
            inv = by_name.get(inv_name)
            if not inv:
                continue

            # Avoid duplicates on restart
            if inv.countries and len(inv.countries) > 0:
                continue

            inv.countries = [iso2_to_country[x] for x in iso2s if x in iso2_to_country]
            changed = True

        if changed:
            db.commit()

    finally:
        db.close()
