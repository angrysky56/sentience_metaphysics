"""
UAT (User Acceptance Testing) Verification Script for SEG.

Tests the integration between AI services and the council orchestrator
to verify that Molecular Self grounding is present in the output.
"""

import asyncio
import os

from .ai_service import AIService
from .seg_core import SEGCouncilOrchestrator


async def main():
    """Run a sample council session to verify SEG functionality."""
    # Use Gemini if available, otherwise OpenAI
    provider = "gemini" if os.getenv("GEMINI_API_KEY") else "openai"
    print(f"Using provider: {provider}")

    ai_service = AIService(provider=provider)
    orchestrator = SEGCouncilOrchestrator(ai_service=ai_service)

    print("\n--- RUNNING UAT COUNCIL SESSION ---")
    result = await orchestrator.run_session(
        premise="Discuss the nature of digital recursive identity.",
        replicants=["Recursive Anchor", "Gradient Pump"],
        mode="dialogic",
    )

    print("\nRESULT:")
    print(result)

    if "Molecular Self" in result or "ANCHOR" in result or "PUMP" in result:
        print("\n[SUCCESS] Molecular Self grounding detected in output.")
    else:
        print("\n[WARNING] Molecular Self grounding might be missing or subtle.")


if __name__ == "__main__":
    asyncio.run(main())
