from datetime import datetime, timezone

from src.utils.db_handler import db_handler
from src.utils.response_handler import (
    error_response,
    success_response,
)


async def delete_analysis_by_owner(
    analysis_id: str,
    recruiter_id: str,
):
    analysis = await db_handler.analyses.find_one(
        {
            "analysis_id": analysis_id,
            "recruiter_id": recruiter_id,
        }
    )

    if not analysis:
        return error_response(
            "Analysis report not found or access denied",
        )

    return await _delete_analysis_data(
        analysis_id=analysis_id,
    )


async def clear_recruiter_analysis_history(
    recruiter_id: str,
):
    analyses = await db_handler.analyses.find(
        {
            "recruiter_id": recruiter_id,
        }
    ).to_list(length=None)

    if not analyses:
        return success_response(
            "No analysis history found",
            {
                "deleted_analyses": 0,
            },
        )

    deleted_count = 0

    for analysis in analyses:
        analysis_id = analysis.get("analysis_id")

        if not analysis_id:
            continue

        await _delete_analysis_data(
            analysis_id=analysis_id,
        )

        deleted_count += 1

    return success_response(
        "Analysis history cleared successfully",
        {
            "deleted_analyses": deleted_count,
        },
    )


async def admin_delete_analysis(
    analysis_id: str,
):
    analysis = await db_handler.analyses.find_one(
        {
            "analysis_id": analysis_id,
        }
    )

    if not analysis:
        return error_response(
            "Analysis report not found",
        )

    return await _delete_analysis_data(
        analysis_id=analysis_id,
    )


async def admin_clear_all_analyses():
    analyses = await db_handler.analyses.find(
        {}
    ).to_list(length=None)

    if not analyses:
        return success_response(
            "No analyses found",
            {
                "deleted_analyses": 0,
            },
        )

    deleted_count = 0

    for analysis in analyses:
        analysis_id = analysis.get("analysis_id")

        if not analysis_id:
            continue

        await _delete_analysis_data(
            analysis_id=analysis_id,
        )

        deleted_count += 1

    return success_response(
        "All analyses cleared successfully",
        {
            "deleted_analyses": deleted_count,
        },
    )


async def _delete_analysis_data(
    analysis_id: str,
):
    analysis_delete_result = (
        await db_handler.analyses.delete_one(
            {
                "analysis_id": analysis_id,
            }
        )
    )

    jd_delete_result = (
        await db_handler.jds.delete_many(
            {
                "analysis_id": analysis_id,
            }
        )
    )

    resume_delete_result = (
        await db_handler.resumes.delete_many(
            {
                "analysis_id": analysis_id,
            }
        )
    )

    feedback_delete_result = (
        await db_handler.feedback.delete_many(
            {
                "analysis_id": analysis_id,
            }
        )
    )

    return success_response(
        "Analysis deleted successfully",
        {
            "analysis_id": analysis_id,
            "deleted": {
                "analyses": (
                    analysis_delete_result.deleted_count
                ),
                "jds": (
                    jd_delete_result.deleted_count
                ),
                "resumes": (
                    resume_delete_result.deleted_count
                ),
                "feedback": (
                    feedback_delete_result.deleted_count
                ),
            },
            "deleted_at": datetime.now(
                timezone.utc
            ),
        },
    )