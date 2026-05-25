from typing import Any


ROLE_LIKE_TERMS = {
    "software engineer",
    "software developer",
    "backend developer",
    "frontend developer",
    "full stack developer",
    "data analyst",
    "data scientist",
    "ai engineer",
    "ml engineer",
    "electrical technician",
    "electrical engineer",
    "maintenance engineer",
    "maintenance technician",
    "mechanical engineer",
    "mechanic",
    "welder",
    "fitter",
    "driver",
    "warehouse operator",
    "accountant",
    "recruiter",
    "hr executive",
    "human resources executive",
    "project manager",
    "manager",
}


SKILL_ALIASES = {
    # IT
    "js": "javascript",
    "reactjs": "react",
    "react.js": "react",
    "react js": "react",
    "nodejs": "node.js",
    "node js": "node.js",
    "ts": "typescript",
    "py": "python",
    "powerbi": "power bi",
    "ms excel": "excel",
    "microsoft excel": "excel",
    "mongo": "mongodb",

    # Backend / Infra
    "rest api": "api development",
    "rest apis": "api development",
    "microservices": "microservices architecture",
    "docker containers": "docker",
    "k8s": "kubernetes",

    # Data
    "analyse de données": "data analysis",
    "análisis de datos": "data analysis",
    "datenanalyse": "data analysis",
    "data analyse": "data analysis",
    "gestion des stocks": "inventory management",
    "gestión de inventario": "inventory management",

    # Electrical
    "plc programming": "plc",
    "programmable logic controller": "plc",
    "scada systems": "scada",
    "hmi programming": "hmi",
    "human machine interface": "hmi",
    "vfd": "variable frequency drive",
    "panel wiring": "electrical panel wiring",
    "control panel wiring": "electrical panel wiring",
    "electrical wiring": "electrical wiring",
    "field service electrical": "electrical field service",
    "electrical field technician": "electrical field service",
    "electrical maintenance": "electrical maintenance",
    "maintenance électrique": "electrical maintenance",
    "elektrische wartung": "electrical maintenance",
    "elektrisch onderhoud": "electrical maintenance",
    "motor control": "motor control",
    "load calculation": "electrical load calculation",
    "autocad electrical": "autocad electrical",

    # Mechanical
    "cnc": "cnc machining",
    "lathe": "lathe operation",
    "mig": "mig welding",
    "tig": "tig welding",
    "machine repair": "mechanical maintenance",
    "equipment maintenance": "mechanical maintenance",

    # Finance
    "gst": "gst filing",
    "tally erp": "tally",
    "sap fico": "sap fico",

    # Logistics
    "warehouse": "warehouse operations",
    "forklift": "forklift operation",
}


DOMAIN_KEYWORDS = {
    "electrical": {
        "electrician",
        "electrical",
        "wiring",
        "panel",
        "plc",
        "scada",
        "hmi",
        "vfd",
        "motor",
        "transformer",
        "circuit",
        "maintenance",
    },

    "mechanical": {
        "mechanical",
        "mechanic",
        "cnc",
        "machine",
        "lathe",
        "hydraulic",
        "welding",
        "fitter",
        "maintenance",
    },

    "software": {
        "software",
        "developer",
        "engineer",
        "python",
        "java",
        "react",
        "node",
        "api",
        "database",
        "docker",
        "kubernetes",
        "backend",
        "frontend",
    },

    "data": {
        "data",
        "analytics",
        "analysis",
        "power bi",
        "tableau",
        "excel",
        "sql",
        "visualization",
    },

    "finance": {
        "account",
        "accounting",
        "gst",
        "tax",
        "audit",
        "tally",
    },

    "logistics": {
        "warehouse",
        "inventory",
        "forklift",
        "supply chain",
        "dispatch",
    },
}


def clean_text(
    value: Any,
) -> str:

    if not value:
        return ""

    text = str(value).strip().lower()

    text = text.replace("/", " ")
    text = text.replace("-", " ")

    text = " ".join(text.split())

    return text


def is_role_like(
    value: Any,
) -> bool:

    text = clean_text(value)

    if not text:
        return False

    if text in ROLE_LIKE_TERMS:
        return True

    role_keywords = {
        "engineer",
        "developer",
        "technician",
        "manager",
        "analyst",
        "executive",
        "operator",
        "specialist",
        "recruiter",
        "mechanic",
        "electrician",
    }

    return any(
        keyword in text
        for keyword in role_keywords
    )


def normalize_skill(
    value: Any,
) -> str:

    skill = clean_text(value)

    if not skill:
        return ""

    if is_role_like(skill):
        return ""

    return SKILL_ALIASES.get(
        skill,
        skill,
    )


def normalize_skill_list(
    values: list[Any],
) -> list[str]:

    normalized = []

    for value in values:

        cleaned = normalize_skill(value)

        if (
            cleaned
            and cleaned not in normalized
        ):
            normalized.append(cleaned)

    return normalized


def detect_skill_domain(
    value: Any,
) -> str | None:

    text = normalize_skill(value)

    if not text:
        return None

    for domain, keywords in DOMAIN_KEYWORDS.items():

        if any(
            keyword in text
            for keyword in keywords
        ):
            return domain

    return None