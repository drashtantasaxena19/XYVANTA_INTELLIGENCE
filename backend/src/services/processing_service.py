from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from fastapi import UploadFile

from src.ai.cleanup_engine import (
    ai_parse_jd,
    ai_parse_resume,
)

from src.engines.extraction.text_extractor import (
    save_upload_file,
    extract_text,
)

from src.engines.extraction.jd_parser import parse_jd
from src.engines.extraction.resume_parser import parse_resume

from src.engines.normalization.language_normalizer import (
    normalize_multilingual_text,
)

from src.services.geocoding_service import (
    get_location_geo_data,
)

from src.utils.db_handler import db_handler


UPLOAD_DIR = Path("uploads")


def normalize_ai_jd_for_score(
    ai_data: dict[str, Any],
) -> dict[str, Any]:
    return {
        "title": ai_data.get("job_title"),
        "company_name": ai_data.get("company_name"),

        "required_skills":
            (ai_data.get("required_skills") or [])
            + (ai_data.get("good_to_have_skills") or []),

        "must_have_skills":
            ai_data.get("required_skills") or [],

        "good_to_have_skills":
            ai_data.get("good_to_have_skills") or [],

        "required_experience_years":
            ai_data.get("required_experience_years") or 0,

        "maximum_experience_years":
            ai_data.get("maximum_experience_years") or 0,

        "required_education":
            ai_data.get("required_education") or [],

        "responsibilities":
            ai_data.get("responsibilities") or [],

        "location":
            ai_data.get("location"),

        "preferred_candidate_location":
            ai_data.get("preferred_candidate_location"),

        "mode":
            ai_data.get("mode"),

        "salary":
            ai_data.get("salary"),

        "notice_period":
            ai_data.get("notice_period"),

        "employment_type":
            ai_data.get("employment_type"),

        "contract_to_hire":
            ai_data.get("contract_to_hire") or False,

        "certifications":
            ai_data.get("certifications") or [],

        "required_languages":
            ai_data.get("languages") or [],
    }


def normalize_ai_resume_for_score(
    ai_data: dict[str, Any],
) -> dict[str, Any]:
    return {
        "name":
            ai_data.get("name"),

        "email":
            ai_data.get("email"),

        "phone":
            ai_data.get("phone"),

        "location":
            ai_data.get("current_location")
            or ai_data.get("location"),

        "current_location":
            ai_data.get("current_location")
            or ai_data.get("location"),

        "preferred_location":
            ai_data.get("preferred_location"),

        "address":
            ai_data.get("address"),

        "permanent_address":
            ai_data.get("permanent_address"),

        "current_position":
            ai_data.get("current_position"),

        "target_role":
            ai_data.get("target_role"),

        "skills":
            ai_data.get("skills") or [],

        "education":
            ai_data.get("education") or [],

        "experience_years":
            ai_data.get("total_experience_years") or 0,

        "certifications":
            ai_data.get("certifications") or [],

        "languages":
            ai_data.get("languages") or [],

        "expected_salary":
            ai_data.get("expected_salary"),

        "notice_period":
            ai_data.get("notice_period"),

        "employment_type":
            ai_data.get("employment_type"),

        "projects":
            ai_data.get("projects") or [],

        "work_experience":
            ai_data.get("work_experience") or [],
    }


async def parse_jd_with_ai_or_fallback(
    text: str,
) -> tuple[dict[str, Any], str]:
    ai_result = await ai_parse_jd(text)

    if ai_result and ai_result.get("data"):
        parsed = normalize_ai_jd_for_score(
            ai_result["data"]
        )

        parsed["ai_provider"] = (
            ai_result.get("provider")
        )

        parsed["parser_source"] = "ai"

        return parsed, "ai"

    fallback = parse_jd(text)

    fallback["parser_source"] = "fallback"
    fallback["ai_provider"] = None

    return fallback, "fallback"


async def parse_resume_with_ai_or_fallback(
    text: str,
) -> tuple[dict[str, Any], str]:
    ai_result = await ai_parse_resume(text)

    if ai_result and ai_result.get("data"):
        parsed = normalize_ai_resume_for_score(
            ai_result["data"]
        )

        parsed["ai_provider"] = (
            ai_result.get("provider")
        )

        parsed["parser_source"] = "ai"

        return parsed, "ai"

    fallback = parse_resume(text)

    fallback["parser_source"] = "fallback"
    fallback["ai_provider"] = None

    return fallback, "fallback"


async def process_jd_file(
    recruiter_id: str,
    analysis_id: str,
    jd_file: UploadFile,
    index: int,
) -> dict[str, Any]:
    jd_path = await save_upload_file(
        jd_file,
        UPLOAD_DIR
        / analysis_id
        / "jds"
        / jd_file.filename,
    )

    raw_text = extract_text(str(jd_path))

    language = normalize_multilingual_text(
        raw_text,
    )

    parsed, parser_source = (
        await parse_jd_with_ai_or_fallback(
            language["english_text"],
        )
    )

    parsed["location_geo"] = (
        await get_location_geo_data(
            parsed.get("location"),
        )
    )

    jd_id = (
        f"jd_{index + 1}_{uuid4().hex[:8]}"
    )

    jd_doc = {
        "jd_id": jd_id,
        "analysis_id": analysis_id,
        "recruiter_id": recruiter_id,
        "file_name": jd_file.filename,
        "file_path": str(jd_path),
        "detected_language":
            language["detected_language"],
        "language_name":
            language["language_name"],
        "original_text":
            language["original_text"],
        "english_text":
            language["english_text"],
        "parser_source":
            parser_source,
        "ai_provider":
            parsed.get("ai_provider"),
        "parsed":
            parsed,
        "created_at":
            datetime.now(timezone.utc),
    }

    await db_handler.jds.insert_one(
        jd_doc,
    )

    return {
        "jd_id": jd_id,
        "file_name": jd_file.filename,
        "detected_language":
            language["detected_language"],
        "language_name":
            language["language_name"],
        "parser_source":
            parser_source,
        "ai_provider":
            parsed.get("ai_provider"),
        "parsed_jd":
            parsed,
        "original_text":
            language["original_text"],
        "english_text":
            language["english_text"],
    }


async def process_resume_file(
    recruiter_id: str,
    analysis_id: str,
    resume_file: UploadFile,
    index: int,
) -> dict[str, Any]:
    resume_path = await save_upload_file(
        resume_file,
        UPLOAD_DIR
        / analysis_id
        / "resumes"
        / resume_file.filename,
    )

    raw_text = extract_text(
        str(resume_path),
    )

    language = normalize_multilingual_text(
        raw_text,
    )

    parsed, parser_source = (
        await parse_resume_with_ai_or_fallback(
            language["english_text"],
        )
    )

    parsed["location_geo"] = (
        await get_location_geo_data(
            parsed.get("location"),
        )
    )

    preferred_location = (
        parsed.get("preferred_location")
    )

    if preferred_location:
        parsed["preferred_location_geo"] = (
            await get_location_geo_data(
                preferred_location,
            )
        )

    resume_id = (
        f"resume_{index + 1}_{uuid4().hex[:8]}"
    )

    resume_doc = {
        "resume_id": resume_id,
        "analysis_id": analysis_id,
        "recruiter_id": recruiter_id,
        "file_name": resume_file.filename,
        "file_path": str(resume_path),
        "detected_language":
            language["detected_language"],
        "language_name":
            language["language_name"],
        "original_text":
            language["original_text"],
        "english_text":
            language["english_text"],
        "parser_source":
            parser_source,
        "ai_provider":
            parsed.get("ai_provider"),
        "parsed":
            parsed,
        "created_at":
            datetime.now(timezone.utc),
    }

    await db_handler.resumes.insert_one(
        resume_doc,
    )

    return {
        "resume_id": resume_id,
        "file_name": resume_file.filename,
        "candidate_name":
            parsed.get("name"),
        "email":
            parsed.get("email"),
        "phone":
            parsed.get("phone"),
        "detected_language":
            language["detected_language"],
        "language_name":
            language["language_name"],
        "parser_source":
            parser_source,
        "ai_provider":
            parsed.get("ai_provider"),
        "parsed_resume":
            parsed,
        "original_text":
            language["original_text"],
        "english_text":
            language["english_text"],
    }