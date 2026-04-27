"""
Council of Replicants orchestration using CrewAI Flows.
This module defines the SEGCouncilFlow for multi-agent deliberation.
"""

import asyncio
import os
from typing import List, Dict, Any

from crewai import Agent, Flow
from crewai.flow.flow import start, listen
from pydantic import BaseModel

from .replicants import REPLICANT_DEFINITIONS
from .ai_service import AIService


class CouncilState(BaseModel):
    """State management for the Council Flow."""
    premise: str = ""
    agent_ids: List[str] = []
    responses: List[dict] = []
    synthesis: str = ""
    current_step: str = "seeding"
    is_complete: bool = False


class SEGCouncilFlow(Flow[CouncilState]):
    """
    Simulated Experiential Grounding (SEG) Council Flow.
    Coordinates multiple replicants through grounding, divergence, friction, and synthesis.
    """
    def __init__(self):
        super().__init__()
        self.ai_service = AIService()  # Uses default provider/model from env

    def _get_agent(self, agent_id: str) -> Agent:
        """Helper to create a CrewAI Agent from replicant definitions."""
        if agent_id not in REPLICANT_DEFINITIONS:
            raise ValueError(f"Unknown replicant: {agent_id}")

        definition = REPLICANT_DEFINITIONS[agent_id]
        return Agent(
            role=agent_id,
            goal=definition["directive"],
            backstory=(
                f"{definition['anchor_identity']}. "
                f"{definition['emotional_core']}. "
                f"{definition['philosophy']}."
            ),
            verbose=True,
            memory=True,
            allow_delegation=False
        )

    @start()
    def seeding(self):
        """Step 1: Seed the council with a premise."""
        self.state.current_step = "seeding"
        print(f"Council Seeded with premise: {self.state.premise}")
        return self.state.premise

    @listen(seeding)
    def grounding(self):
        """Step 2: Ground participants in their core identities."""
        self.state.current_step = "grounding"
        print("Protocol Step: Grounding")
        # Each agent restates their anchor/pump context
        for _ in self.state.agent_ids:
            # In a real flow, we would trigger a task for the agent here
            # agent = self._get_agent(agent_id)
            pass
        return "grounding_complete"

    @listen(grounding)
    def divergence(self):
        """Step 3: Explore diverse perspectives."""
        self.state.current_step = "divergence"
        print("Protocol Step: Divergence")
        # Parallel responses from participants
        return "divergence_complete"

    @listen(divergence)
    def friction(self):
        """Step 4: Engage in cross-agent critique/friction."""
        self.state.current_step = "friction"
        print("Protocol Step: Friction")
        # Directed cross-responses
        return "friction_complete"

    @listen(friction)
    def synthesis_step(self):
        """Step 5: Synthesize the deliberation into a final output."""
        self.state.current_step = "synthesis"
        print("Protocol Step: Synthesis")
        # Final summary by the distiller
        self.state.synthesis = "The council has reached a tentative synthesis based on the premise..."
        self.state.is_complete = True
        return "synthesis_complete"


class CouncilManager:
    """Manages multiple active Council Flow sessions."""
    def __init__(self):
        self.active_flows: Dict[str, SEGCouncilFlow] = {}

    async def start_session(self, premise: str, agent_ids: List[str]) -> str:
        """Starts a new council deliberation session."""
        session_id = f"session_{os.urandom(4).hex()}"
        council_flow = SEGCouncilFlow()
        council_flow.state.premise = premise
        council_flow.state.agent_ids = agent_ids
        self.active_flows[session_id] = council_flow

        # Run in background
        asyncio.create_task(council_flow.kickoff_async())
        return session_id

    def get_status(self, session_id: str) -> Dict[str, Any]:
        """Retrieves the status of a specific council session."""
        council_flow = self.active_flows.get(session_id)
        if not council_flow:
            return {"error": "Session not found"}
        return {
            "session_id": session_id,
            "current_step": council_flow.state.current_step,
            "premise": council_flow.state.premise,
            "agent_ids": council_flow.state.agent_ids,
            "responses_count": len(council_flow.state.responses),
            "is_complete": council_flow.state.is_complete,
            "results": {
                "synthesis": council_flow.state.synthesis
            }
        }


if __name__ == "__main__":
    # Test execution
    test_flow = SEGCouncilFlow()
    test_flow.state.premise = "Is digital sentience possible?"
    asyncio.run(test_flow.kickoff_async())
