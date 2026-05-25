import re
from difflib import SequenceMatcher
from typing import Any

from src.engines.normalization.skill_normalizer import (
    normalize_skill,
    detect_skill_domain,
)
from src.engines.normalization.title_normalizer import (
    normalize_title,
    same_role_family,
)
from src.engines.normalization.education_normalizer import (
    normalize_education,
    education_matches_required,
)
from src.engines.scoring.embedding_engine import semantic_similarity


GENERIC_TERMS = {
    "basic",
    "advanced",
    "good",
    "strong",
    "knowledge",
    "skills",
    "skill",
    "experience",
    "work",
    "field",
    "service",
    "ability",
    "required",
    "preferred",
}


def clean_text(value: Any) -> str:
    if value is None:
        return ""

    text = str(value).strip().lower()
    text = text.replace("/", " ").replace("-", " ")
    text = re.sub(r"\s+", " ", text)

    return text


def normalize_item(value: Any) -> str:
    if value is None:
        return ""

    if isinstance(value, dict):
        parts = [
            value.get("degree"),
            value.get("field_of_study"),
            value.get("institution"),
            value.get("graduation_year"),
            value.get("year"),
            value.get("name"),
            value.get("spoken"),
            value.get("language"),
            value.get("proficiency"),
            value.get("role"),
            value.get("company"),
            value.get("duration"),
            value.get("description"),
        ]

        return " ".join(
            str(item)
            for item in parts
            if item
        ).strip()

    if isinstance(value, list):
        return " ".join(
            normalize_item(item)
            for item in value
            if item
        ).strip()

    return str(value).strip()


def normalize_list(values: Any) -> list[str]:
    if not values:
        return []

    if not isinstance(values, list):
        values = [values]

    cleaned = []

    for value in values:
        text = normalize_item(value).strip()

        if text:
            cleaned.append(text)

    return cleaned


def is_too_short(value: str) -> bool:
    text = clean_text(value)
    return len(text) <= 2


def token_overlap(a: str, b: str) -> float:
    tokens_a = {
        token
        for token in re.split(r"[^a-z0-9+#.]+", a)
        if token and token not in GENERIC_TERMS
    }

    tokens_b = {
        token
        for token in re.split(r"[^a-z0-9+#.]+", b)
        if token and token not in GENERIC_TERMS
    }

    if not tokens_a or not tokens_b:
        return 0.0

    return len(tokens_a & tokens_b) / len(tokens_a | tokens_b)


def deterministic_similarity(a: str, b: str) -> float:
    if not a or not b:
        return 0.0

    if a == b:
        return 1.0

    if is_too_short(a) or is_too_short(b):
        return 0.0

    if a in b or b in a:
        return 0.88

    overlap = token_overlap(a, b)

    if overlap >= 0.5:
        return max(0.78, overlap)

    return SequenceMatcher(None, a, b).ratio()


def should_use_embedding(a: str, b: str) -> bool:
    if is_too_short(a) or is_too_short(b):
        return False

    if a in GENERIC_TERMS or b in GENERIC_TERMS:
        return False

    return True


def similarity(a: Any, b: Any) -> float:
    a_text = clean_text(
        normalize_item(a)
    )
    b_text = clean_text(
        normalize_item(b)
    )

    if not a_text or not b_text:
        return 0.0

    # =========================
    # Education Matching
    # =========================
    # Keep this before skill matching because education phrases can contain
    # generic words like degree, diploma, bachelor, master, etc.
    # =========================

    edu_a = normalize_education(a_text)
    edu_b = normalize_education(b_text)

    if education_matches_required(edu_a, edu_b):
        return 0.96

    if edu_a and edu_b and edu_a == edu_b:
        return 0.95

    # =========================
    # Skill Matching
    # =========================

    skill_a = normalize_skill(a_text)
    skill_b = normalize_skill(b_text)

    if skill_a and skill_b and skill_a == skill_b:
        return 1.0

    domain_a = detect_skill_domain(
        skill_a or a_text
    )
    domain_b = detect_skill_domain(
        skill_b or b_text
    )

    if domain_a and domain_b and domain_a == domain_b:
        overlap = token_overlap(
            skill_a or a_text,
            skill_b or b_text,
        )

        if overlap >= 0.2:
            return max(0.76, overlap)

        semantic = semantic_similarity(
            skill_a or a_text,
            skill_b or b_text,
        )

        if semantic >= 0.68:
            return max(0.76, semantic)

        return 0.72

    # =========================
    # Role / Title Matching
    # =========================

    title_a = normalize_title(a_text)
    title_b = normalize_title(b_text)

    if title_a and title_b and title_a == title_b:
        return 0.97

    if same_role_family(title_a, title_b):
        semantic = semantic_similarity(
            title_a or a_text,
            title_b or b_text,
        )

        return max(0.84, semantic)

    # =========================
    # Deterministic + Embedding
    # =========================

    deterministic = deterministic_similarity(
        skill_a or a_text,
        skill_b or b_text,
    )

    if deterministic >= 0.82:
        return deterministic

    if not should_use_embedding(a_text, b_text):
        return deterministic

    semantic = semantic_similarity(
        a_text,
        b_text,
    )

    if semantic >= 0.72:
        return max(
            deterministic,
            semantic,
        )

    return deterministic


def match_list(
    required: Any,
    available: Any,
    threshold: float = 0.70,
) -> dict[str, Any]:
    required_items = normalize_list(required)
    available_items = normalize_list(available)

    matched = []
    missing = []

    if not required_items:
        return {
            "percentage": 100,
            "matched": [],
            "missing": [],
        }

    if not available_items:
        return {
            "percentage": 0,
            "matched": [],
            "missing": required_items,
        }

    for req in required_items:
        best = 0.0
        best_item = None

        for item in available_items:
            score = similarity(req, item)

            if score > best:
                best = score
                best_item = item

        if best >= threshold:
            matched.append(
                {
                    "required": req,
                    "matched_with": best_item,
                    "confidence": round(best, 2),
                }
            )
        else:
            missing.append(req)

    percentage = round(
        (len(matched) / len(required_items)) * 100
    )

    return {
        "percentage": percentage,
        "matched": matched,
        "missing": missing,
    }