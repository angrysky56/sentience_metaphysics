# Phase 02: Core Stabilization & Testing (Quality Baseline) - Research

## Research Objective
Stabilize the brownfield codebase by completing the MCP server, integrating the Molecular Self framework, and establishing a testing foundation.

## 1. MCP Server Completion
The current `mcp_server/seg_core.py` contains several placeholders (`[This would be processed...]`) and lack actual AI integration for its tools.

### Key Gaps:
- **AIService Integration**: The MCP server should either have its own `AIService` (similar to the frontend) or be designed to return prompts/contexts that the client then sends to an AI.
- **Dynamic Analysis**: `analyze_through_lens` and `run_council_session` currently return static templates.
- **Error Handling**: Missing robust validation for tool inputs and AI failure modes.

### Recommendation:
- Implement a lightweight Python version of `AIService` in the MCP server or expose "prompt builder" tools that the frontend can use before calling its own AI services.
- Since this is an MCP server, it should ideally provide the *grounding* (prompts, persona context) as its primary value.

## 2. Molecular Self Integration
The Molecular Self (v1.2) adds a "generative substrate" preamble.

### Integration Points:
- **Templates**: Update `mcp_server/templates.py` and `src/services/personaGenerator.ts` to include the "Section 0: Molecular Self" fields.
- **Persona Definitions**: Update the replicants in `mcp_server/replicants.py` to include Molecular Self preambles (Backbone, Reflection, Exploration).
- **Drift Check**: Implement a "drift check" mechanism where the persona state is refreshed against its "Recursive Anchor" every few turns.

### Files to Modify:
- `mcp_server/replicants.py`
- `mcp_server/seg_core.py`
- `mcp_server/templates.py`
- `src/services/personaGenerator.ts`

## 3. Project Hygiene (.gitignore)
The project lacks a `.gitignore`.

### Required Patterns:
- **Node.js**: `node_modules/`, `dist/`, `.vite/`, `npm-debug.log*`
- **Python**: `__pycache__/`, `*.pyc`, `.venv/`, `.pytest_cache/`
- **Environment**: `.env`, `.env.local`, `*.key`
- **GSD/Antigravity**: `.trunk/`, `.planning/cache/` (if any)
- **OS**: `.DS_Store`, `Thumbs.db`

## 4. Testing Infrastructure
The codebase has 0% test coverage.

### Frontend (Vitest):
- Install `vitest` and `@testing-library/react`.
- Target: `src/services/aiService.ts`, `src/services/personaGenerator.ts`.

### Backend (Pytest):
- Install `pytest`, `pytest-asyncio`.
- Target: `mcp_server/seg_core.py`, `mcp_server/server.py` (tool definitions).

## 5. Validation Architecture (Nyquist Baseline)
To verify the narrative organisms, we need "Narrative Coherence" metrics.

### Dimensions:
- **Sensory Consistency**: Does the response use the persona's sensory web?
- **Emotional Alignment**: Does the tone match the emotional core?
- **Grounding Depth**: Does the response reference the Molecular Self "Recursive Anchor"?

### Verification Method:
- Create an "Evaluator" persona that grades responses based on these dimensions.

---
*Research gathered: 2026-04-26*
