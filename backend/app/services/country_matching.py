"""
Simplified country matching for GDELT articles during ingestion.
Only matches by ISO2 code and known name variations.
"""


def match_country_from_gdelt(
    gdelt_article: dict,
    all_countries: list,
) -> tuple[int | None, str | None, str | None]:
    """
    Match GDELT article to a country.
    
    Returns: (country_id, country_name, country_iso2)
    """
    # Get ISO2 from GDELT
    article_iso2 = gdelt_article.get("sourcecountry", "").strip().upper()
    
    # Build simple lookup maps
    iso2_to_country = {c.iso2.upper(): c for c in all_countries}
    
    # Known name variations (minimal set)
    name_variations = {}
    for c in all_countries:
        name_variations[c.name.upper()] = c
        if c.name == "Türkiye":
            name_variations["TURKEY"] = c
            name_variations["TURKIYE"] = c
    
    # Try ISO2 match first
    if article_iso2 and article_iso2 in iso2_to_country:
        country = iso2_to_country[article_iso2]
        return country.id, country.name, country.iso2
    
    # Try name match (if GDELT provides country name)
    article_country_name = gdelt_article.get("country", "").strip().upper()
    if article_country_name and article_country_name in name_variations:
        country = name_variations[article_country_name]
        return country.id, country.name, country.iso2
    
    # No match - return global
    return None, "Global", None

