import re

from src.engines.extraction.section_detector import (
    detect_resume_sections,
)

from src.engines.normalization.skill_normalizer import (
    normalize_skill_list,
)


EMAIL_REGEX = (
    r"[a-zA-Z0-9._%+-]+@"
    r"[a-zA-Z0-9.-]+\."
    r"[a-zA-Z]{2,}"
)

PHONE_REGEX = (
    r"(\+?\d[\d\s\-]{7,15}\d)"
)


def extract_email(
    text: str,
) -> str | None:

    match = re.search(
        EMAIL_REGEX,
        text,
    )

    return match.group(0) if match else None


def extract_phone(
    text: str,
) -> str | None:

    match = re.search(
        PHONE_REGEX,
        text,
    )

    return match.group(0) if match else None


def extract_skills(
    skills_section: str,
) -> list[str]:

    if not skills_section:
        return []

    separators = r"[,•|\n;]"

    raw = re.split(
        separators,
        skills_section,
    )

    skills = []

    for item in raw:
        cleaned = item.strip()

        if cleaned and len(cleaned) > 1:
            skills.append(cleaned)

    return normalize_skill_list(skills)


def extract_education(
    education_section: str,
) -> list[str]:

    if not education_section:
        return []

    lines = [
        line.strip()
        for line
        in education_section.split("\n")
        if line.strip()
    ]

    return lines[:10]


def extract_experience_years(
    text: str,
) -> float:

    lower = text.lower()

    patterns = [
        r"total\s+experience\s*[:\-]?\s*(\d+(?:\.\d+)?)",
        r"experience\s*[:\-]?\s*(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)",
        r"(\d+(?:\.\d+)?)\+?\s*(?:years|yrs)\s+of\s+experience",
        r"over\s+(\d+(?:\.\d+)?)\s*(?:years|yrs)",
        r"more\s+than\s+(\d+(?:\.\d+)?)\s*(?:years|yrs)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            lower,
        )

        if match:
            return float(match.group(1))

    return 0


def extract_current_position(
    text: str,
) -> str | None:

    lines = [
        line.strip()
        for line in text.split("\n")
        if line.strip()
    ]

    role_keywords = [
        "engineer",
        "developer",
        "technician",
        "analyst",
        "manager",
        "executive",
        "operator",
        "mechanic",
        "electrician",
        "recruiter",
        "accountant",
        "nurse",
        "welder",
        "fitter",
    ]

    for line in lines[:15]:
        lower = line.lower()

        if any(keyword in lower for keyword in role_keywords):
            if len(line) <= 80 and "@" not in line and not any(char.isdigit() for char in line[:5]):
                return line
    return None


def parse_resume(
    text: str,
) -> dict:

    sections = detect_resume_sections(
        text,
    )

    lines = [
        line.strip()
        for line
        in text.split("\n")
        if line.strip()
    ]

    candidate_name = (
        lines[0]
        if lines
        else None
    )

    current_position = extract_current_position(text)

    experience_years = extract_experience_years(text)

    return {
        "name": candidate_name,
        "email": extract_email(text),
        "phone": extract_phone(text),
        "location": None,
        "current_location": None,
        "preferred_location": None,
        "current_position": current_position,
        "target_role": None,
        "skills": extract_skills(
            sections.get(
                "skills",
                "",
            )
        ),
        "education": extract_education(
            sections.get(
                "education",
                "",
            )
        ),
        "experience_years": experience_years,
        "total_experience_years": experience_years,
        "certifications": [],
        "languages": [],
        "projects": [],
        "work_experience": [],
        "parser_type": "deterministic_fallback",
    }