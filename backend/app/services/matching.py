from __future__ import annotations

from typing import Any

from app.models.project import Project
from app.models.investor import Investor


def _split_csv(value: str | None) -> set[str]:
    if not value:
        return set()
    return {x.strip().lower() for x in value.split(",") if x.strip()}


def _country_match(project: Project, investor: Investor) -> bool:
    if not project.country_id:
        return False
    inv_country_ids = {c.id for c in (investor.countries or [])}
    return project.country_id in inv_country_ids


def _build_why(*, breakdown: dict[str, int]) -> str:
    parts: list[str] = []
    if breakdown.get("sector"):
        parts.append("sector alignment")
    if breakdown.get("country"):
        parts.append("geo fit")
    if breakdown.get("stage"):
        parts.append("stage fit")

    if not parts:
        return "Limited direct alignment; included for broader ecosystem visibility (MVP)."

    if len(parts) == 1:
        return f"Recommended due to strong {parts[0]}."
    if len(parts) == 2:
        return f"Recommended due to strong {parts[0]} and {parts[1]}."
    return f"Recommended due to strong {parts[0]}, {parts[1]}, and {parts[2]}."


def score_investor_for_project(
    project: Project, investor: Investor
) -> tuple[int, list[str], dict[str, int], list[str], list[dict[str, Any]], str]:
    """
    Returns:
      - raw_score: int (legacy, 0..5)
      - reasons: list[str] (legacy strings)
      - breakdown: dict[str, int] (0..100 contribution buckets)
      - badges: list[str] (short labels for UI)
      - reason_points: list[{"label": str, "points": int}] (new, UI-friendly)
      - why: str (new, single sentence)
    """
    reasons: list[str] = []
    badges: list[str] = []
    reason_points: list[dict[str, Any]] = []

    raw_score = 0

    breakdown = {
        "country": 0,  # up to 40
        "sector": 0,   # up to 40
        "stage": 0,    # up to 20
    }

    # Country match (+2) -> 40
    if _country_match(project, investor):
        raw_score += 2
        reasons.append("Country match")
        badges.append("Strong geo fit")
        breakdown["country"] = 40
        reason_points.append({"label": "Country match", "points": 40})

    # Sector match (+2) -> 40
    proj_sector = (project.sector or "").strip().lower()
    inv_sectors = _split_csv(investor.focus_sectors)
    if proj_sector and proj_sector in inv_sectors:
        raw_score += 2
        reasons.append(f"Sector match: {project.sector}")
        badges.append("Sector match")
        breakdown["sector"] = 40
        reason_points.append({"label": f"Sector match: {project.sector}", "points": 40})

    # Stage match (+1) -> 20
    proj_stage = (project.stage or "").strip().lower()
    inv_stages = _split_csv(investor.stages)
    if proj_stage and proj_stage in inv_stages:
        raw_score += 1
        reasons.append(f"Stage match: {project.stage}")
        badges.append("Stage aligned")
        breakdown["stage"] = 20
        reason_points.append({"label": f"Stage match: {project.stage}", "points": 20})

    if not reasons:
        reasons.append("No direct country/sector/stage match (MVP)")
        badges.append("Weak match")

    why = _build_why(breakdown=breakdown)

    return raw_score, reasons, breakdown, badges, reason_points, why


def build_matches(
    project: Project,
    investors: list[Investor],
    *,
    strict_country: bool = False,
    limit: int | None = None,
) -> list[dict[str, Any]]:
    out: list[dict[str, Any]] = []

    for inv in investors:
        if strict_country and project.country_id and not _country_match(project, inv):
            continue

        raw_score, reasons, breakdown, badges, reason_points, why = score_investor_for_project(project, inv)

        score_100 = breakdown["country"] + breakdown["sector"] + breakdown["stage"]

        out.append(
            {
                "investor": inv,
                "score": raw_score,          # legacy (0..5)
                "score_100": score_100,      # new (0..100)
                "reasons": reasons,          # legacy strings (still useful)
                "score_breakdown": breakdown,
                "badges": badges,
                "reason_points": reason_points,
                "why": why,
            }
        )

    out.sort(key=lambda x: (x["score_100"], x["investor"].id), reverse=True)

    if limit is not None:
        return out[: max(1, limit)]

    return out
