from fastapi import APIRouter, Depends, File, Form, Query, UploadFile

from src.core.security import require_role
from src.services.analysis_service import (
    analyze_jd_with_resumes,
    analyze_universal_comparison,
)
from src.services.analysis_delete_service import (
    delete_analysis_by_owner,
    clear_recruiter_analysis_history,
)
from src.utils.db_handler import db_handler
from src.utils.response_handler import success_response
from src.schemas.analysis_schema import FeedbackRequest
from src.engines.learning.feedback_collector import (
    save_recruiter_feedback,
    get_recruiter_candidate_decisions,
    delete_recruiter_candidate_decision,
    clear_recruiter_candidate_decisions,
)


router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
)


@router.post("/compare")
async def compare_jds_and_resumes(
    comparison_mode: str = Form(...),
    jd_files: list[UploadFile] = File(...),
    resume_files: list[UploadFile] = File(...),
    current_user=Depends(require_role("recruiter")),
):
    result = await analyze_universal_comparison(
        recruiter_id=current_user["user"]["_id"],
        comparison_mode=comparison_mode,
        jd_files=jd_files,
        resume_files=resume_files,
    )

    return success_response(
        "Universal comparison completed successfully",
        result,
    )


@router.post("/jd-resumes")
async def analyze_jd_resumes(
    jd_file: UploadFile = File(...),
    resume_files: list[UploadFile] = File(...),
    current_user=Depends(require_role("recruiter")),
):
    result = await analyze_jd_with_resumes(
        recruiter_id=current_user["user"]["_id"],
        jd_file=jd_file,
        resume_files=resume_files,
    )

    return success_response(
        "Analysis completed successfully",
        result,
    )


@router.get("/history")
async def get_analysis_history(
    current_user=Depends(require_role("recruiter")),
):
    recruiter_id = current_user["user"]["_id"]

    cursor = db_handler.analyses.find(
        {"recruiter_id": recruiter_id},
        {
            "_id": 0,
            "analysis_id": 1,
            "comparison_mode": 1,
            "jd_file_name": 1,
            "jd_file_names": 1,
            "resume_file_names": 1,
            "jd_language_name": 1,
            "total_jds": 1,
            "total_resumes": 1,
            "total_comparisons": 1,
            "created_at": 1,
            "primary_results.jd_id": 1,
            "primary_results.resume_id": 1,
            "primary_results.final_score": 1,
            "primary_results.candidate_name": 1,
            "primary_results.jd_title": 1,
            "primary_results.jd_file_name": 1,
            "primary_results.resume_file_name": 1,
            "primary_results.current_decision": 1,
            "results.jd_id": 1,
            "results.resume_id": 1,
            "results.final_score": 1,
            "results.candidate_name": 1,
            "results.jd_title": 1,
            "results.jd_file_name": 1,
            "results.resume_file_name": 1,
            "results.current_decision": 1,
            "matrix.jd_id": 1,
            "matrix.resume_id": 1,
            "matrix.final_score": 1,
            "matrix.candidate_name": 1,
            "matrix.jd_title": 1,
            "matrix.jd_file_name": 1,
            "matrix.resume_file_name": 1,
            "matrix.current_decision": 1,
            "ranked_candidates.resume_id": 1,
            "ranked_candidates.candidate_name": 1,
            "ranked_candidates.final_score": 1,
            "ranked_candidates.jd_id": 1,
            "ranked_candidates.jd_title": 1,
            "ranked_candidates.jd_file_name": 1,
            "ranked_candidates.resume_file_name": 1,
            "ranked_candidates.current_decision": 1,
        },
    ).sort("created_at", -1)

    history = await cursor.to_list(length=50)

    return success_response(
        "Analysis history fetched successfully",
        history,
    )


@router.get("/feedback/decisions")
async def get_feedback_decisions(
    jd_id: str | None = Query(default=None),
    action: str | None = Query(default=None),
    current_user=Depends(require_role("recruiter")),
):
    recruiter_id = current_user["user"]["_id"]

    decisions = await get_recruiter_candidate_decisions(
        recruiter_id=recruiter_id,
        jd_id=jd_id,
        action=action,
    )

    return success_response(
        "Candidate decisions fetched successfully",
        decisions,
    )


@router.delete("/feedback/decision")
async def delete_feedback_decision(
    analysis_id: str = Query(...),
    resume_id: str = Query(...),
    jd_id: str | None = Query(default=None),
    current_user=Depends(require_role("recruiter")),
):
    result = await delete_recruiter_candidate_decision(
        recruiter_id=current_user["user"]["_id"],
        analysis_id=analysis_id,
        resume_id=resume_id,
        jd_id=jd_id,
    )

    return success_response(
        result["message"],
        result.get("data"),
    )


@router.delete("/feedback/decisions/clear")
async def clear_feedback_decisions(
    action: str | None = Query(default=None),
    jd_id: str | None = Query(default=None),
    current_user=Depends(require_role("recruiter")),
):
    result = await clear_recruiter_candidate_decisions(
        recruiter_id=current_user["user"]["_id"],
        action=action,
        jd_id=jd_id,
    )

    return success_response(
        result["message"],
        result.get("data"),
    )


@router.delete("/history/clear")
async def clear_analysis_history(
    current_user=Depends(require_role("recruiter")),
):
    recruiter_id = current_user["user"]["_id"]

    return await clear_recruiter_analysis_history(
        recruiter_id=recruiter_id,
    )


@router.get("/{analysis_id}")
async def get_analysis_detail(
    analysis_id: str,
    current_user=Depends(require_role("recruiter")),
):
    recruiter_id = current_user["user"]["_id"]

    analysis = await db_handler.analyses.find_one(
        {
            "analysis_id": analysis_id,
            "recruiter_id": recruiter_id,
        },
        {"_id": 0},
    )

    if not analysis:
        return success_response(
            "Analysis not found",
            None,
        )

    decisions = await get_recruiter_candidate_decisions(
        recruiter_id=recruiter_id,
    )

    decision_map = {}

    for decision in decisions:
        key = (
            decision.get("analysis_id"),
            decision.get("jd_id"),
            decision.get("resume_id"),
        )

        decision_map[key] = decision.get("action")

    for container_name in [
        "primary_results",
        "results",
        "matrix",
        "ranked_candidates",
        "ranked_jobs",
    ]:
        container = analysis.get(container_name, [])

        for item in container:
            key = (
                analysis_id,
                item.get("jd_id"),
                item.get("resume_id"),
            )

            item["current_decision"] = decision_map.get(key)

    return success_response(
        "Analysis detail fetched successfully",
        analysis,
    )


@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: str,
    current_user=Depends(require_role("recruiter")),
):
    recruiter_id = current_user["user"]["_id"]

    return await delete_analysis_by_owner(
        analysis_id=analysis_id,
        recruiter_id=recruiter_id,
    )


@router.post("/feedback")
async def submit_feedback(
    payload: FeedbackRequest,
    current_user=Depends(require_role("recruiter")),
):
    result = await save_recruiter_feedback(
        recruiter_id=current_user["user"]["_id"],
        analysis_id=payload.analysis_id,
        resume_id=payload.resume_id,
        action=payload.action,
        notes=payload.notes,
        manual_score=payload.manual_score,
    )

    return success_response(
        result["message"],
        result.get("data"),
    )