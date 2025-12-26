"""
Country matching for GDELT articles during ingestion.
Matches by ISO2 code, known name variations, and fuzzy matching in content.
"""

import re


def match_country_from_gdelt(
    gdelt_article: dict,
    all_countries: list,
) -> tuple[int | None, str | None, str | None]:
    """
    Match GDELT article to a country using multiple strategies.
    
    Returns: (country_id, country_name, country_iso2)
    """
    # Build lookup maps
    iso2_to_country = {c.iso2.upper(): c for c in all_countries}
    
    # Comprehensive name variations for all CECECO countries
    name_variations = {}
    for c in all_countries:
        name_upper = c.name.upper()
        name_variations[name_upper] = c
        
        # Handle specific variations
        if c.name == "Türkiye":
            name_variations["TURKEY"] = c
            name_variations["TURKIYE"] = c
            name_variations["TURKISH"] = c
        elif c.name == "Kazakhstan":
            name_variations["KAZAKH"] = c
            name_variations["KAZAK"] = c
        elif c.name == "Uzbekistan":
            name_variations["UZBEK"] = c
            name_variations["UZBEKISTAN"] = c
        elif c.name == "Kyrgyzstan":
            name_variations["KYRGYZ"] = c
            name_variations["KYRGYZSTAN"] = c
            name_variations["KYRGYZ REPUBLIC"] = c
        elif c.name == "Pakistan":
            name_variations["PAKISTANI"] = c
        elif c.name == "Azerbaijan":
            name_variations["AZERBAIJANI"] = c
            name_variations["AZERI"] = c
    
    # Strategy 1: Check sourcecountry field (primary source)
    article_iso2 = gdelt_article.get("sourcecountry", "").strip().upper()
    if article_iso2 and article_iso2 in iso2_to_country:
        country = iso2_to_country[article_iso2]
        return country.id, country.name, country.iso2
    
    # Strategy 2: Check country field (if GDELT provides it)
    article_country_name = gdelt_article.get("country", "").strip().upper()
    if article_country_name:
        # Direct match
        if article_country_name in name_variations:
            country = name_variations[article_country_name]
            return country.id, country.name, country.iso2
        
        # Partial match (e.g., "Kazakhstan" in "Republic of Kazakhstan")
        for variant, country in name_variations.items():
            if variant in article_country_name or article_country_name in variant:
                return country.id, country.name, country.iso2
    
    # Strategy 3: Check other ISO2 fields that GDELT might use
    for field in ["countrycode", "country_code", "iso2", "iso_2"]:
        iso2_value = gdelt_article.get(field, "").strip().upper()
        if iso2_value and iso2_value in iso2_to_country:
            country = iso2_to_country[iso2_value]
            return country.id, country.name, country.iso2
    
    # Strategy 4: Fuzzy match in title and summary (case-insensitive)
    title = gdelt_article.get("title", "").upper()
    summary = gdelt_article.get("summary", "") or gdelt_article.get("snippet", "")
    summary = summary.upper() if summary else ""
    content = f"{title} {summary}"
    
    # Check for country names in content
    for variant, country in name_variations.items():
        # Use word boundaries to avoid partial matches in other words
        pattern = r'\b' + re.escape(variant) + r'\b'
        if re.search(pattern, content, re.IGNORECASE):
            return country.id, country.name, country.iso2
    
    # Strategy 5: Check domain for country indicators
    domain = gdelt_article.get("domain", "").upper()
    if domain:
        # Check for country TLDs or country-specific domains
        country_tlds = {
            ".AZ": iso2_to_country.get("AZ"),
            ".TR": iso2_to_country.get("TR"),
            ".PK": iso2_to_country.get("PK"),
            ".KZ": iso2_to_country.get("KZ"),
            ".UZ": iso2_to_country.get("UZ"),
            ".KG": iso2_to_country.get("KG"),
        }
        for tld, country in country_tlds.items():
            if country and tld in domain:
                return country.id, country.name, country.iso2
    
    # No match - return global
    return None, "Global", None

