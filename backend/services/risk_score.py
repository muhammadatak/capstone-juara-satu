ML_THRESHOLD = 50


def calculate_risk_score(
    ml_score: int | None, whitelist_check: dict, *, use_ml: bool = True
) -> int:
    if not use_ml or ml_score is None:
        return 0
    return max(0, min(100, ml_score))


def compute_auto_classification(
    ml_score: int | None, whitelist_check: dict
) -> str | None:
    """Tentukan level risiko berdasarkan ML score + whitelist.

    Rules:
      - ML >= threshold & tidak di-whitelist → tinggi
      - ML <  threshold & di-whitelist      → rendah
      - ML >= threshold & di-whitelist       → sedang
      - ML <  threshold & tidak di-whitelist → sedang
      - ml_score None                        → None
    """
    if ml_score is None:
        return None

    is_whitelisted = whitelist_check.get("is_whitelisted", False)
    is_high_risk = ml_score >= ML_THRESHOLD

    if is_high_risk and not is_whitelisted:
        return "tinggi"
    if not is_high_risk and is_whitelisted:
        return "rendah"
    return "sedang"
