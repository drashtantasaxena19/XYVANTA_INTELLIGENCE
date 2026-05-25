import re
from typing import Any


REMOTE_KEYWORDS = {
    "remote",
    "work from home",
    "wfh",
    "anywhere",
}

HYBRID_KEYWORDS = {
    "hybrid",
}

ONSITE_KEYWORDS = {
    "onsite",
    "on-site",
    "office",
}


def clean_location_text(
    value: Any,
) -> str | None:

    if value is None:
        return None

    text = str(value).strip()

    if not text:
        return None

    text = re.sub(
        r"\s+",
        " ",
        text,
    )

    return text


def detect_work_mode(
    *values: Any,
) -> str | None:

    combined = " ".join(
        str(value).lower()
        for value in values
        if value
    )

    if any(
        keyword in combined
        for keyword
        in REMOTE_KEYWORDS
    ):
        return "Remote"

    if any(
        keyword in combined
        for keyword
        in HYBRID_KEYWORDS
    ):
        return "Hybrid"

    if any(
        keyword in combined
        for keyword
        in ONSITE_KEYWORDS
    ):
        return "Onsite"

    return None


def normalize_location(
    location: Any,
    mode: Any = None,
) -> dict:

    cleaned = clean_location_text(
        location,
    )

    detected_mode = detect_work_mode(
        cleaned,
        mode,
    )

    return {
        "raw":
            cleaned,

        "normalized":
            cleaned.lower()
            if cleaned
            else None,

        "mode":
            detected_mode,

        "is_remote":
            detected_mode == "Remote",
    }