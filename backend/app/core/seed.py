from __future__ import annotations

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.country import Country
from app.models.project import Project
from app.models.investor import Investor
from app.models.country_policy import CountryPolicy
from app.models.country_framework import CountryFramework
from app.models.country_indicator import CountryIndicator
from app.models.country_institution import CountryInstitution
from app.models.country_target import CountryTarget

from datetime import datetime, timezone, timedelta
from app.models.news_item import NewsItem
from app.models.resource import Resource


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
    # Original seed data
    ("project", "KZ", "Grid Flex Pilot", "Pilot to improve grid flexibility and demand response coordination.", "Grid", "pilot", None),
    ("project", "TR", "Rooftop Solar Acceleration", "Toolkit for rooftop PV rollout: permitting, financing, and standards.", "Solar", "scaling", None),
    ("project", "AZ", "Wind Resource Screening", "Nationwide screening of wind potential sites with simple feasibility scoring.", "Wind", "planning", None),
    ("project", "KG", "Microhydro Modernization", "Upgrade package for microhydro plants: controls, monitoring, and safety.", "Hydro", "pilot", None),
    ("startup", "UZ", "AgriSolar", "Solar-powered irrigation + monitoring for farms and cooperatives.", "AgriTech", "seed", "https://example.com"),
    ("startup", "PK", "BatterySwap", "Swappable battery network for light EV fleets and last-mile delivery.", "Mobility", "pre-seed", None),
    ("startup", "KZ", "HeatSense", "Smart heat monitoring to cut losses in district heating and buildings.", "Efficiency", "seed", None),
    # Türkiye (TR)
    ("project", "TR", "Karapınar Solar Power Plant (Kalyon)", "Utility-scale solar mega-project in Konya; one of Türkiye's flagship PV builds.", "Solar", "operational", "https://kalyonpv.com"),
    ("project", "TR", "YEKA Renewable Energy Auctions", "Government auction program that drives utility-scale renewable procurement and pipeline visibility.", "Policy/Market", "scaling", "https://enerji.gov.tr"),
    ("startup", "TR", "ZES EV Charging (Enerjisa)", "Nationwide EV charging network expanding public charging access.", "Mobility", "scaling", "https://zes.net"),
    ("startup", "TR", "Inavitas (wind analytics)", "Wind energy analytics and forecasting solutions (tech-enabled clean energy).", "Wind", "scaling", "https://inavitas.com"),
    ("project", "TR", "Çanakkale Wind Developments (region cluster)", "Çanakkale region hosts multiple wind farms; useful for a 'wind cluster' project entry.", "Wind", "operational", None),
    # Azerbaijan (AZ)
    ("project", "AZ", "Garadagh Solar Power Plant (Masdar)", "~230 MW solar project near Baku; landmark renewable investment.", "Solar", "operational", "https://masdar.ae"),
    ("project", "AZ", "Khizi-Absheron Wind Power Project (Masdar)", "Large wind development supporting Azerbaijan's diversification into renewables.", "Wind", "construction", "https://masdar.ae"),
    ("project", "AZ", "Absheron Wind Resource Screening", "Countrywide wind site screening and early-stage pipeline building (turn into a 'planning project' entry with sources).", "Wind", "planning", None),
    # Kazakhstan (KZ)
    ("project", "KZ", "Ereymentau Wind Farm", "One of Kazakhstan's notable wind farms; useful for 'operational wind' reference.", "Wind", "operational", None),
    ("project", "KZ", "Burnoye Solar Power Plant", "Utility-scale solar plant frequently referenced as early flagship solar in Kazakhstan.", "Solar", "operational", None),
    ("project", "KZ", "Renewable Energy Auctions (Kazakhstan)", "Auction-based procurement pathway for renewables; anchor entry for policy→pipeline linkage.", "Policy/Market", "scaling", None),
    ("startup", "KZ", "Qazaq Green / RE ecosystem group", "Ecosystem actor supporting renewables; can sit as a directory entry for credibility.", "Energy", "scaling", "https://qazaqgreen.kz"),
    # Uzbekistan (UZ)
    ("project", "UZ", "Navoi Solar Power Plant (Masdar)", "~100 MW project; first large-scale solar landmark helping build bankable pipeline.", "Solar", "operational", "https://masdar.ae"),
    ("project", "UZ", "Zarafshan Wind Farm (ACWA Power)", "Major wind investment creating a flagship wind pipeline reference.", "Wind", "construction", "https://www.acwapower.com"),
    ("project", "UZ", "Utility-Scale Solar Pipeline (EBRD/ADB tenders)", "Uzbekistan has been running/announcing solar tenders and IPP pipeline support.", "Solar", "scaling", None),
    # Kyrgyzstan (KG)
    ("project", "KG", "Kambar-Ata-1 Hydropower Project", "Large hydro project under development; major regional electricity and flexibility impact.", "Hydro", "planning", None),
    ("project", "KG", "Toktogul HPP Rehabilitation (concept entry)", "Toktogul is Kyrgyzstan's key hydro asset; add a rehab/modernization project entry with sources you choose.", "Hydro", "scaling", None),
    ("project", "KG", "Small Hydropower Modernization Program", "Small hydro upgrades (controls/monitoring/safety) are 'quick win' bankable interventions.", "Hydro", "pilot", None),
    # Pakistan (PK)
    ("project", "PK", "Quaid-e-Azam Solar Park", "Large solar park often referenced as Pakistan's flagship solar installation.", "Solar", "operational", None),
    ("project", "PK", "Jhimpir Wind Corridor (cluster)", "Wind corridor with multiple wind farms; use as 'wind cluster' project entry.", "Wind", "operational", None),
    ("startup", "PK", "Reon Energy", "Pakistani solar EPC and energy solutions company (good real ecosystem entry).", "Solar", "scaling", "https://reonenergy.com"),
    ("startup", "PK", "SkyElectric", "Solar + storage solutions company; strong 'distributed resilience' story.", "Storage", "scaling", "https://skyelectric.com"),
    ("startup", "PK", "Bykea (mobility electrification adjacency)", "Mobility platform (not pure energy); only include if you want 'transition' ecosystem breadth.", "Mobility", "scaling", "https://bykea.com"),
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

        # --- Knowledge hub curated content (MVP) ---
        # If empty, seed. If not empty, skip (safe on restart).
        if db.query(CountryIndicator).count() == 0:
            # indicator values are normalized 0..1 (transparent MVP curated)
            IND = {
                "AZ": {
                    "policy_readiness": (0.62, "Curated MVP", "Framework presence + active policy count (curated)."),
                    "investment_attractiveness": (0.58, "Curated MVP", "Proxy from policy + stability placeholder (curated)."),
                    "renewable_proxy": (0.70, "Curated MVP", "High wind + solar potential proxy (curated)."),
                    "efficiency_need": (0.55, "Curated MVP", "Building/industry efficiency opportunity proxy (curated)."),
                    "grid_proxy": (0.52, "Curated MVP", "Grid flexibility readiness proxy (curated)."),
                },
                "TR": {
                    "policy_readiness": (0.78, "Curated MVP", "More mature incentive/market mechanisms (curated)."),
                    "investment_attractiveness": (0.74, "Curated MVP", "Proxy from policy + market size (curated)."),
                    "renewable_proxy": (0.77, "Curated MVP", "Strong solar + wind pipeline proxy (curated)."),
                    "efficiency_need": (0.60, "Curated MVP", "Industrial + building efficiency opportunity proxy (curated)."),
                    "grid_proxy": (0.66, "Curated MVP", "Moderate-to-good grid readiness proxy (curated)."),
                },
                "PK": {
                    "policy_readiness": (0.54, "Curated MVP", "Policies exist but execution risk higher (curated)."),
                    "investment_attractiveness": (0.50, "Curated MVP", "Proxy from policy + stability placeholder (curated)."),
                    "renewable_proxy": (0.73, "Curated MVP", "High solar potential proxy (curated)."),
                    "efficiency_need": (0.72, "Curated MVP", "High losses + efficiency opportunity proxy (curated)."),
                    "grid_proxy": (0.45, "Curated MVP", "Grid constraints proxy (curated)."),
                },
                "KZ": {
                    "policy_readiness": (0.67, "Curated MVP", "Clear targets + selected mechanisms (curated)."),
                    "investment_attractiveness": (0.61, "Curated MVP", "Policy readiness + stability proxy (curated)."),
                    "renewable_proxy": (0.75, "Curated MVP", "Large land + wind/solar potential proxy (curated)."),
                    "efficiency_need": (0.65, "Curated MVP", "District heating + industry opportunity proxy (curated)."),
                    "grid_proxy": (0.56, "Curated MVP", "Modernization needed proxy (curated)."),
                },
                "UZ": {
                    "policy_readiness": (0.60, "Curated MVP", "Evolving frameworks + targets (curated)."),
                    "investment_attractiveness": (0.56, "Curated MVP", "Policy + stability proxy (curated)."),
                    "renewable_proxy": (0.74, "Curated MVP", "Solar potential proxy (curated)."),
                    "efficiency_need": (0.63, "Curated MVP", "Buildings + agriculture opportunity proxy (curated)."),
                    "grid_proxy": (0.50, "Curated MVP", "Grid modernization proxy (curated)."),
                },
                "KG": {
                    "policy_readiness": (0.49, "Curated MVP", "Smaller market; frameworks less complete (curated)."),
                    "investment_attractiveness": (0.47, "Curated MVP", "Proxy (curated)."),
                    "renewable_proxy": (0.68, "Curated MVP", "Hydro potential proxy (curated)."),
                    "efficiency_need": (0.58, "Curated MVP", "Efficiency opportunity proxy (curated)."),
                    "grid_proxy": (0.44, "Curated MVP", "Grid constraints proxy (curated)."),
                },
            }

            for iso2, kv in IND.items():
                c = iso2_to_country.get(iso2)
                if not c:
                    continue
                for key, (val, method, details) in kv.items():
                    db.add(CountryIndicator(country_id=c.id, key=key, value=float(val), method=method, details=details))
            db.commit()

        if db.query(CountryPolicy).count() == 0:
            POL = [
                # (iso2, type, status, title, summary, why, source_url)
                ("TR", "target", "active", "Renewables Capacity Targets", "National targets to expand renewable generation capacity and reduce emissions.", "Signals long-term demand and policy intent; supports bankability.", None),
                ("TR", "incentive", "active", "Solar Rooftop Support", "Support mechanisms for distributed rooftop PV adoption (curated MVP entry).", "Improves project economics for SMEs and households.", None),
                ("TR", "incentive", "active", "Renewable support mechanisms (overview)", "Türkiye's renewable support environment including market mechanisms.", "Investors need clarity on revenue mechanics and access paths.", "https://en.wikipedia.org/wiki/Renewable_energy_in_Turkey"),
                ("KZ", "strategy", "active", "Clean Energy Transition Roadmap", "Roadmap focusing on renewables scale-up, grid modernization, and efficiency.", "Gives investors a planning signal and helps prioritize project types.", None),
                ("KZ", "market_rule", "planned", "Grid Flexibility Market Pilots", "Planned pilots for demand response / flexibility services (curated MVP entry).", "Enables storage and demand response business models.", None),
                ("PK", "regulation", "active", "Net Metering Rules (Distributed)", "Rules enabling small-scale distributed generation export (curated MVP entry).", "Unlocks rooftop solar deployment and SME participation.", None),
                ("PK", "regulation", "active", "NEPRA Net Metering Regulations", "Distributed generation / net metering framework enabling rooftop PV export.", "Unlocks SME/household solar and distributed market growth.", "https://nepra.org.pk/publications/Net%20Metering%20Regulations-2015.pdf"),
                ("UZ", "target", "active", "National Renewable Expansion Plan", "Government plan to increase renewable share via utility-scale projects.", "Creates pipeline visibility; helps align investor interest.", None),
                ("AZ", "strategy", "active", "Renewables Development Strategy", "Strategy to expand wind/solar and diversify generation mix.", "Signals priority sectors and target timelines.", None),
                ("AZ", "law/strategy", "active", "Azerbaijan renewable energy legal overview (Dentons)", "Legal/regulatory environment for renewables investment.", "Gives investors legal footing and contract expectations.", "https://www.dentons.com/en/insights/articles/2023/july/3/azerbaijan-renewable-energy"),
                ("KG", "incentive", "planned", "Small Hydro Modernization Support", "Planned support for modernization and safety upgrades for small hydro assets.", "Supports quick-win projects with measurable impact.", None),
                ("KG", "country_profile", "active", "IEA Kyrgyzstan energy profile", "Energy context and system characteristics relevant to reforms.", "Credible reference point for the market and constraints.", "https://www.iea.org/countries/kyrgyzstan"),
            ]
            for iso2, ptype, status, title, summary, why, source_url in POL:
                c = iso2_to_country.get(iso2)
                if not c:
                    continue
                db.add(CountryPolicy(
                    country_id=c.id,
                    policy_type=ptype,
                    status=status,
                    title=title,
                    summary=summary,
                    why_it_matters=why,
                    source_url=source_url,
                ))
            db.commit()

        if db.query(CountryFramework).count() == 0:
            FW = [
                # (iso2, type, status, name, desc, why, source_url)
                ("TR", "auction", "active", "Renewable Auctions", "Competitive procurement mechanism for utility-scale renewables (curated MVP entry).", "Improves price discovery and project bankability.", None),
                ("TR", "auction", "active", "YEKA Renewable Auctions", "Competitive procurement program for utility-scale solar/wind.", "Creates bankable pipeline and standardizes procurement.", "https://enerji.gov.tr"),
                ("TR", "ppa", "active", "PPA Contracting (Corporate/Utility)", "Framework for power purchase agreements (curated MVP entry).", "PPAs reduce revenue risk and attract private capital.", None),
                ("KZ", "grid_code", "active", "Grid Connection Code", "Technical grid connection rules and compliance requirements (curated MVP entry).", "Reduces integration uncertainty for developers.", None),
                ("KZ", "auction", "active", "Kazakhstan RE Auctions (EBRD-supported)", "Auction-based renewable procurement used for pipeline buildout.", "Clear procurement path = credible project development.", "https://www.ebrd.com/work-with-us/projects/psd/kazakhstan-renewable-energy-auctions.html"),
                ("PK", "net_metering", "active", "Net Metering Framework", "Defines eligibility, metering, and export settlement for distributed PV.", "Directly enables rooftop solar projects.", None),
                ("UZ", "auction", "planned", "Renewable Auction Program", "Planned program for scaling utility-scale renewables via auctions.", "Signals future pipeline and procurement path.", None),
                ("UZ", "auction", "planned", "Uzbekistan Solar Development / tenders (EBRD)", "Program support and project pipeline for utility-scale solar.", "Signals repeatable pathway for IPPs and capital deployment.", "https://www.ebrd.com/work-with-us/projects/psd/uzbekistan-solar-development.html"),
                ("AZ", "ppa", "planned", "PPA Standardization", "Work towards standardized PPAs for renewables (curated MVP entry).", "Standard contracts reduce legal friction.", None),
                ("KG", "efficiency_standard", "planned", "Efficiency Standards (Buildings)", "Planned minimum efficiency requirements / standards (curated MVP entry).", "Creates steady demand for efficiency solutions.", None),
            ]
            for iso2, ftype, status, name, desc, why, source_url in FW:
                c = iso2_to_country.get(iso2)
                if not c:
                    continue
                db.add(CountryFramework(
                    country_id=c.id,
                    framework_type=ftype,
                    status=status,
                    name=name,
                    description=desc,
                    why_it_matters=why,
                    source_url=source_url,
                ))
            db.commit()

        # Institutions seed
        if db.query(CountryInstitution).count() == 0:
            INST = [
                # (iso2, type, name, desc, website, email)
                ("KZ", "ministry", "Ministry of Energy", "Energy policy, planning and oversight.", None, None),
                ("KZ", "regulator", "Energy Regulation Authority", "Market rules and regulatory oversight.", None, None),
                ("KZ", "tso", "National Grid Operator", "Transmission planning, grid access and operations.", None, None),
                ("TR", "ministry", "Ministry of Energy and Natural Resources", "Energy strategy and national programs.", None, None),
                ("TR", "regulator", "Energy Market Regulatory Authority (EMRA)", "Licensing and market regulation.", None, None),
                ("TR", "tso", "TEİAŞ", "Transmission system operator.", None, None),
                ("AZ", "ministry", "Ministry of Energy", "Energy policy and development strategy.", None, None),
                ("AZ", "regulator", "Energy Regulatory Agency", "Market regulation and licensing.", None, None),
                ("PK", "ministry", "Ministry of Energy", "National energy policy and planning.", None, None),
                ("PK", "regulator", "National Electric Power Regulatory Authority (NEPRA)", "Power sector regulation and tariffs.", None, None),
                ("PK", "tso", "National Transmission & Despatch Company", "Transmission system operations.", None, None),
                ("UZ", "ministry", "Ministry of Energy", "Energy sector development and policy.", None, None),
                ("UZ", "regulator", "Energy Regulatory Authority", "Market oversight and regulation.", None, None),
                ("KG", "ministry", "Ministry of Energy", "Energy policy and sector development.", None, None),
                ("KG", "regulator", "Energy Regulatory Commission", "Regulatory oversight and market rules.", None, None),
            ]
            for iso2, itype, name, desc, web, email in INST:
                c = iso2_to_country.get(iso2)
                if not c:
                    continue
                db.add(CountryInstitution(
                    country_id=c.id,
                    institution_type=itype,
                    name=name,
                    description=desc,
                    website=web,
                    contact_email=email
                ))
            db.commit()

        # Targets seed
        if db.query(CountryTarget).count() == 0:
            TGT = [
                # (iso2, year, type, title, value, unit, notes, source_url)
                ("KZ", 2030, "renewables_share", "Renewables share target", "—", "%", "Add official target when confirmed.", None),
                ("TR", 2030, "capacity_gw", "Renewables capacity target", "—", "GW", "Add official number + source.", None),
                ("TR", 2030, "renewables_share", "Renewables share target", "—", "%", "Add official target when confirmed.", None),
                ("PK", 2030, "renewables_share", "Clean energy share target", "—", "%", "Add official number + source.", None),
                ("PK", 2030, "capacity_gw", "Renewables capacity target", "—", "GW", "Add official number + source.", None),
                ("UZ", 2030, "renewables_share", "Renewables share target", "—", "%", "Add official target when confirmed.", None),
                ("UZ", 2030, "capacity_gw", "Solar capacity target", "—", "GW", "Add official number + source.", None),
                ("AZ", 2030, "renewables_share", "Renewables share target", "—", "%", "Add official target when confirmed.", None),
                ("AZ", 2030, "capacity_gw", "Wind capacity target", "—", "GW", "Add official number + source.", None),
                ("KG", 2030, "renewables_share", "Renewables share target", "—", "%", "Add official target when confirmed.", None),
            ]
            for iso2, year, ttype, title, value, unit, notes, src in TGT:
                c = iso2_to_country.get(iso2)
                if not c:
                    continue
                db.add(CountryTarget(
                    country_id=c.id,
                    year=year,
                    target_type=ttype,
                    title=title,
                    value=value,
                    unit=unit,
                    notes=notes,
                    source_url=src
                ))
            db.commit()

        # Narrative fields on countries (seed if empty)
        # (safe: only set if currently null)
        NARR = {
            "TR": (
                "Türkiye has comparatively mature renewable market mechanisms and a growing pipeline across solar, wind, and grid modernization.",
                "High potential in solar + wind scale-up, plus grid flexibility and permitting/tooling improvements.",
                "Best near-term: rooftop PV acceleration, corporate PPAs, grid flexibility pilots. Watch-outs: interconnection constraints and permitting delays."
            ),
            "KZ": (
                "Kazakhstan shows strong utility-scale potential and clear demand for grid flexibility and efficiency, especially in district heating and industry.",
                "Wind/solar utility-scale, grid flexibility, and efficiency retrofits are priority areas with large scalable impact.",
                "Best near-term: grid flexibility pilots, storage-enabling policy work, efficiency monitoring in district heating. Watch-outs: market rule maturity."
            ),
            "PK": (
                "Pakistan has high efficiency opportunity and strong distributed solar potential, but execution risk and grid constraints are key considerations.",
                "Solar (distributed + utility), high-loss reduction, building and industrial efficiency upgrades.",
                "Best near-term: net metering rooftop PV, loss-reduction and monitoring solutions. Watch-outs: grid reliability and policy consistency."
            ),
            "UZ": (
                "Uzbekistan is scaling renewables through planned procurement and policy evolution; agriculture-linked efficiency and solar are strong opportunities.",
                "Utility-scale solar and efficiency for buildings/agriculture; enabling frameworks will shape investment pace.",
                "Best near-term: solar project development readiness and efficiency tools. Watch-outs: procurement timing and framework rollout."
            ),
            "AZ": (
                "Azerbaijan is diversifying generation with renewables; wind/solar development pathways and standardized contracts are key to accelerate investment.",
                "Strong potential in wind + solar; enabling PPAs and grid integration rules will unlock scale.",
                "Best near-term: resource screening + early-stage development tools; Watch-outs: contract standardization and bankability."
            ),
            "KG": (
                "Kyrgyzstan can deliver quick wins via small hydro modernization and efficiency improvements, but investment scale is typically smaller.",
                "Small hydro modernization, building efficiency standards, and practical monitoring tools.",
                "Best near-term: modernization packages and efficiency pilots. Watch-outs: limited market scale and framework completeness."
            ),
        }

        changed_notes = False
        for iso2, (briefing, potential, action) in NARR.items():
            c = iso2_to_country.get(iso2)
            if not c:
                continue
            if c.briefing is None:
                c.briefing = briefing
                changed_notes = True
            if c.potential_notes is None:
                c.potential_notes = potential
                changed_notes = True
            if c.action_plan_notes is None:
                c.action_plan_notes = action
                changed_notes = True

        if changed_notes:
            db.commit()

        # --- News feed seed removed ---
        # News is now fetched from GDELT API via the ingestion endpoint

        # --- Research library seed (approved examples) ---
        if db.query(Resource).count() == 0:
            now = datetime.now(timezone.utc)
            examples = [
                (None, "report", "Regional clean energy investment brief (MVP)", "Curated overview of investment mechanisms and enabling frameworks across CECECO member countries.", "https://example.com", "investment,policy,regional", None),
                ("TR", "research", "Grid flexibility and demand response readiness (MVP)", "Research note on market design levers for flexibility services and storage integration.", "https://example.com", "grid,flexibility,storage", 30),
            ]

            for iso2, rtype, title, abstract, url, tags, days_ago in examples:
                country_id = None
                if iso2:
                    c = iso2_to_country.get(iso2)
                    if c:
                        country_id = c.id

                db.add(
                    Resource(
                        country_id=country_id,
                        status="approved",
                        resource_type=rtype,
                        title=title,
                        abstract=abstract,
                        url=url,
                        tags=tags,
                        published_at=(now - timedelta(days=int(days_ago))) if days_ago else None,
                        submitted_by_name="CECECO Hub (seed)",
                        submitted_by_email=None,
                    )
                )
            db.commit()

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
