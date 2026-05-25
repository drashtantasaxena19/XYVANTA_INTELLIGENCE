from typing import Any

from src.engines.scoring.semantic_matcher import (
    match_list,
    similarity,
)

from src.engines.scoring.location_engine import (
    calculate_location_score,
)

from src.engines.scoring.join_probability_engine import (
    calculate_join_probability,
)

from src.engines.normalization.title_normalizer import (
    detect_role_family,
    same_role_family,
)


BASE_WEIGHTS = {
    "skills": 40,
    "experience": 20,
    "role": 15,
    "education": 10,
    "location_mode": 5,
    "seniority": 5,
    "certifications": 5,
}


def clamp(
    value: float,
    min_value: float = 0,
    max_value: float = 100,
) -> float:
    return max(
        min_value,
        min(value, max_value),
    )


def component_score(
    percent: float,
    weight: int,
) -> float:
    return round(
        (clamp(percent) / 100) * weight,
        2,
    )


def safe_number(
    value: Any,
) -> float:
    try:
        return float(value or 0)

    except Exception:
        return 0.0


def is_missing(
    value: Any,
) -> bool:

    if value is None:
        return True

    if isinstance(value, str):

        cleaned = (
            value.strip()
            .lower()
        )

        return cleaned in {
            "",
            "null",
            "none",
            "not detected",
            "n/a",
            "unknown",
        }

    if isinstance(value, list):
        return len(value) == 0

    return False


def get_dynamic_weights(
    candidate_exp: float,
) -> dict:

    if candidate_exp >= 10:
        return {
            "skills": 22,
            "experience": 38,
            "role": 18,
            "education": 5,
            "location_mode": 5,
            "seniority": 7,
            "certifications": 5,
        }

    if candidate_exp >= 5:
        return {
            "skills": 30,
            "experience": 32,
            "role": 18,
            "education": 7,
            "location_mode": 5,
            "seniority": 3,
            "certifications": 5,
        }

    return BASE_WEIGHTS


def calculate_experience_score(
    jd: dict,
    resume: dict,
) -> dict[str, Any]:

    required_exp = safe_number(
        jd.get(
            "required_experience_years"
        )
    )

    candidate_exp = safe_number(
        resume.get(
            "total_experience_years",
            resume.get(
                "experience_years",
                0,
            ),
        )
    )

    if required_exp <= 0:

        return {
            "percentage": 100,
            "reason":
                "No minimum experience required in JD.",
            "applied_to_score": False,
        }

    if candidate_exp <= 0:

        return {
            "percentage": 0,
            "reason":
                "Candidate experience missing.",
            "applied_to_score": True,
        }

    ratio = (
        candidate_exp / required_exp
    )

    percentage = min(
        round(ratio * 100),
        100,
    )

    if candidate_exp >= required_exp + 3:
        percentage = min(percentage + 8, 100)

    return {
        "percentage": percentage,
        "reason":
            (
                f"{candidate_exp} years "
                f"candidate experience vs "
                f"{required_exp} years required."
            ),
        "applied_to_score": True,
    }


def calculate_role_score(
    jd: dict,
    resume: dict,
    candidate_exp: float,
) -> dict[str, Any]:

    jd_title = (
        jd.get("title")
        or jd.get("job_title")
    )

    resume_title = (
        resume.get(
            "target_role"
        )
        or resume.get(
            "current_position"
        )
    )

    if is_missing(jd_title):

        return {
            "percentage": 0,
            "reason":
                "JD role/title missing.",
            "applied_to_score": False,
        }

    if is_missing(resume_title):

        return {
            "percentage": 0,
            "reason":
                "Candidate role/title missing.",
            "applied_to_score": True,
        }

    percentage = round(
        similarity(
            jd_title,
            resume_title,
        ) * 100
    )

    if same_role_family(
        jd_title,
        resume_title,
    ):
        percentage = max(
            percentage,
            82,
        )

        if candidate_exp >= 8:
            percentage = max(
                percentage,
                90,
            )

    return {
        "percentage": percentage,
        "reason":
            "Role similarity calculated with domain intelligence.",
        "applied_to_score": True,
    }


def calculate_seniority_score(
    jd: dict,
    resume: dict,
) -> dict[str, Any]:

    required_exp = safe_number(
        jd.get(
            "required_experience_years"
        )
    )

    candidate_exp = safe_number(
        resume.get(
            "total_experience_years",
            resume.get(
                "experience_years",
                0,
            ),
        )
    )

    if required_exp <= 0:

        return {
            "percentage": 100,
            "reason":
                "No seniority requirement defined.",
            "applied_to_score": False,
        }

    if candidate_exp <= 0:

        return {
            "percentage": 0,
            "reason":
                "Candidate seniority unavailable.",
            "applied_to_score": True,
        }

    percentage = min(
        round(
            (
                candidate_exp
                / required_exp
            )
            * 100
        ),
        100,
    )

    return {
        "percentage": percentage,
        "reason":
            "Seniority calculated from experience.",
        "applied_to_score": True,
    }


def calculate_best_suited_label(
    final_score: float,
) -> str:

    if final_score >= 90:
        return "Best Suited"

    if final_score >= 80:
        return "Highly Recommended"

    if final_score >= 70:
        return "Strong Match"

    if final_score >= 60:
        return "Potential Match"

    return "Low Match"


def calculate_final_score(
    jd: dict,
    resume: dict,
) -> dict:

    candidate_exp = safe_number(
        resume.get(
            "total_experience_years",
            resume.get(
                "experience_years",
                0,
            ),
        )
    )

    weights = get_dynamic_weights(
        candidate_exp
    )

    skills = match_list(
        jd.get(
            "required_skills",
            [],
        ),
        resume.get(
            "skills",
            [],
        ),
    )

    education = match_list(
        jd.get(
            "required_education",
            [],
        ),
        resume.get(
            "education",
            [],
        ),
    )

    certifications = match_list(
        jd.get(
            "certifications",
            [],
        ),
        resume.get(
            "certifications",
            [],
        ),
    )

    experience = (
        calculate_experience_score(
            jd,
            resume,
        )
    )

    role = calculate_role_score(
        jd,
        resume,
        candidate_exp,
    )

    seniority = (
        calculate_seniority_score(
            jd,
            resume,
        )
    )

    location = (
        calculate_location_score(
            jd.get(
                "location_geo"
            ),

            resume.get(
                "preferred_location_geo"
            )
            or resume.get(
                "current_location_geo"
            )
            or resume.get(
                "location_geo"
            ),

            jd.get("mode"),
        )
    )

    role_family_boost = 0

    jd_title = (
        jd.get("title")
        or jd.get("job_title")
    )

    resume_title = (
        resume.get("target_role")
        or resume.get("current_position")
    )

    if same_role_family(
        jd_title,
        resume_title,
    ):
        role_family_boost = 6

        if candidate_exp >= 8:
            role_family_boost = 10

    if (
        candidate_exp >= 10
        and skills["percentage"] >= 55
    ):
        role_family_boost += 4

    jd_has_education = not is_missing(
        jd.get("required_education")
    )

    jd_has_certifications = not is_missing(
        jd.get("certifications")
    )

    breakdown = {
        "skills": {
            "weight": weights["skills"],
            "percentage": skills["percentage"],
            "score": component_score(
                skills["percentage"],
                weights["skills"],
            ),
            "matched": skills["matched"],
            "missing": skills["missing"],
            "applied_to_score": True,
        },

        "experience": {
            "weight": weights["experience"],
            "percentage": experience["percentage"],
            "score":
                component_score(
                    experience["percentage"],
                    weights["experience"],
                )
                if experience["applied_to_score"]
                else 0,

            "reason":
                experience["reason"],

            "applied_to_score":
                experience["applied_to_score"],
        },

        "role": {
            "weight": weights["role"],
            "percentage": role["percentage"],
            "score":
                component_score(
                    role["percentage"],
                    weights["role"],
                )
                if role["applied_to_score"]
                else 0,

            "reason":
                role["reason"],

            "applied_to_score":
                role["applied_to_score"],
        },

        "education": {
            "weight": weights["education"],
            "percentage": education["percentage"],
            "score":
                component_score(
                    education["percentage"],
                    weights["education"],
                )
                if jd_has_education
                else 0,

            "matched":
                education["matched"],

            "missing":
                education["missing"],

            "applied_to_score": jd_has_education,
        },

        "location_mode": {
            "weight":
                weights["location_mode"],

            "percentage":
                location["percentage"],

            "score":
                component_score(
                    location["percentage"],
                    weights["location_mode"],
                )
                if location["applied_to_score"]
                else 0,

            "reason":
                location["reason"],

            "distance_km":
                location.get(
                    "distance_km"
                ),

            "status":
                location.get(
                    "status"
                ),

            "applied_to_score":
                location["applied_to_score"],
        },

        "seniority": {
            "weight":
                weights["seniority"],

            "percentage":
                seniority["percentage"],

            "score": 0,

            "reason":
                seniority["reason"],

            "applied_to_score": False,
        },

        "certifications": {
            "weight":
                weights["certifications"],

            "percentage":
                certifications["percentage"],

            "score":
                component_score(
                    certifications["percentage"],
                    weights["certifications"],
                )
                if jd_has_certifications
                else 0,

            "matched":
                certifications["matched"],

            "missing":
                certifications["missing"],

            "applied_to_score": jd_has_certifications,
        },
    }

    active_weight = sum(
        item["weight"]
        for item in breakdown.values()
        if item.get("applied_to_score", True)
    )

    raw_score = sum(
        item["score"]
        for item in breakdown.values()
    )

    final_score = round(
        (raw_score / active_weight) * 100,
        2,
    ) if active_weight else 0

    final_score += role_family_boost

    if (
        candidate_exp >= 10
        and final_score >= 78
    ):
        final_score = max(
            final_score,
            88,
        )

    if (
        candidate_exp >= 5
        and same_role_family(
            jd_title,
            resume_title,
        )
        and final_score >= 72
    ):
        final_score = max(
            final_score,
            84,
        )

    final_score = clamp(final_score)

    join_probability = (
        calculate_join_probability(
            breakdown
        )
    )

    return {
        "final_score":
            final_score,

        "score_out_of":
            100,

        "best_suited":
            calculate_best_suited_label(
                final_score
            ),

        "breakdown":
            breakdown,

        "matched_skills": [
            item["required"]
            for item
            in skills["matched"]
        ],

        "missing_skills":
            skills["missing"],

        "join_probability":
            join_probability,

        "deterministic":
            True,
    }