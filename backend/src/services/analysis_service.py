from datetime import datetime, timezone
from uuid import uuid4

from fastapi import UploadFile

from src.services.processing_service import (
    process_jd_file,
    process_resume_file,
)

from src.services.comparison_builder import (
    build_matrix_item,
)

from src.services.ranking_service import (
    get_ranked_candidates,
    get_ranked_jobs,
    validate_comparison_mode,
)

from src.utils.db_handler import db_handler


async def analyze_universal_comparison(
    recruiter_id: str,
    comparison_mode: str,
    jd_files: list[UploadFile],
    resume_files: list[UploadFile],
) -> dict:

    mode = validate_comparison_mode(
        comparison_mode,
        len(jd_files),
        len(resume_files),
    )

    analysis_id = str(uuid4())

    # =========================
    # Process JDs
    # =========================

    processed_jds = []

    for index, jd_file in enumerate(jd_files):
        processed_jds.append(
            await process_jd_file(
                recruiter_id=recruiter_id,
                analysis_id=analysis_id,
                jd_file=jd_file,
                index=index,
            )
        )

    # =========================
    # Process Resumes
    # =========================

    processed_resumes = []

    for index, resume_file in enumerate(resume_files):
        processed_resumes.append(
            await process_resume_file(
                recruiter_id=recruiter_id,
                analysis_id=analysis_id,
                resume_file=resume_file,
                index=index,
            )
        )

    # =========================
    # Build Full Matrix
    # =========================

    matrix = []

    for jd_item in processed_jds:
        for resume_item in processed_resumes:
            matrix.append(
                build_matrix_item(
                    jd_item=jd_item,
                    resume_item=resume_item,
                )
            )

    # =========================
    # Rankings
    # =========================

    ranked_candidates = get_ranked_candidates(
        matrix
    )

    ranked_jobs = get_ranked_jobs(
        matrix
    )

    # =========================
    # Mode-Aware Primary Results
    # =========================

    if mode == "single_jd_multiple_cv":
        primary_results = ranked_candidates

    elif mode == "multiple_jd_single_cv":
        primary_results = ranked_jobs

    else:
        # multiple_jd_multiple_cv
        # Example:
        # 2 JD × 2 CV = 4 results
        # 5 JD × 5 CV = 25 results
        primary_results = matrix

    # =========================
    # Save Analysis
    # =========================

    analysis_doc = {
        "analysis_id": analysis_id,
        "recruiter_id": recruiter_id,
        "comparison_mode": mode,

        "jd_file_name": (
            processed_jds[0]["file_name"]
            if processed_jds
            else None
        ),

        "jd_file_names": [
            item["file_name"]
            for item in processed_jds
        ],

        "resume_file_names": [
            item["file_name"]
            for item in processed_resumes
        ],

        "jd_language_name": (
            processed_jds[0]["language_name"]
            if processed_jds
            else None
        ),

        "total_jds": len(processed_jds),
        "total_resumes": len(processed_resumes),
        "total_comparisons": len(matrix),

        "jds": processed_jds,
        "resumes": processed_resumes,

        # Always full comparison table.
        "matrix": matrix,

        # Frontend should prefer this for display.
        "primary_results": primary_results,

        # Backward compatibility for existing frontend.
        "results": primary_results,

        "ranked_candidates": ranked_candidates,
        "ranked_jobs": ranked_jobs,

        "deterministic": True,
        "created_at": datetime.now(timezone.utc),
    }

    await db_handler.analyses.insert_one(
        analysis_doc
    )

    return {
        "analysis_id": analysis_id,
        "comparison_mode": mode,

        "total_jds": len(processed_jds),
        "total_resumes": len(processed_resumes),
        "total_comparisons": len(matrix),

        "jds": processed_jds,
        "resumes": processed_resumes,

        # Always full all-vs-all comparison.
        "matrix": matrix,

        # Mode-aware result.
        "primary_results": primary_results,

        # Backward compatibility.
        "results": primary_results,

        "ranked_candidates": ranked_candidates,
        "ranked_jobs": ranked_jobs,

        "deterministic": True,
        "message": "Universal AI-assisted deterministic comparison completed successfully.",
    }


async def analyze_jd_with_resumes(
    recruiter_id: str,
    jd_file: UploadFile,
    resume_files: list[UploadFile],
) -> dict:

    result = await analyze_universal_comparison(
        recruiter_id=recruiter_id,
        comparison_mode="single_jd_multiple_cv",
        jd_files=[jd_file],
        resume_files=resume_files,
    )

    first_jd = (
        result["jds"][0]
        if result["jds"]
        else {}
    )

    return {
        "analysis_id": result["analysis_id"],

        "jd": {
            "file_name": first_jd.get("file_name"),
            "detected_language": first_jd.get("detected_language"),
            "language_name": first_jd.get("language_name"),
            "parser_source": first_jd.get("parser_source"),
            "ai_provider": first_jd.get("ai_provider"),
            "parsed_jd": first_jd.get("parsed_jd"),
            "original_text": first_jd.get("original_text"),
            "english_text": first_jd.get("english_text"),
        },

        "total_resumes": result["total_resumes"],
        "total_comparisons": result["total_comparisons"],

        "primary_results": result["primary_results"],
        "results": result["results"],

        "ranked_candidates": result["ranked_candidates"],
        "matrix": result["matrix"],

        "deterministic": True,
        "message": "AI-assisted multilingual deterministic comparison completed successfully.",
    }