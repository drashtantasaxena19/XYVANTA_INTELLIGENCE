from src.ai.providers.provider_factory import get_ai_provider_chain
from src.ai.prompts.resume_prompt import build_resume_prompt
from src.ai.prompts.jd_prompt import build_jd_prompt
from src.engines.normalization.schema_normalizer import (
    merge_resume_schema,
    merge_jd_schema,
)


async def run_provider_chain(prompt: str, parser_type: str) -> dict | None:
    providers = await get_ai_provider_chain()

    for provider in providers:
        provider_name = provider.__class__.__name__

        try:
            print(f"🤖 Trying {parser_type} parser with {provider_name}")

            data = await provider.generate_json(
                prompt,
                temperature=0.03,
            )

            if not data:
                continue

            if parser_type == "resume":
                cleaned = merge_resume_schema(data)
            else:
                cleaned = merge_jd_schema(data)

            print(f"✅ {parser_type} AI parsing success with {provider_name}")

            return {
                "provider": provider_name,
                "data": cleaned,
            }

        except Exception as error:
            print(f"⚠️ {provider_name} failed for {parser_type}: {error}")

    print(f"⚠️ All AI providers failed for {parser_type}")
    return None


async def ai_parse_resume(text: str) -> dict | None:
    return await run_provider_chain(
        build_resume_prompt(text),
        "resume",
    )


async def ai_parse_jd(text: str) -> dict | None:
    return await run_provider_chain(
        build_jd_prompt(text),
        "jd",
    )