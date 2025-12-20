from __future__ import annotations

from typing import Any

from app.models.project import Project
from app.models.investor import Investor


def _split_csv(value: str | None) -> set[str]:
    if not value:
        return set()
    return {x.strip().lower() for x in value.split(",") if x.strip()}


def score_investor_for_project(project: Project, investor: Investor) -> tuple[int, list[str]]:
    reasons: list[str] = []
    score = 0

    # Country match (+2)
    proj_country_id = project.country_id
    inv_country_ids = {c.id for c in (investor.countries or [])}

    if proj_country_id and proj_country_id in inv_country_ids:
        score += 2
        reasons.append("Country match")

    # Sector match (+2)
    proj_sector = (project.sector or "").strip().lower()
    inv_sectors = _split_csv(investor.focus_sectors)
    if proj_sector and proj_sector in inv_sectors:
        score += 2
        reasons.append(f"Sector match: {project.sector}")

    # Stage match (+1)
    proj_stage = (project.stage or "").strip().lower()
    inv_stages = _split_csv(investor.stages)
    if proj_stage and proj_stage in inv_stages:
        score += 1
        reasons.append(f"Stage match: {project.stage}")

    if not reasons:
        reasons.append("No direct country/sector/stage match (MVP)")

    return score, reasons


def build_matches(project: Project, investors: list[Investor]) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []
    for inv in investors:
        score, reasons = score_investor_for_project(project, inv)
        out.append({"investor": inv, "score": score, "reasons": reasons})

    out.sort(key=lambda x: (x["score"], x["investor"].id), reverse=True)
    return out
