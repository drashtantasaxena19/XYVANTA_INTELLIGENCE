from typing import Any


def clamp(
    value: float,
    min_value: float = 0,
    max_value: float = 100,
) -> float:
    return max(
        min_value,
        min(value, max_value),
    )


def calculate_join_probability(
    score_breakdown: dict[str, Any],
) -> dict[str, Any]:

    skills = (
        score_breakdown
        .get("skills", {})
        .get("percentage", 0)
    )

    role = (
        score_breakdown
        .get("role", {})
        .get("percentage", 0)
    )

    experience = (
        score_breakdown
        .get("experience", {})
        .get("percentage", 0)
    )

    education = (
        score_breakdown
        .get("education", {})
        .get("percentage", 0)
    )

    location_data = score_breakdown.get(
        "location_mode",
        {},
    )

    location_applied = location_data.get(
        "applied_to_score",
        False,
    )

    location = (
        location_data.get("percentage", 0)
        if location_applied
        else 75
    )

    adaptability = 70

    # Strong experience increases adaptability.
    if experience >= 90:
        adaptability = 92

    elif experience >= 75:
        adaptability = 84

    elif experience >= 60:
        adaptability = 76

    recruiter_confidence = (
        (
            skills * 0.30
            + role * 0.25
            + experience * 0.30
            + education * 0.05
            + adaptability * 0.10
        )
    )

    probability = (
        skills * 0.28
        + role * 0.22
        + experience * 0.25
        + location * 0.10
        + adaptability * 0.10
        + recruiter_confidence * 0.05
    )

    probability = clamp(probability)

    if (
        experience >= 85
        and role >= 80
    ):
        probability = max(
            probability,
            88,
        )

    elif (
        experience >= 70
        and role >= 70
    ):
        probability = max(
            probability,
            80,
        )

    return {
        "percentage":
            round(probability, 2),

        "adaptability":
            round(adaptability, 2),

        "recruiter_confidence":
            round(recruiter_confidence, 2),

        "factors": {
            "skills": skills,
            "role": role,
            "experience": experience,
            "education": education,
            "location": location,
            "adaptability": adaptability,
            "recruiter_confidence":
                recruiter_confidence,
        },

        "reason":
            (
                "Join probability estimated from "
                "skills, role alignment, experience strength, "
                "adaptability, recruiter confidence and "
                "location compatibility."
            ),
    }