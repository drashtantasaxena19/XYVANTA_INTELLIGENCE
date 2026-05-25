import asyncio
from openai import OpenAI

from src.ai.providers.base_provider import BaseAIProvider
from src.ai.providers.provider_utils import extract_json
from src.core.config import settings


class OpenRouterProvider(BaseAIProvider):
    def __init__(self):
        if not settings.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY missing")

        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=settings.OPENROUTER_API_KEY,
        )

        self.model = "meta-llama/llama-3.1-8b-instruct:free"

    async def generate_json(self, prompt: str, temperature: float = 0.1) -> dict:
        for attempt in range(2):
            try:
                response = await asyncio.to_thread(
                    self.client.chat.completions.create,
                    model=self.model,
                    temperature=temperature,
                    messages=[
                        {"role": "system", "content": "Return ONLY raw valid JSON."},
                        {"role": "user", "content": prompt},
                    ],
                )

                text = response.choices[0].message.content or ""
                parsed = extract_json(text)

                if parsed:
                    return parsed

            except Exception as error:
                print(f"⚠️ OpenRouter attempt {attempt + 1} failed: {error}")

        return {}

    async def generate_text(self, prompt: str, temperature: float = 0.2) -> str:
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                temperature=temperature,
                messages=[{"role": "user", "content": prompt}],
            )

            return response.choices[0].message.content or ""

        except Exception as error:
            print(f"⚠️ OpenRouter text generation failed: {error}")
            return ""