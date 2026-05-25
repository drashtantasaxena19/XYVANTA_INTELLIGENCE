from typing import Any


TITLE_ALIASES = {
    # Software
    "software developer": "software engineer",
    "backend developer": "backend engineer",
    "frontend developer": "frontend engineer",
    "full stack developer": "full stack engineer",
    "api developer": "backend engineer",
    "web developer": "software engineer",
    "ml engineer": "machine learning engineer",
    "ai engineer": "artificial intelligence engineer",

    # Data
    "bi analyst": "data analyst",
    "business intelligence analyst": "data analyst",
    "reporting analyst": "data analyst",

    # Electrical
    "electrical maintenance technician": "electrical technician",
    "maintenance electrician": "electrical technician",
    "field service electrical": "electrical field service technician",
    "field service electrician": "electrical field service technician",
    "electrical field technician": "electrical field service technician",
    "plc technician": "electrical automation technician",
    "automation technician": "electrical automation technician",
    "panel technician": "electrical panel technician",
    "electrical employee": "engineering technician",

    # Mechanical
    "machine technician": "mechanical technician",
    "machine operator": "machine operator",
    "field service mechanic": "mechanical field technician",
    "maintenance mechanic": "mechanical technician",

    # HR / Finance
    "talent acquisition": "recruiter",
    "talent acquisition specialist": "recruiter",
    "accounts executive": "accountant",

    # Logistics
    "warehouse assistant": "warehouse operator",
    "warehouse executive": "warehouse operator",
}


ROLE_FAMILIES = {
    "software": {
        "software engineer",
        "backend engineer",
        "frontend engineer",
        "full stack engineer",
        "machine learning engineer",
        "artificial intelligence engineer",
        "data analyst",
        "data scientist",
    },

    "electrical": {
        "electrical technician",
        "electrical field service technician",
        "electrical automation technician",
        "electrical panel technician",
        "engineering technician",
        "electrician",
    },

    "mechanical": {
        "mechanical technician",
        "mechanical field technician",
        "machine operator",
        "mechanic",
        "welder",
        "fitter",
    },

    "finance": {
        "accountant",
        "financial analyst",
    },

    "human_resources": {
        "recruiter",
        "human resources executive",
    },

    "logistics": {
        "warehouse operator",
        "driver",
        "store manager",
    },
}


def clean_title(
    value: Any,
) -> str:

    if not value:
        return ""

    title = str(value).strip().lower()

    title = title.replace("/", " ")
    title = title.replace("-", " ")

    title = " ".join(title.split())

    return title


def normalize_title(
    value: Any,
) -> str | None:

    title = clean_title(value)

    if not title:
        return None

    return TITLE_ALIASES.get(
        title,
        title,
    )


def detect_role_family(
    value: Any,
) -> str | None:

    title = normalize_title(value)

    if not title:
        return None

    for family, titles in ROLE_FAMILIES.items():

        if title in titles:
            return family

    # Dynamic detection
    if any(
        word in title
        for word in [
            "software",
            "developer",
            "backend",
            "frontend",
            "engineer",
            "api",
            "data",
        ]
    ):
        return "software"

    if any(
        word in title
        for word in [
            "electrical",
            "electrician",
            "plc",
            "automation",
            "panel",
            "maintenance",
        ]
    ):
        return "electrical"

    if any(
        word in title
        for word in [
            "mechanic",
            "mechanical",
            "machine",
            "welder",
            "fitter",
        ]
    ):
        return "mechanical"

    if any(
        word in title
        for word in [
            "account",
            "finance",
            "tax",
            "audit",
        ]
    ):
        return "finance"

    if any(
        word in title
        for word in [
            "recruiter",
            "talent",
            "human resource",
            "hr",
        ]
    ):
        return "human_resources"

    if any(
        word in title
        for word in [
            "warehouse",
            "logistics",
            "driver",
            "dispatch",
        ]
    ):
        return "logistics"

    return None


def same_role_family(
    a: Any,
    b: Any,
) -> bool:

    family_a = detect_role_family(a)
    family_b = detect_role_family(b)

    return bool(
        family_a
        and family_b
        and family_a == family_b
    )