# Phase 4: Multi-Agent Council Orchestration - Plan

**Status:** Ready for execution
**Goal:** Implement collaborative reasoning between multiple Replicants using CrewAI.

## Waves

### Wave 1: Backend Foundation (CrewAI & MCP)
- **04-01: Install Dependencies and Initialize Council Logic**
  - Add `crewai` to `pyproject.toml` and install.
  - Create `mcp_server/council.py` with the base `CouncilFlow` using CrewAI.
- **04-02: Implement 5-Step Protocol (TDD)**
  - Implement Seeding, Grounding, Divergence, Friction, and Synthesis in `CouncilFlow`.
  - Add unit tests in `mcp_server/tests/test_council.py`.
- **04-03: Expose Council Tools via MCP**
  - Add `start_council_session`, `council_turn`, and `get_council_history` tools to `mcp_server/server.py`.

### Wave 2: Frontend UI (Council View)
- **04-04: Create CouncilView Component**
  - Build the React component for the Council interface.
  - Implement participant selection and premise input.
- **04-05: Implement Council Timeline & Animations**
  - Use Framer Motion for smooth transitions between protocol steps.
  - Display agent outputs with distinct philosophical filters.
- **04-06: Council State Management**
  - Integrate with `historyService` to persist council sessions.
  - Handle real-time updates from the MCP tools.

### Wave 3: Integration & Evaluation
- **04-07: Instrumentation with Arize Phoenix**
  - Add tracing to the CouncilFlow using OpenInference.
- **04-08: Drift Guard & Regex Verification**
  - Implement the "Drift Guard" to catch generic AI language.
- **04-09: End-to-End Council Verification**
  - Run a complete council session and verify against the success criteria.

---

## Tasks

### [04-01] Install Dependencies and Initialize Council Logic
<read_first>
- `mcp_server/setup.py`
- `pyproject.toml`
</read_first>
<action>
1. Add `crewai[tools]` to the dependencies in `pyproject.toml` and `mcp_server/requirements.txt`.
2. Run `uv pip install crewai[tools]`.
3. Create a skeleton `mcp_server/council.py` that imports `Flow` from `crewai`.
</action>
<acceptance_criteria>
- `pyproject.toml` contains `crewai`.
- `mcp_server/council.py` exists and is a valid Python file.
- `python -c "from crewai import Flow"` exits 0.
</acceptance_criteria>

### [04-02] Implement 5-Step Protocol (TDD)
<read_first>
- `mcp_server/replicants.py`
- `.planning/phases/04-multi-agent-council-orchestration/04-CONTEXT.md`
</read_first>
<action>
1. Define the `SEGCouncilFlow` class in `mcp_server/council.py`.
2. Implement the 5 steps: `seeding`, `grounding`, `divergence`, `friction`, `synthesis` as decorated methods in the Flow.
3. Ensure agents are instantiated using the personas from `replicants.py`.
4. Create `mcp_server/tests/test_council.py` and implement tests for each step.
</action>
<acceptance_criteria>
- `mcp_server/council.py` contains the `SEGCouncilFlow` class with all 5 steps.
- `pytest mcp_server/tests/test_council.py` passes.
- Agents maintain their "Anchor" context during the `grounding` step.
</acceptance_criteria>

### [04-03] Expose Council Tools via MCP
<read_first>
- `mcp_server/server.py`
</read_first>
<action>
1. Import `SEGCouncilFlow` in `server.py`.
2. Add three new tools:
   - `start_council_session(premise, agent_ids)`
   - `council_turn(session_id, user_input)`
   - `get_council_history()`
3. Implement the logic to instantiate and run the Flow within these tools.
</action>
<acceptance_criteria>
- `mcp_server/server.py` lists the 3 new tools.
- `mcp-inspect mcp_server/server.py` (or equivalent) shows the new tools available.
</acceptance_criteria>

### [04-04] Create CouncilView Component
<read_first>
- `src/components/SegV3.tsx`
- `src/services/aiService.ts`
</read_first>
<action>
1. Create `src/components/CouncilView.tsx`.
2. Implement a layout with:
   - Sidebar for participant selection.
   - Main area for the conversation timeline.
   - Input bar for the initial premise.
3. Register the new view in `SegV3.tsx`.
</action>
<acceptance_criteria>
- `src/components/CouncilView.tsx` exists.
- The UI allows selecting multiple Replicants.
- A "Start Council" button triggers the `start_council_session` tool.
</acceptance_criteria>

### [04-05] Implement Council Timeline & Animations
<read_first>
- `src/index.css`
</read_first>
<action>
1. Use `framer-motion` to animate the entry of agent responses.
2. Create distinct visual styles for each protocol step (e.g., color-coded headers).
3. Implement the "Tension Meter" visual component.
</action>
<acceptance_criteria>
- Responses animate in smoothly.
- The current step (e.g., "Friction") is clearly visible in the UI.
</acceptance_criteria>

### [04-06] Council State Management
<read_first>
- `src/services/historyService.ts`
</read_first>
<action>
1. Update `historyService.ts` to handle `CouncilSession` types.
2. Ensure that council interactions are saved to LocalStorage and can be resumed.
</action>
<acceptance_criteria>
- Refreshing the page during a council session preserves the history.
- `get_council_history` from the MCP server is called to sync past sessions.
</acceptance_criteria>

### [04-07] Instrumentation with Arize Phoenix
<read_first>
- `mcp_server/setup.py`
</read_first>
<action>
1. Install `arize-phoenix` and `openinference-instrumentation-crewai`.
2. Initialize the Phoenix tracer in `mcp_server/council.py`.
</action>
<acceptance_criteria>
- `arize-phoenix` is installed.
- Traces are visible in the Phoenix UI when running a council session.
</acceptance_criteria>

### [04-08] Drift Guard & Regex Verification
<read_first>
- `mcp_server/council.py`
</read_first>
<action>
1. Add a post-processing step to the `CouncilFlow` that checks for "assistant" language.
2. If drift is detected, inject a "Remember your Anchor" prompt and re-run the step (max 1 retry).
</action>
<acceptance_criteria>
- A response containing "I am an AI assistant" triggers a retry or a warning.
</acceptance_criteria>

### [04-09] End-to-End Council Verification
<read_first>
- `mcp_server/verify_uat.py`
</read_first>
<action>
1. Run a full 5-step council session with 3 agents.
2. Manually verify that the agents engaged in "Friction" and reached a "Synthesis".
3. Record the session results in `VERIFICATION.md`.
</action>
<acceptance_criteria>
- A full council session completes without error.
- All 5 steps are logged in the trace.
</acceptance_criteria>
