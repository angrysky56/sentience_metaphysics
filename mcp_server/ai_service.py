import os
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Optional

import httpx
from dotenv import load_dotenv

# Load .env relative to the package root, NOT relative to the cwd. This makes
# AIService usable from any working directory — tests, REPL sessions, scripts
# launched from elsewhere — without requiring callers to chdir into the project
# first. The project's .env lives one directory up from this file (alongside
# pyproject.toml). load_dotenv() with override=False so an explicit env var
# from the launcher (e.g. mcp.json's "env" block) still wins.
_PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=_PROJECT_ROOT / ".env", override=False)


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
        self.provider = (provider or os.getenv("AI_PROVIDER") or "ollama").lower()
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

            # Check for prompt-level safety block (no candidates returned at all).
            prompt_feedback = data.get("promptFeedback", {})
            block_reason = prompt_feedback.get("blockReason")
            if block_reason:
                safety_ratings = prompt_feedback.get("safetyRatings", [])
                return AIResponse(
                    content="",
                    error=(
                        f"Gemini blocked the prompt (blockReason: {block_reason}). "
                        f"Safety ratings: {safety_ratings}"
                    ),
                )

            candidates = data.get("candidates", [])
            if not candidates:
                return AIResponse(
                    content="",
                    error=f"Gemini returned no candidates. Response: {data}",
                )

            # Check for response-level termination that produced no usable text.
            candidate = candidates[0]
            finish_reason = candidate.get("finishReason")
            if finish_reason and finish_reason not in ("STOP", "MAX_TOKENS"):
                return AIResponse(
                    content="",
                    error=(
                        f"Gemini stopped generation early (finishReason: {finish_reason}). "
                        f"Safety ratings: {candidate.get('safetyRatings', [])}"
                    ),
                )

            parts = candidate.get("content", {}).get("parts", [])
            if not parts:
                return AIResponse(
                    content="",
                    error=(
                        f"Gemini candidate had no content parts. "
                        f"finishReason: {finish_reason}"
                    ),
                )

            content = parts[0].get("text", "")
            if not content:
                return AIResponse(
                    content="",
                    error=(
                        f"Gemini returned an empty text part. "
                        f"finishReason: {finish_reason}"
                    ),
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

            choices = data.get("choices", [])
            if not choices:
                return AIResponse(
                    content="",
                    error=f"OpenAI returned no choices. Response: {data}",
                )

            choice = choices[0]
            finish_reason = choice.get("finish_reason")
            content = choice.get("message", {}).get("content", "")
            if not content:
                return AIResponse(
                    content="",
                    error=(
                        f"OpenAI returned empty content. "
                        f"finish_reason: {finish_reason}"
                    ),
                )
            return AIResponse(content=content)

    async def _call_ollama(self, messages: List[Dict[str, str]]) -> AIResponse:
        """Call Ollama via /api/chat for proper system-role + chat-template handling.

        We deliberately use /api/chat rather than /api/generate. /api/generate
        would force us to flatten the message list into a single concatenated
        prompt, which loses the system/user role distinction and bypasses the
        instruction-tuned chat template baked into the model (Gemma, Llama-3
        Instruct, Qwen-Instruct, etc.). For SEG personas — where the system
        message carries the molecular_self / Base SEG instruction — that
        template is the load-bearing mechanism for system-prompt adherence.
        Skipping it is a major reason a strong instruction "drifts after a few
        turns": the model never gave the instruction full system-role weight
        in the first place.
        """
        url = f"{self.base_url}/api/chat"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                url,
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    # Keep options minimal so model defaults / Modelfile govern.
                    # Callers can extend this dict later (temperature, num_ctx,
                    # num_predict, etc.) without changing the surface.
                },
                timeout=180.0,  # Local generation on commodity GPUs can be slow.
            )
            response.raise_for_status()
            data = response.json()

            # /api/chat shape: {"message": {"role":"assistant","content":"..."}, "done": true, ...}
            message = data.get("message")
            if not isinstance(message, dict):
                return AIResponse(
                    content="",
                    error=f"Ollama /api/chat returned no message object. Response: {data}",
                )

            content = message.get("content", "")
            if not content:
                done_reason = data.get("done_reason") or data.get("done")
                return AIResponse(
                    content="",
                    error=(
                        f"Ollama /api/chat returned empty content. "
                        f"done_reason: {done_reason}. Full response keys: {list(data.keys())}"
                    ),
                )
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

            choices = data.get("choices", [])
            if not choices:
                return AIResponse(
                    content="",
                    error=f"OpenAI-compatible returned no choices. Response: {data}",
                )

            choice = choices[0]
            finish_reason = choice.get("finish_reason")
            content = choice.get("message", {}).get("content", "")
            if not content:
                return AIResponse(
                    content="",
                    error=(
                        f"OpenAI-compatible returned empty content. "
                        f"finish_reason: {finish_reason}"
                    ),
                )
            return AIResponse(content=content)

    def _messages_to_prompt(self, messages: List[Dict[str, str]]) -> str:
        prompt_parts = []
        for msg in messages:
            role = msg["role"].capitalize()
            content = msg["content"]
            prompt_parts.append(f"{role}: {content}")
        return "\n\n".join(prompt_parts)
