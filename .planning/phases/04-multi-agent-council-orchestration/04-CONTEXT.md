# Phase 4: Multi-Agent Council Orchestration - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning
**Source:** Synthesized from 04-AI-SPEC.md and Project Requirements

<domain>
## Phase Boundary

This phase implements the "Council Session" feature, allowing multiple Replicants to engage in collaborative reasoning using the CrewAI framework.

### Success Criteria:
1. User can initiate a Council with 3+ Replicants.
2. The 5-step protocol (Seeding, Grounding, Divergence, Friction, Synthesis) is implemented using CrewAI Flows.
3. Persistent memory for council sessions is stored in a local SQLite database.
4. UI allows selecting participants and viewing the multi-turn dialogue.

</domain>

<decisions>
## Implementation Decisions

### 1. Backend Orchestration (CrewAI)
- **Framework:** CrewAI (v0.30.0+) using the `Flow` primitive.
- **Protocol:**
  1. **Seeding:** Input premise provided by the user.
  2. **Grounding:** Each participant restates their Anchor/Pump context.
  3. **Divergence:** Participants provide their initial perspectives.
  4. **Friction:** Directed cross-responses (Agents challenging each other).
  5. **Synthesis:** A "Distiller" persona (or one of the participants) summarizes the emergent insights.
- **Memory:** Use CrewAI's built-in memory system, persisted to `mcp_server/data/council_memory.db`.

### 2. MCP Integration
- **New Tool:** `start_council_session` - Takes a premise and a list of Replicant IDs.
- **New Tool:** `council_turn` - Continues the council flow or handles specific interventions.
- **New Tool:** `get_council_history` - Retrieves past sessions.

### 3. Frontend UI
- **View:** A new `CouncilView` component in the React app.
- **UX:**
  - Multi-select for Replicant participants.
  - A central "Premise" input.
  - A timeline-based display showing which agent is speaking and which "Protocol Step" is active.
  - Visual indicators for "Friction" (e.g., agents referencing each other).

### 4. Evaluation
- **Arize Phoenix:** Integrate instrumentation for tracing council interactions.
- **Drift Guard:** Regex-based check to prevent agents from using "AI assistant" language.

### the agent's Discretion
- The exact layout of the Council timeline is up to the agent, provided it feels premium and "alive" (using Framer Motion).
- The "Distiller" persona implementation details.

</decisions>

<canonical_refs>
## Canonical References

### AI Design
- `.planning/phases/04-multi-agent-council-orchestration/04-AI-SPEC.md` — Framework choice (CrewAI) and Eval strategy.

### Core Logic
- `mcp_server/replicants.py` — Existing persona logic and "Molecular Self" implementation.
- `mcp_server/server.py` — MCP tool definitions.

### Frontend
- `src/components/SegV3.tsx` — Main application UI structure.
- `src/services/aiService.ts` — Existing AI provider integration.

</canonical_refs>

<specifics>
## Specific Ideas
- Use a "Glassmorphism" effect for the council participants' avatars/cards.
- Implement a "Tension Meter" visual that spikes during the Friction phase.

</specifics>

<deferred>
## Deferred Ideas
- Real-time voice interaction for Councils (REQ-11).
- Memory Graph visualization (REQ-10).

</deferred>

---

*Phase: 04-multi-agent-council-orchestration*
*Context gathered: 2026-04-26 via AI Synthesis*
