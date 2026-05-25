from abc import ABC, abstractmethod


class BaseAIProvider(ABC):

    @abstractmethod
    async def generate_json(
        self,
        prompt: str,
        temperature: float = 0.1,
    ) -> dict:
        pass

    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        temperature: float = 0.2,
    ) -> str:
        pass