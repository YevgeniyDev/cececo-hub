def compute_impact_score(impact_type: str, tags: str, title: str, summary: str) -> int:
    text = f"{impact_type} {tags} {title} {summary}".lower()

    score = 10

    # Positive policy/regulation signals
    boosts = [
        ("net metering", 18),
        ("auction", 16),
        ("ppa", 16),
        ("grid code", 14),
        ("incentive", 12),
        ("target", 10),
        ("standard", 10),
        ("tender", 10),
        ("procurement", 10),
        ("financing", 8),
    ]

    # Negative signals
    penalties = [
        ("rollback", -18),
        ("subsidy removed", -16),
        ("uncertainty", -12),
        ("delay", -10),
        ("canceled", -14),
        ("restriction", -10),
    ]

    for key, w in boosts:
        if key in text:
            score += w

    for key, w in penalties:
        if key in text:
            score += w

    # Type baseline
    if impact_type == "policy":
        score += 15
    elif impact_type == "regulation":
        score += 12
    elif impact_type == "project":
        score += 8
    elif impact_type == "achievement":
        score += 6

    if score < 0:
        score = 0
    if score > 100:
        score = 100

    return int(score)
