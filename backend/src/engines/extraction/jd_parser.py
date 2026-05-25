import re

from src.engines.extraction.section_detector import (
    detect_jd_sections,
)

from src.engines.normalization.skill_normalizer import (
    normalize_skill_list,
)


def extract_skills(
    skills_text: str,
) -> list[str]:

    if not skills_text:
        return []

    separators = r"[,•|\n;]"

    raw = re.split(
        separators,
        skills_text,
    )

    skills = []

    for item in raw:
        cleaned = item.strip()

        if cleaned and len(cleaned) > 1:
            skills.append(cleaned)

    return normalize_skill_list(skills)


def extract_experience(
    text: str,
) -> int:

    lower = text.lower()

    patterns = [
        r"(\d+)\s*[-–]\s*\d+\s*(?:years|yrs)",
        r"(\d+)\s+to\s+\d+\s*(?:years|yrs)",
        r"minimum\s+(\d+)",
        r"min\.?\s+(\d+)",
        r"(\d+)\+?\s*(?:years|yrs)",
    ]

    for pattern in patterns:
        match = re.search(pattern, lower)

        if match:
            return int(match.group(1))

    return 0


def parse_jd(
    text: str,
) -> dict:

    sections = detect_jd_sections(text)

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    title = lines[0] if lines else None

    skills = extract_skills(
        sections.get("skills", "")
    )

    requirements = extract_skills(
        sections.get("requirements", "")
    )

    merged_skills = list(
        dict.fromkeys(skills + requirements)
    )

    responsibilities = [
        item.strip()
        for item in sections.get(
            "responsibilities",
            "",
        ).split("\n")
        if item.strip()
    ]

    return {
        "title": title,
        "job_title": title,
        "required_skills": merged_skills,
        "must_have_skills": merged_skills,
        "good_to_have_skills": [],
        "required_experience_years": extract_experience(text),
        "maximum_experience_years": 0,
        "required_education": [],
        "responsibilities": responsibilities,
        "location": None,
        "mode": None,
        "salary": None,
        "notice_period": None,
        "employment_type": None,
        "contract_to_hire": False,
        "certifications": [],
        "required_languages": [],
        "languages": [],
        "parser_type": "deterministic_fallback",
    }