def calculate_risk_score(
    ml_score: int | None, whitelist_check: dict, *, use_ml: bool = True
) -> int:
    """
    Calculate final risk score based on ML score and whitelist status.
    
    Logic:
    - ML tinggi (>= 70) + NOT whitelisted = PHISHING (90-100)
    - ML rendah (< 40) + whitelisted = SAFE (0-20)
    - ML tinggi + whitelisted = SUSPICIOUS (40-60)
    - ML rendah + NOT whitelisted = CAUTION (30-50)
    """
    
    # Default: jika tidak ada ML score, gunakan whitelist status saja
    if not use_ml or ml_score is None:
        ml_score = 0
    
    is_whitelisted = whitelist_check.get("is_whitelisted", False)
    
    # Normalisasi ML score ke 0-100 jika perlu
    ml_score = max(0, min(100, ml_score))
    
    # Logic kombinasi ML + Whitelist
    if ml_score >= 70:  # ML Score Tinggi
        if not is_whitelisted:
            # PHISHING: ML tinggi + NOT whitelisted
            return 90 + (ml_score - 70) // 3  # 90-100
        else:
            # SUSPICIOUS: ML tinggi + whitelisted
            return 40 + (ml_score - 70) // 6  # 40-60
    elif ml_score < 40:  # ML Score Rendah
        if is_whitelisted:
            # SAFE: ML rendah + whitelisted
            return 0 + (40 - ml_score) // 10  # 0-20
        else:
            # CAUTION: ML rendah + NOT whitelisted
            return 30 + (40 - ml_score) // 5  # 30-50
    else:  # ML Score Sedang (40-70)
        if not is_whitelisted:
            # MEDIUM: ML sedang + NOT whitelisted
            return 45 + (ml_score - 40) // 6  # 45-70
        else:
            # LOW-MEDIUM: ML sedang + whitelisted
            return 15 + (ml_score - 40) // 10  # 15-40
