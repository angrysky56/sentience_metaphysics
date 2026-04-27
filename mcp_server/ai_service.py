import os
from dataclasses import dataclass
from typing import Dict, List, Optional

import httpx
from dotenv import load_dotenv

load_dotenv()


@dataclass
class AIMessage:
    role: str
    content: str


@dataclass
class AIResponse:
    content: str
    error: Optional[str] = None


class AIService:
    """Python implementation of AI Service for MCP server stabilization."""

    def __init__(
        self,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        api_key: Optional[str] = None,
    ):
        self.provider = (provider or os.getenv("AI_PROVIDER") or "gemini").lower()
        self.api_key = api_key or os.getenv(f"{self.provider.upper()}_API_KEY")

        # Default models
        default_models = {
            "gemini": "gemini-1.5-pro",
            "openai": "gpt-4-turbo-preview",
            "ollama": "llama3",
            "lmstudio": "local-model",
            "openrouter": "anthropic/claude-3-opus",
        }
        self.model = (
            model
            or os.getenv(f"{self.provider.upper()}_MODEL")
            or default_models.get(self.provider)
        )

        # Base URLs
        default_urls = {
            "gemini": "https://generativelanguage.googleapis.com/v1beta",
            "openai": "https://api.openai.com/v1",
            "ollama": "http://localhost:11434",
            "lmstudio": "http://localhost:1234",
            "openrouter": "https://openrouter.ai/api/v1",
        }
        self.base_url = os.getenv(
            f"{self.provider.upper()}_BASE_URL"
        ) or default_urls.get(self.provider)

    async def generate_response(
        self, messages: List[Dict[str, str]], system_prompt: Optional[str] = None
    ) -> AIResponse:
        try:
            formatted_messages = []
            if system_prompt:
                formatted_messages.append({"role": "system", "content": system_prompt})

            for msg in messages:
                formatted_messages.append(
                    {"role": msg["role"], "content": msg["content"]}
                )

            if self.provider == "gemini":
                return await self._call_gemini(formatted_messages)
            elif self.provider in ["openai", "lmstudio", "openrouter"]:
                return await self._call_openai_compatible(formatted_messages)
            elif self.provider == "ollama":
                return await self._call_ollama(formatted_messages)
            else:
                return AIResponse(
                    content="", error=f"Unsupported provider: {self.provider}"
                )
        except Exception as e:
            return AIResponse(content="", error=str(e))

    async def _call_gemini(self, messages: List[Dict[str, str]]) -> AIResponse:
        if not self.api_key:
            return AIResponse(content="", error="Gemini API key is required")

        prompt = self._messages_to_prompt(messages)
        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url, json={"contents": [{"parts": [{"text": prompt}]}]}, timeout=60.0
            )
            response.raise_for_status()
            data = response.json()

            content = (
                data.get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "")
            )
            return AIResponse(content=content)

    async def _call_openai(self, messages: List[Dict[str, str]]) -> AIResponse:
        if not self.api_key:
            return AIResponse(content="", error="OpenAI API key is required")

        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                json={"model": self.model, "messages": messages, "temperature": 0.7},
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()

            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return AIResponse(content=content)

    async def _call_ollama(self, messages: List[Dict[str, str]]) -> AIResponse:
        prompt = self._messages_to_prompt(messages)
        url = f"{self.base_url}/api/generate"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json={"model": self.model, "prompt": prompt, "stream": False},
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()

            content = data.get("response", "")
            return AIResponse(content=content)

    async def _call_openai_compatible(self, messages: List[Dict[str, str]]) -> AIResponse:
        url = f"{self.base_url}/chat/completions"
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                headers=headers,
                json={"model": self.model, "messages": messages, "temperature": 0.7},
                timeout=60.0,
            )
            response.raise_for_status()
            data = response.json()

            content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
            return AIResponse(content=content)

    def _messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        prompt_parts = []
        for msg in messages:
            role = msg["role"].capitalize()
            content = msg["content"]
            prompt_parts.append(f"{role}: {content}")
        return "\n\n".join(prompt_parts)
