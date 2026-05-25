import asyncio

from google import genai

from src.ai.providers.base_provider import BaseAIProvider
from src.ai.providers.provider_utils import extract_json
from src.core.config import settings


class GeminiProvider(BaseAIProvider):

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY missing")

        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY,
        )

        self.model = "gemini-1.5-flash"

    async def generate_json(
        self,
        prompt: str,
        temperature: float = 0.1,
    ) -> dict:
        for attempt in range(2):
            try:
                response = await asyncio.to_thread(
                    self.client.models.generate_content,
                    model=self.model,
                    contents=(
                        "Return ONLY valid raw JSON. "
                        "No markdown. No explanation.\n\n"
                        + prompt
                    ),
                )

                text = getattr(
                    response,
                    "text",
                    "",
                )

                parsed = extract_json(text)

                if parsed:
                    return parsed

            except Exception as error:
                print(
                    f"⚠️ Gemini attempt {attempt + 1} failed: {error}"
                )

        return {}

    async def generate_text(
        self,
        prompt: str,
        temperature: float = 0.2,
    ) -> str:
        try:
            response = await asyncio.to_thread(
                self.client.models.generate_content,
                model=self.model,
                contents=prompt,
            )

            return getattr(
                response,
                "text",
                "",
            )

        except Exception as error:
            print(
                f"⚠️ Gemini text generation failed: {error}"
            )

            return ""