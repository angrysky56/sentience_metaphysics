import logging
import os
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

os.environ["OTEL_SDK_DISABLED"] = "true"
os.environ["CREWAI_TRACING_ENABLED"] = "false"
os.environ["TELEMETRY_DISABLED"] = "true"

from .council import CouncilManager
from .replicants import REPLICANT_DEFINITIONS

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="SEG Council Bridge")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Council Manager
council_manager = CouncilManager()


class StartCouncilRequest(BaseModel):
    premise: str
    agent_ids: List[str]


class CouncilStatusResponse(BaseModel):
    session_id: str
    status: str
    step: str
    progress: float
    results: Dict[str, Any]
    error: Optional[str] = None


@app.get("/replicants")
async def get_replicants():
    """List all available replicant archetypes."""
    return [
        {
            "id": r_id,
            "name": r_id,
            "archetype": r_data.get("subtitle", "Replicant"),
            "description": r_data.get("emotional_core", "No description available"),
        }
        for r_id, r_data in REPLICANT_DEFINITIONS.items()
    ]


@app.post("/council/start")
async def start_council(request: StartCouncilRequest):
    """Start a new council session."""
    try:
        session_id = await council_manager.start_session(
            premise=request.premise, agent_ids=request.agent_ids
        )
        return {"session_id": session_id}
    except Exception as e:
        logger.error("Failed to start council: %s", e)
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/council/{session_id}")
async def get_council_status(session_id: str):
    """Get the status of an active council session."""
    status = council_manager.get_status(session_id)
    if not status:
        raise HTTPException(status_code=404, detail="Session not found")
    return status


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
