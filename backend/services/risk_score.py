ML_WEIGHT = 0.2
WHITELIST_WEIGHT = 0.8


def _calculate_whitelist_score(whitelist_check: dict) -> int:
    if not whitelist_check.get("is_whitelisted", False):
        return 100

    return 0


def calculate_risk_score(
    ml_score: int | None, whitelist_check: dict, *, use_ml: bool = True
) -> int:
    whitelist_score = _calculate_whitelist_score(whitelist_check)
    if not use_ml or ml_score is None:
        return max(0, min(100, int(round(whitelist_score))))
    combined = (whitelist_score * WHITELIST_WEIGHT) + (ml_score * ML_WEIGHT)
    return max(0, min(100, int(round(combined))))
