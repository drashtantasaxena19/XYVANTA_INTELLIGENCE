from typing import Any


ACTION_LABELS = {
    "shortlisted": 1,
    "hold": 0.5,
    "rejected": 0,
    "manual_score_correction": None,
}


def safe_number(value: Any) -> float:
    try:
        return float(value or 0)
    except Exception:
        return 0.0


def prepare_training_row(
    analysis: dict[str, Any],
    feedback: dict[str, Any],
) -> dict[str, Any]:
    score_breakdown = (
        analysis.get("score_breakdown")
        or analysis.get("breakdown")
        or {}
    )

    join_probability = (
        analysis.get("join_probability")
        or {}
    )

    return {
        "analysis_id": feedback.get("analysis_id"),
        "resume_id": feedback.get("resume_id"),
        "action": feedback.get("action"),
        "action_label": ACTION_LABELS.get(feedback.get("action")),
        "manual_score": feedback.get("manual_score"),
        "deterministic_score": safe_number(
            analysis.get("final_score")
        ),
        "skills_score": safe_number(
            score_breakdown.get("skills", {}).get("percentage")
        ),
        "experience_score": safe_number(
            score_breakdown.get("experience", {}).get("percentage")
        ),
        "role_score": safe_number(
            score_breakdown.get("role", {}).get("percentage")
        ),
        "education_score": safe_number(
            score_breakdown.get("education", {}).get("percentage")
        ),
        "location_score": safe_number(
            score_breakdown.get("location_mode", {}).get("percentage")
        ),
        "join_probability": safe_number(
            join_probability.get("percentage")
        ),
        "matched_skills_count": len(
            analysis.get("matched_skills", [])
        ),
        "missing_skills_count": len(
            analysis.get("missing_skills", [])
        ),
    }


def build_training_rows_from_feedback(
    feedback_docs: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    rows = []

    for feedback in feedback_docs:
        candidate_result = feedback.get("candidate_result")

        if not candidate_result:
            continue

        rows.append(
            prepare_training_row(
                analysis=candidate_result,
                feedback=feedback,
            )
        )

    return rows


def predict_rerank_boost(
    candidate_result: dict[str, Any],
) -> float:
    """
    Future ML reranker placeholder.

    Important:
    - ML must NOT replace deterministic score.
    - ML can only suggest a small boost/penalty.
    - Final recruiter report must remain explainable.
    """

    join_probability = candidate_result.get("join_probability") or {}
    probability = safe_number(join_probability.get("percentage"))

    if probability >= 85:
        return 2.0

    if probability >= 70:
        return 1.0

    if probability <= 35:
        return -1.0

    return 0.0