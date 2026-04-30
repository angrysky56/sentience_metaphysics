<!-- generated-by: gsd-doc-writer -->
# Backend Documentation (Python)

The SEG Narrative Organisms framework includes a powerful Python-based backend that provides deep persona grounding, multi-persona reasoning (Council), and Model Context Protocol (MCP) support.

## Core Modules

### MCP Server (`mcp_server/server.py`)
Exposes the SEG framework to the Model Context Protocol.
- **Tools:** `generate_persona`, `run_council_session`, `analyze_through_seg_lens`, `create_custom_replicant`, etc.
- **Resources:** `seg://replicants/all`, `seg://framework/components`.
- **Interface:** Stdio-based (compatible with Claude Desktop, etc.).

### Council Bridge (`mcp_server/bridge.py`)
A FastAPI server that acts as a bridge between the React frontend and the Python `CouncilManager`.
- **Port:** 8000
- **Endpoints:**
    - `GET /replicants`: Lists available archetypes.
    - `POST /council/start`: Begins an asynchronous CrewAI-powered reasoning session.
    - `GET /council/{session_id}`: Polls for status and results.

### Council Manager (`mcp_server/council.py`)
Orchestrates multi-agent sessions using **CrewAI**.
- **Logic:** Manages the lifecycle of a council session, including task assignment and persona filtering.
- **Synthesis:** Aggregates responses from multiple replicants into a final dialectic report.

### Replicant Registry (`mcp_server/registry.py` & `mcp_server/replicants.py`)
Manages the library of persona archetypes.
- **Static Replicants:** Immutable, core archetypes (e.g., Bayesian Sage, Comedic Trickster).
- **Custom Replicants:** User-defined personas persisted to disk.

### AI Service (`mcp_server/ai_service.py`)
The Python equivalent of the frontend `AIService`, used for backend-driven generation (e.g., persona expansion or council synthesis).
- **Providers:** Configurable via environment variables (OpenAI, Gemini, etc.).

### Persistence (`mcp_server/persistence.py`)
Handles disk-based storage for custom replicants and session logs.
- **Storage:** Uses JSON files in `mcp_server/data/`.

## Running the Backend

### Standard MCP Server
Used for programmatic integration with other agents.
```bash
uv run -m mcp_server.server
```

### Council Bridge (for UI)
**Required** for the "Council" tab in the React dashboard.
```bash
uv run -m mcp_server.bridge
```

---
*Last Updated: 2026-04-30*
