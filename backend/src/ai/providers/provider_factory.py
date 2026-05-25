from src.core.config import settings
from src.utils.db_handler import db_handler

from src.ai.providers.base_provider import BaseAIProvider
from src.ai.providers.gemini_provider import GeminiProvider
from src.ai.providers.groq_provider import GroqProvider
from src.ai.providers.openrouter_provider import OpenRouterProvider
from src.ai.providers.openai_provider import OpenAIProvider


DEFAULT_PROVIDER_CHAIN = [
    "gemini",
    "groq",
    "openrouter",
    "openai",
]


PROVIDER_CLASS_MAP = {
    "gemini": GeminiProvider,
    "groq": GroqProvider,
    "openrouter": OpenRouterProvider,
    "openai": OpenAIProvider,
}


def get_env_provider_chain() -> list[str]:
    chain_raw = settings.AI_PROVIDER_CHAIN or ""

    provider_names = [
        item.strip().lower()
        for item in chain_raw.split(",")
        if item.strip()
    ]

    return provider_names or DEFAULT_PROVIDER_CHAIN


async def get_db_provider_chain() -> list[str] | None:
    try:
        settings_doc = await db_handler.admin_settings.find_one(
            {"type": "ai_provider_settings"},
            {"_id": 0},
        )

        if not settings_doc:
            return None

        active = settings_doc.get(
            "active_ai_providers",
            {},
        )

        enabled = [
            provider
            for provider in DEFAULT_PROVIDER_CHAIN
            if active.get(provider)
        ]

        return enabled or None

    except Exception as error:
        print(f"⚠️ Failed to load provider DB settings: {error}")
        return None


def get_single_provider(
    provider_name: str,
) -> BaseAIProvider | None:
    provider_name = provider_name.lower().strip()

    provider_class = PROVIDER_CLASS_MAP.get(provider_name)

    if not provider_class:
        print(f"⚠️ Unknown provider skipped: {provider_name}")
        return None

    try:
        return provider_class()

    except Exception as error:
        print(f"⚠️ {provider_name} unavailable: {error}")
        return None


async def get_ai_provider_chain() -> list[BaseAIProvider]:
    provider_names = await get_db_provider_chain()

    if not provider_names:
        provider_names = get_env_provider_chain()

    providers = []

    for provider_name in provider_names:
        provider = get_single_provider(provider_name)

        if provider:
            providers.append(provider)

    print(
        "🤖 Active AI chain:",
        [provider.__class__.__name__ for provider in providers],
    )

    return providers