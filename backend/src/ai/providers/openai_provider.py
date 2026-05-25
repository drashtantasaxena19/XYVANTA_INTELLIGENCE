import asyncio
from openai import OpenAI

from src.ai.providers.base_provider import BaseAIProvider
from src.ai.providers.provider_utils import extract_json
from src.core.config import settings


class OpenAIProvider(BaseAIProvider):
    def __init__(self):
        if not settings.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY missing")

        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4o-mini"

    async def generate_json(self, prompt: str, temperature: float = 0.1) -> dict:
        for attempt in range(2):
            try:
                response = await asyncio.to_thread(
                    self.client.chat.completions.create,
                    model=self.model,
                    temperature=temperature,
                    response_format={"type": "json_object"},
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
                print(f"⚠️ OpenAI attempt {attempt + 1} failed: {error}")

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
            print(f"⚠️ OpenAI text generation failed: {error}")
            return ""