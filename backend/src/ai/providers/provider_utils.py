import json
import re


def extract_json(
    text: str,
) -> dict | None:

    if not text:
        return None

    text = text.strip()

    # Direct parse
    try:
        parsed = json.loads(text)

        if isinstance(parsed, dict):
            return parsed

    except Exception:
        pass

    # Markdown JSON block
    markdown_match = re.search(
        r"```json\s*(\{.*?\})\s*```",
        text,
        re.DOTALL,
    )

    if markdown_match:

        try:
            parsed = json.loads(
                markdown_match.group(1)
            )

            if isinstance(parsed, dict):
                return parsed

        except Exception:
            pass

    # Generic JSON object
    generic_match = re.search(
        r"(\{.*\})",
        text,
        re.DOTALL,
    )

    if generic_match:

        try:
            parsed = json.loads(
                generic_match.group(1)
            )

            if isinstance(parsed, dict):
                return parsed

        except Exception:
            pass

    return None