import re
from typing import Any


EDUCATION_ALIASES = {
    # =========================
    # India / common global tech
    # =========================
    "b.tech": "bachelor of technology",
    "btech": "bachelor of technology",
    "b.e": "bachelor of engineering",
    "be": "bachelor of engineering",
    "m.tech": "master of technology",
    "mtech": "master of technology",
    "b.sc": "bachelor of science",
    "bsc": "bachelor of science",
    "m.sc": "master of science",
    "msc": "master of science",
    "bca": "bachelor of computer applications",
    "mca": "master of computer applications",
    "bba": "bachelor of business administration",
    "mba": "master of business administration",
    "ba": "bachelor of arts",
    "ma": "master of arts",
    "b.com": "bachelor of commerce",
    "m.com": "master of commerce",

    # =========================
    # Trade / vocational
    # =========================
    "iti": "industrial training institute",
    "diploma": "diploma",
    "polytechnic": "polytechnic diploma",
    "vocational": "vocational qualification",

    # =========================
    # Medical
    # =========================
    "mbbs": "bachelor of medicine and bachelor of surgery",
    "bds": "bachelor of dental surgery",
    "b.pharma": "bachelor of pharmacy",
    "d.pharma": "diploma in pharmacy",
    "gnm": "general nursing and midwifery",
    "anm": "auxiliary nursing midwifery",
    "b.sc nursing": "bachelor of science in nursing",

    # =========================
    # Law
    # =========================
    "llb": "bachelor of laws",
    "llm": "master of laws",
    "ba llb": "bachelor of arts and bachelor of laws",
    "ballb": "bachelor of arts and bachelor of laws",
    "jd": "juris doctor",

    # =========================
    # International common
    # =========================
    "associate degree": "associate degree",
    "foundation degree": "foundation degree",
    "undergraduate degree": "bachelor degree",
    "graduate degree": "master degree",
    "postgraduate degree": "master degree",
    "masters degree": "master degree",
    "master's degree": "master degree",
    "bachelors degree": "bachelor degree",
    "bachelor's degree": "bachelor degree",
    "phd": "doctorate",
    "ph.d": "doctorate",
    "doctor of philosophy": "doctorate",
}


EDUCATION_LEVEL_KEYWORDS = {
    6: {
        "doctorate",
        "doctoral",
        "phd",
        "ph.d",
        "doctor of philosophy",
    },
    5: {
        "master",
        "masters",
        "master's",
        "postgraduate",
        "graduate degree",
        "mca",
        "mba",
        "m.tech",
        "mtech",
        "m.sc",
        "msc",
        "ma",
        "m.com",
        "llm",
    },
    4: {
        "bachelor",
        "bachelors",
        "bachelor's",
        "undergraduate",
        "degree",
        "b.tech",
        "btech",
        "b.e",
        "bsc",
        "b.sc",
        "bca",
        "bba",
        "ba",
        "b.com",
        "mbbs",
        "bds",
        "llb",
    },
    3: {
        "associate degree",
        "foundation degree",
        "advanced diploma",
        "higher diploma",
    },
    2: {
        "diploma",
        "polytechnic",
        "vocational",
        "trade certificate",
        "certificate",
    },
    1: {
        "iti",
        "high school",
        "secondary school",
        "senior secondary",
        "intermediate",
        "12th",
        "10+2",
    },
}


FIELD_KEYWORDS = {
    "computer": {
        "computer",
        "computer application",
        "computer science",
        "information technology",
        "it",
        "software",
        "data",
        "ai",
        "artificial intelligence",
        "machine learning",
    },
    "engineering": {
        "engineering",
        "technology",
        "technical",
        "mechanical",
        "electrical",
        "civil",
        "electronics",
        "instrumentation",
        "automobile",
        "industrial",
    },
    "business": {
        "business",
        "management",
        "administration",
        "commerce",
        "finance",
        "accounting",
        "economics",
    },
    "medical": {
        "medicine",
        "medical",
        "nursing",
        "pharmacy",
        "dental",
        "clinical",
        "healthcare",
    },
    "law": {
        "law",
        "legal",
        "juris",
    },
    "arts": {
        "arts",
        "humanities",
        "social science",
        "language",
        "literature",
    },
}


def clean_text(value: Any) -> str:
    if not value:
        return ""

    text = str(value).strip().lower()
    text = text.replace("-", " ")
    text = text.replace("/", " ")
    text = text.replace("—", " ")
    text = text.replace("–", " ")
    text = re.sub(r"[^a-z0-9+.\s]", " ", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def normalize_education(value: Any) -> str:
    text = clean_text(value)

    if not text:
        return ""

    if text in EDUCATION_ALIASES:
        return EDUCATION_ALIASES[text]

    for alias, normalized in EDUCATION_ALIASES.items():
        if alias in text:
            return normalized

    return text


def get_education_level(value: Any) -> int:
    text = clean_text(value)

    if not text:
        return 0

    normalized = normalize_education(text)
    combined = f"{text} {normalized}"

    for level in sorted(
        EDUCATION_LEVEL_KEYWORDS.keys(),
        reverse=True,
    ):
        for keyword in EDUCATION_LEVEL_KEYWORDS[level]:
            if keyword in combined:
                return level

    return 0


def detect_education_field(value: Any) -> str | None:
    text = clean_text(value)

    if not text:
        return None

    normalized = normalize_education(text)
    combined = f"{text} {normalized}"

    for field, keywords in FIELD_KEYWORDS.items():
        if any(keyword in combined for keyword in keywords):
            return field

    return None


def education_matches_required(
    required: Any,
    candidate: Any,
) -> bool:
    required_text = clean_text(required)
    candidate_text = clean_text(candidate)

    if not required_text or not candidate_text:
        return False

    required_level = get_education_level(required_text)
    candidate_level = get_education_level(candidate_text)

    required_field = detect_education_field(required_text)
    candidate_field = detect_education_field(candidate_text)

    # JD says relevant degree/diploma: any diploma or higher is acceptable.
    if "relevant" in required_text and candidate_level >= 2:
        return True

    # Bachelor requirement: bachelor/master/doctorate should match.
    if (
        "bachelor" in required_text
        or "degree" in required_text
        or "undergraduate" in required_text
    ) and candidate_level >= 4:
        return True

    # Diploma requirement: diploma/bachelor/master/doctorate should match.
    if "diploma" in required_text and candidate_level >= 2:
        return True

    # Master requirement: master/doctorate should match.
    if (
        "master" in required_text
        or "postgraduate" in required_text
    ) and candidate_level >= 5:
        return True

    # Doctorate requirement.
    if (
        "doctorate" in required_text
        or "phd" in required_text
        or "ph.d" in required_text
    ) and candidate_level >= 6:
        return True

    # Level-based general matching.
    if required_level and candidate_level:
        if candidate_level >= required_level:
            if not required_field:
                return True

            if candidate_field == required_field:
                return True

            # If JD says relevant/generic education, field mismatch should not block.
            if any(
                word in required_text
                for word in [
                    "relevant",
                    "related",
                    "equivalent",
                    "any discipline",
                    "any stream",
                    "any graduate",
                ]
            ):
                return True

    return (
        required_text in candidate_text
        or candidate_text in required_text
    )


def normalize_education_list(values: list[Any]) -> list[str]:
    normalized = []

    for value in values:
        cleaned = normalize_education(value)

        if cleaned:
            normalized.append(cleaned)

    return list(dict.fromkeys(normalized))