from typing import Any

from src.engines.scoring.score_engine import (
    calculate_final_score,
)


def score_status(value: float) -> str:
    if value >= 85:
        return "excellent"

    if value >= 70:
        return "matched"

    if value >= 50:
        return "partial"

    return "weak"


def build_recruiter_summary(
    score_result: dict[str, Any],
) -> str:
    final_score = score_result.get("final_score", 0)
    breakdown = score_result.get("breakdown", {})

    role = breakdown.get("role", {}).get("percentage", 0)
    experience = breakdown.get("experience", {}).get("percentage", 0)
    skills = breakdown.get("skills", {}).get("percentage", 0)

    if final_score >= 90:
        return (
            "Best suited candidate with strong role alignment, "
            "high experience confidence and practical readiness."
        )

    if experience >= 85 and role >= 80:
        return (
            "Highly suitable candidate. Strong experience and related role "
            "background indicate low onboarding risk, even if some exact "
            "skills are not explicitly mentioned."
        )

    if final_score >= 80:
        return (
            "Strong candidate with good role and skill alignment. "
            "Recommended for recruiter review."
        )

    if skills < 50 and experience >= 85:
        return (
            "Experienced candidate with transferable background. "
            "Manual recruiter review recommended before rejection."
        )

    if final_score >= 60:
        return (
            "Potential match. Candidate may need skill or domain validation."
        )

    return (
        "Weak match based on current extracted JD and resume signals."
    )


def build_field_comparison(
    jd_parsed: dict[str, Any],
    resume_parsed: dict[str, Any],
    score_result: dict[str, Any],
) -> dict[str, Any]:

    return {
        "role_title": {
            "jd_value":
                jd_parsed.get("title")
                or jd_parsed.get("job_title"),

            "resume_value":
                resume_parsed.get("current_position")
                or resume_parsed.get("target_role"),

            "score":
                score_result["breakdown"]["role"]["percentage"],

            "status":
                score_status(
                    score_result["breakdown"]["role"]["percentage"]
                ),

            "reason":
                score_result["breakdown"]["role"]["reason"],
        },

        "skills": {
            "jd_value":
                jd_parsed.get("required_skills", []),

            "resume_value":
                resume_parsed.get("skills", []),

            "matched":
                score_result.get("matched_skills", []),

            "missing":
                score_result.get("missing_skills", []),

            "score":
                score_result["breakdown"]["skills"]["percentage"],

            "status":
                score_status(
                    score_result["breakdown"]["skills"]["percentage"]
                ),
        },

        "experience": {
            "jd_value":
                jd_parsed.get("required_experience_years"),

            "resume_value":
                resume_parsed.get("total_experience_years")
                or resume_parsed.get("experience_years"),

            "score":
                score_result["breakdown"]["experience"]["percentage"],

            "status":
                score_status(
                    score_result["breakdown"]["experience"]["percentage"]
                ),

            "reason":
                score_result["breakdown"]["experience"]["reason"],
        },

        "education": {
            "jd_value":
                jd_parsed.get("required_education", []),

            "resume_value":
                resume_parsed.get("education", []),

            "matched":
                score_result["breakdown"]["education"]["matched"],

            "missing":
                score_result["breakdown"]["education"]["missing"],

            "score":
                score_result["breakdown"]["education"]["percentage"],

            "status":
                score_status(
                    score_result["breakdown"]["education"]["percentage"]
                ),
        },

        "location_mode": {
            "jd_location":
                jd_parsed.get("location"),

            "resume_location":
                resume_parsed.get("preferred_location")
                or resume_parsed.get("current_location")
                or resume_parsed.get("location"),

            "score":
                score_result["breakdown"]["location_mode"]["percentage"],

            "distance_km":
                score_result["breakdown"]["location_mode"].get(
                    "distance_km"
                ),

            "status":
                score_result["breakdown"]["location_mode"].get(
                    "status"
                ),

            "reason":
                score_result["breakdown"]["location_mode"]["reason"],
        },
    }


def build_matrix_item(
    jd_item: dict[str, Any],
    resume_item: dict[str, Any],
) -> dict[str, Any]:

    jd_parsed = jd_item["parsed_jd"]
    resume_parsed = resume_item["parsed_resume"]

    score_result = calculate_final_score(
        jd_parsed,
        resume_parsed,
    )

    comparison = build_field_comparison(
        jd_parsed,
        resume_parsed,
        score_result,
    )

    recruiter_summary = build_recruiter_summary(
        score_result
    )

    return {
        "jd_id": jd_item["jd_id"],
        "jd_file_name": jd_item["file_name"],
        "jd_title": jd_parsed.get("title") or jd_parsed.get("job_title"),

        "resume_id": resume_item["resume_id"],
        "resume_file_name": resume_item["file_name"],

        "candidate_name": resume_item.get("candidate_name"),
        "email": resume_item.get("email"),
        "phone": resume_item.get("phone"),

        "final_score": score_result["final_score"],
        "best_suited": score_result.get("best_suited"),
        "recruiter_summary": recruiter_summary,

        "score_breakdown": score_result["breakdown"],
        "comparison": comparison,

        "matched_skills": score_result["matched_skills"],
        "missing_skills": score_result["missing_skills"],

        "join_probability": score_result.get("join_probability"),

        "deterministic": True,
    }