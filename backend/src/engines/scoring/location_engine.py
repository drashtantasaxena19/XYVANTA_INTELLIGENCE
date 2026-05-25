import math
from typing import Any


def haversine_distance_km(lat1, lon1, lat2, lon2) -> float:
    radius = 6371

    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)

    a = (
        math.sin(d_lat / 2) ** 2
        + math.cos(math.radians(lat1))
        * math.cos(math.radians(lat2))
        * math.sin(d_lon / 2) ** 2
    )

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return radius * c


def calculate_location_score(
    jd_geo: dict | None,
    resume_geo: dict | None,
    jd_mode: Any = None,
) -> dict[str, Any]:
    if jd_mode and str(jd_mode).lower() == "remote":
        return {
            "percentage": 100,
            "reason": "Remote role detected. Location will not reduce ranking.",
            "distance_km": None,
            "applied_to_score": False,
            "status": "not_required",
        }

    if not jd_geo or not resume_geo:
        return {
            "percentage": 0,
            "reason": "No location mentioned in JD or CV/preferred location. Location not used for ranking.",
            "distance_km": None,
            "applied_to_score": False,
            "status": "not_mentioned",
        }

    distance = haversine_distance_km(
        jd_geo["lat"],
        jd_geo["lng"],
        resume_geo["lat"],
        resume_geo["lng"],
    )

    if distance <= 20:
        percentage = 100
    elif distance <= 80:
        percentage = 90
    elif distance <= 250:
        percentage = 75
    elif jd_geo.get("country_code") == resume_geo.get("country_code"):
        percentage = 45
    else:
        percentage = 10

    return {
        "percentage": percentage,
        "reason": f"Approximate location distance: {round(distance, 1)} km.",
        "distance_km": round(distance, 1),
        "applied_to_score": True,
        "status": "calculated",
    }