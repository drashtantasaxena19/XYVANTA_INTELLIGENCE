from typing import Any

from src.engines.normalization.skill_normalizer import (
    normalize_skill_list,
)


def safe_list(value: Any) -> list:
    if isinstance(value, list):
        return [item for item in value if item not in ["", None]]

    if isinstance(value, str) and value.strip():
        return [value.strip()]

    return []


def safe_number(value: Any) -> float:
    try:
        return float(value or 0)
    except Exception:
        return 0


def safe_string(value: Any) -> str | None:
    if value in ["", None, "null", "None"]:
        return None

    return str(value).strip()


def clean_skills(value: Any) -> list[str]:
    return normalize_skill_list(
        safe_list(value)
    )


def merge_resume_schema(data: dict) -> dict:
    current_location = (
        data.get("current_location")
        or data.get("location")
    )

    return {
        "name": safe_string(data.get("name")),
        "email": safe_string(data.get("email")),
        "phone": safe_string(data.get("phone")),

        "location": safe_string(current_location),
        "current_location": safe_string(current_location),
        "preferred_location": safe_string(data.get("preferred_location")),

        "address": safe_string(data.get("address")),
        "permanent_address": safe_string(data.get("permanent_address")),

        "current_position": safe_string(data.get("current_position")),
        "target_role": safe_string(data.get("target_role")),

        "total_experience_years": safe_number(
            data.get("total_experience_years")
        ),

        # Role/title contamination removed here.
        "skills": clean_skills(data.get("skills")),

        "education": safe_list(data.get("education")),
        "certifications": safe_list(data.get("certifications")),
        "languages": safe_list(data.get("languages")),

        "expected_salary": safe_string(data.get("expected_salary")),
        "notice_period": safe_string(data.get("notice_period")),
        "employment_type": safe_string(data.get("employment_type")),

        "projects": safe_list(data.get("projects")),
        "work_experience": safe_list(data.get("work_experience")),
    }


def merge_jd_schema(data: dict) -> dict:
    return {
        "job_title": safe_string(data.get("job_title")),
        "title": safe_string(
            data.get("title")
            or data.get("job_title")
        ),

        "company_name": safe_string(data.get("company_name")),
        "location": safe_string(data.get("location")),
        "preferred_candidate_location": safe_string(
            data.get("preferred_candidate_location")
        ),

        "mode": safe_string(data.get("mode")),
        "employment_type": safe_string(data.get("employment_type")),
        "contract_to_hire": bool(data.get("contract_to_hire", False)),

        "required_experience_years": safe_number(
            data.get("required_experience_years")
        ),
        "maximum_experience_years": safe_number(
            data.get("maximum_experience_years")
        ),

        "salary": safe_string(data.get("salary")),
        "notice_period": safe_string(data.get("notice_period")),

        # Role/title contamination removed here also.
        "required_skills": clean_skills(data.get("required_skills")),
        "good_to_have_skills": clean_skills(data.get("good_to_have_skills")),

        "required_education": safe_list(data.get("required_education")),
        "certifications": safe_list(data.get("certifications")),
        "languages": safe_list(data.get("languages")),
        "responsibilities": safe_list(data.get("responsibilities")),
    }