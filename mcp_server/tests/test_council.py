import pytest
import asyncio
from mcp_server.council import SEGCouncilFlow, CouncilState

@pytest.mark.asyncio
async def test_council_flow_initialization():
    flow = SEGCouncilFlow()
    flow.state.premise = "Test Premise"
    flow.state.agent_ids = ["Bayesian Sage", "Essentia Distiller"]
    
    # We won't run the full kickoff here to avoid API calls in tests
    # but we can verify the state
    assert flow.state.premise == "Test Premise"
    assert len(flow.state.agent_ids) == 2

@pytest.mark.asyncio
async def test_protocol_steps_exist():
    flow = SEGCouncilFlow()
    assert hasattr(flow, "seeding")
    assert hasattr(flow, "grounding")
    assert hasattr(flow, "divergence")
    assert hasattr(flow, "friction")
    assert hasattr(flow, "synthesis_step")

def test_council_state_schema():
    state = CouncilState(premise="Hello", agent_ids=["A", "B"])
    assert state.premise == "Hello"
    assert state.agent_ids == ["A", "B"]
    assert state.responses == []
