import re
from typing import Any


RESUME_SECTION_PATTERNS = {
    "skills": [
        r"\bskills\b",
        r"\btechnical skills\b",
        r"\bcore competencies\b",
        r"\btechnologies\b",
    ],

    "education": [
        r"\beducation\b",
        r"\bacademic\b",
        r"\bqualifications\b",
    ],

    "experience": [
        r"\bexperience\b",
        r"\bwork experience\b",
        r"\bemployment\b",
        r"\bprofessional experience\b",
    ],

    "projects": [
        r"\bprojects\b",
        r"\bpersonal projects\b",
    ],

    "certifications": [
        r"\bcertifications\b",
        r"\blicenses\b",
    ],

    "languages": [
        r"\blanguages\b",
    ],

    "summary": [
        r"\bsummary\b",
        r"\bprofile\b",
        r"\bobjective\b",
        r"\babout me\b",
    ],
}


JD_SECTION_PATTERNS = {
    "responsibilities": [
        r"\bresponsibilities\b",
        r"\bjob responsibilities\b",
        r"\bkey responsibilities\b",
        r"\bduties\b",
    ],

    "requirements": [
        r"\brequirements\b",
        r"\bqualifications\b",
        r"\bmust have\b",
    ],

    "skills": [
        r"\bskills\b",
        r"\brequired skills\b",
        r"\btechnical skills\b",
    ],

    "benefits": [
        r"\bbenefits\b",
        r"\bperks\b",
    ],

    "education": [
        r"\beducation\b",
        r"\bacademic qualification\b",
    ],

    "salary": [
        r"\bsalary\b",
        r"\bcompensation\b",
        r"\bctc\b",
    ],
}


def normalize_text(
    text: str,
) -> str:

    text = text.replace(
        "\r",
        "\n",
    )

    text = re.sub(
        r"\n+",
        "\n",
        text,
    )

    return text


def split_lines(
    text: str,
) -> list[str]:

    return [
        line.strip()
        for line
        in normalize_text(text).split("\n")
        if line.strip()
    ]


def detect_section_name(
    line: str,
    patterns: dict[str, list[str]],
) -> str | None:

    lower = line.lower().strip()

    for section_name, rules in patterns.items():

        for pattern in rules:

            if re.search(
                pattern,
                lower,
            ):
                return section_name

    return None


def detect_sections(
    text: str,
    section_patterns: dict[str, list[str]],
) -> dict[str, str]:

    lines = split_lines(text)

    sections = {}

    current_section = "general"

    sections[current_section] = []

    for line in lines:

        detected = detect_section_name(
            line,
            section_patterns,
        )

        if detected:
            current_section = detected

            if current_section not in sections:
                sections[current_section] = []

            continue

        sections.setdefault(
            current_section,
            [],
        ).append(line)

    return {
        section: "\n".join(content).strip()
        for section, content
        in sections.items()
    }


def detect_resume_sections(
    text: str,
) -> dict[str, Any]:

    return detect_sections(
        text,
        RESUME_SECTION_PATTERNS,
    )


def detect_jd_sections(
    text: str,
) -> dict[str, Any]:

    return detect_sections(
        text,
        JD_SECTION_PATTERNS,
    )