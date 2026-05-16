ML_WEIGHT = 0.2
WHITELIST_WEIGHT = 0.8


def _calculate_whitelist_score(whitelist_check: dict) -> int:
    if not whitelist_check.get("whitelist_value"):
        return 0

    if not whitelist_check.get("is_whitelisted", False):
        return 100

    return 0


def calculate_risk_score(ml_score: int, whitelist_check: dict) -> int:
    whitelist_score = _calculate_whitelist_score(whitelist_check)
    combined = (whitelist_score * WHITELIST_WEIGHT) + (ml_score * ML_WEIGHT)
    return max(0, min(100, int(round(combined))))
