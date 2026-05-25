from datetime import datetime, timezone
from typing import Any

from src.utils.db_handler import db_handler


VALID_ACTIONS = {
    "shortlisted",
    "rejected",
    "hold",
    "manual_score_correction",
}

DECISION_ACTIONS = {
    "shortlisted",
    "rejected",
    "hold",
}


async def find_candidate_analysis_result(
    analysis_id: str,
    resume_id: str,
    jd_id: str | None = None,
) -> dict[str, Any] | None:
    analysis = await db_handler.analyses.find_one(
        {"analysis_id": analysis_id},
        {"_id": 0},
    )

    if not analysis:
        return None

    containers = [
        analysis.get("primary_results", []),
        analysis.get("results", []),
        analysis.get("matrix", []),
        analysis.get("ranked_candidates", []),
        analysis.get("ranked_jobs", []),
    ]

    for container in containers:
        for item in container:
            resume_match = item.get("resume_id") == resume_id

            jd_match = True if not jd_id else item.get("jd_id") == jd_id

            if resume_match and jd_match:
                return item

    return None


async def save_recruiter_feedback(
    recruiter_id: str,
    analysis_id: str,
    resume_id: str,
    action: str,
    notes: str | None = None,
    manual_score: float | None = None,
) -> dict[str, Any]:
    if action not in VALID_ACTIONS:
        return {
            "success": False,
            "message": "Invalid feedback action.",
        }

    if action == "manual_score_correction" and manual_score is None:
        return {
            "success": False,
            "message": ("Manual score is required for score correction."),
        }

    if manual_score is not None and not (0 <= manual_score <= 100):
        return {
            "success": False,
            "message": ("Manual score must be between 0 and 100."),
        }

    candidate_result = await find_candidate_analysis_result(
        analysis_id=analysis_id,
        resume_id=resume_id,
    )

    if not candidate_result:
        return {
            "success": False,
            "message": ("Candidate result not found for this analysis."),
        }

    jd_id = candidate_result.get("jd_id")

    now = datetime.now(timezone.utc)

    feedback_doc = {
        "recruiter_id": recruiter_id,
        "analysis_id": analysis_id,
        "resume_id": resume_id,
        "jd_id": jd_id,
        "action": action,
        "notes": notes,
        "manual_score": manual_score,
        "candidate_result": candidate_result,
        "deterministic_score": (candidate_result.get("final_score")),
        "updated_at": now,
    }

    if action in DECISION_ACTIONS:
        existing = await db_handler.feedback.find_one(
            {
                "recruiter_id": recruiter_id,
                "analysis_id": analysis_id,
                "resume_id": resume_id,
                "jd_id": jd_id,
                "action": {
                    "$in": list(DECISION_ACTIONS),
                },
            }
        )

        if existing:
            feedback_doc["created_at"] = existing.get("created_at") or now

            await db_handler.feedback.update_one(
                {"_id": existing["_id"]},
                {"$set": feedback_doc},
            )

        else:
            feedback_doc["created_at"] = now

            await db_handler.feedback.insert_one(feedback_doc)

    else:
        feedback_doc["created_at"] = now

        await db_handler.feedback.insert_one(feedback_doc)

    latest_feedback = await db_handler.feedback.find_one(
        {
            "recruiter_id": recruiter_id,
            "analysis_id": analysis_id,
            "resume_id": resume_id,
            "jd_id": jd_id,
            "action": action,
        },
        {"_id": 0},
    )

    return {
        "success": True,
        "message": "Feedback saved successfully.",
        "data": latest_feedback,
    }


async def get_candidate_current_decision(
    recruiter_id: str,
    analysis_id: str,
    resume_id: str,
    jd_id: str | None = None,
) -> str | None:
    query: dict[str, Any] = {
        "recruiter_id": recruiter_id,
        "analysis_id": analysis_id,
        "resume_id": resume_id,
        "action": {
            "$in": list(DECISION_ACTIONS),
        },
    }

    if jd_id:
        query["jd_id"] = jd_id

    item = await db_handler.feedback.find_one(
        query,
        {
            "_id": 0,
            "action": 1,
        },
        sort=[("updated_at", -1)],
    )

    if not item:
        return None

    return item.get("action")


async def get_recruiter_candidate_decisions(
    recruiter_id: str,
    jd_id: str | None = None,
    action: str | None = None,
) -> list[dict[str, Any]]:
    query: dict[str, Any] = {
        "recruiter_id": recruiter_id,
        "action": {
            "$in": list(DECISION_ACTIONS),
        },
    }

    if jd_id:
        query["jd_id"] = jd_id

    if action:
        if action not in DECISION_ACTIONS:
            return []

        query["action"] = action

    cursor = db_handler.feedback.find(
        query,
        {"_id": 0},
    ).sort("updated_at", -1)

    feedback_items = await cursor.to_list(
        length=500,
    )

    decisions: list[dict[str, Any]] = []

    for item in feedback_items:
        candidate = item.get("candidate_result") or {}

        decisions.append(
            {
                "analysis_id": item.get("analysis_id"),
                "jd_id": (item.get("jd_id") or candidate.get("jd_id")),
                "jd_title": candidate.get("jd_title"),
                "jd_file_name": candidate.get("jd_file_name"),
                "resume_id": item.get("resume_id"),
                "resume_file_name": (
                    candidate.get("resume_file_name") or candidate.get("file_name")
                ),
                "candidate_name": (candidate.get("candidate_name")),
                "email": candidate.get("email"),
                "phone": candidate.get("phone"),
                "final_score": candidate.get("final_score"),
                "action": item.get("action"),
                "notes": item.get("notes"),
                "manual_score": item.get("manual_score"),
                "created_at": item.get("created_at"),
                "updated_at": item.get("updated_at"),
            }
        )

    return decisions


async def delete_recruiter_candidate_decision(
    recruiter_id: str,
    analysis_id: str,
    resume_id: str,
    jd_id: str | None = None,
) -> dict[str, Any]:
    query: dict[str, Any] = {
        "recruiter_id": recruiter_id,
        "analysis_id": analysis_id,
        "resume_id": resume_id,
        "action": {
            "$in": list(DECISION_ACTIONS),
        },
    }

    if jd_id:
        query["jd_id"] = jd_id

    result = await db_handler.feedback.delete_many(query)

    return {
        "success": True,
        "message": "Decision deleted successfully.",
        "data": {
            "deleted_count": result.deleted_count,
        },
    }


async def clear_recruiter_candidate_decisions(
    recruiter_id: str,
    action: str | None = None,
    jd_id: str | None = None,
) -> dict[str, Any]:
    query: dict[str, Any] = {
        "recruiter_id": recruiter_id,
        "action": {
            "$in": list(DECISION_ACTIONS),
        },
    }

    if action and action != "all":
        query["action"] = action

    if jd_id:
        query["jd_id"] = jd_id

    result = await db_handler.feedback.delete_many(query)

    return {
        "success": True,
        "message": "Decisions cleared successfully.",
        "data": {
            "deleted_count": result.deleted_count,
        },
    }
