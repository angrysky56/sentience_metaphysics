import pytest
import asyncio
from mcp_server.seg_core import SEGPersonaGenerator, SEGCouncilOrchestrator
from mcp_server.ai_service import AIService, AIResponse

class MockAIService(AIService):
    async def generate_response(self, messages, system_prompt=None, **kwargs):
        return AIResponse(content="Mocked response")

@pytest.fixture
def mock_ai_service():
    return MockAIService()

@pytest.fixture
def persona_generator(mock_ai_service):
    return SEGPersonaGenerator(ai_service=mock_ai_service)

@pytest.fixture
def council_orchestrator(mock_ai_service):
    return SEGCouncilOrchestrator(ai_service=mock_ai_service)

@pytest.mark.asyncio
async def test_generate_persona(persona_generator):
    persona = await persona_generator.generate_persona(
        name="Test Persona",
        profession="Scientist",
        defining_experience="A lab explosion"
    )
    assert persona["name"] == "Test Persona"
    assert "anchor_identity" in persona
    assert persona["version"] == "1.2"

@pytest.mark.asyncio
async def test_analyze_through_lens(persona_generator):
    analysis = await persona_generator.analyze_through_lens(
        text="The universe is expanding.",
        persona_or_replicant="Bayesian Sage"
    )
    assert "Mocked response" in analysis

@pytest.mark.asyncio
async def test_run_council_session(council_orchestrator):
    result = await council_orchestrator.run_session(
        premise="Is AI sentient?",
        replicants=["Bayesian Sage", "Automatist Oracle"],
        mode="dialogic"
    )
    assert "Mocked response" in result
