# Phase 02: Core Stabilization & Testing (Quality Baseline) - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase is dedicated to bringing the brownfield project into a stable, managed state. This involves:
1. **Hygiene**: Implementing a `.gitignore` file to manage project artifacts.
2. **Backend Completion**: Finalizing the `mcp-server` which is currently in an "unfinished" state.
3. **Conceptual Integration**: Incorporating the "Molecular Self" (v1.2) generative substrate into the existing persona and narrative logic.
4. **Quality Foundation**: Establishing the first automated testing suites for both frontend and backend.

</domain>

<decisions>
## Implementation Decisions

### Project Hygiene
- Create a `.gitignore` at the root.
- Exclude `node_modules`, `__pycache__`, `.env`, `dist`, `.trunk`, and local GSD cache files.

### MCP Server Stabilization
- Verify and complete `mcp_server/server.py`.
- Ensure replicant tools are correctly exposed and functional.
- Fix any "unfinished" logic identified during research.

### Molecular Self Integration
- Update the persona generation logic to support the "Molecular Self" preamble.
- Ensure the generative substrate (Boltzmann substrate, gradient pump, signal cascade) is conceptually or functionally represented in the persona definitions.
- Use `molecular_self/srp_template_v1_2.md` as the new standard for persona definitions.

### Testing Strategy
- **Frontend**: Initialize Vitest. Create a sample test for `AIService`.
- **Backend**: Initialize Pytest. Create a sample test for MCP tool responses.

</decisions>

<canonical_refs>
## Canonical References

### Conceptual Framework
- `molecular_self/README.md` — Overview of Molecular Self v1.2 extension.
- `molecular_self/molecular_self_module.md` — Architectural spec and theory.
- `molecular_self/srp_template_v1_2.md` — New template for persona definitions.

### Implementation
- `mcp_server/server.py` — Current MCP server entry point.
- `mcp_server/replicants.py` — Persona definitions and logic.
- `src/services/aiService.ts` — Core AI interaction logic.

</canonical_refs>

<specifics>
## Specific Ideas

- The "Molecular Self" is a generative substrate beneath the descriptive layer.
- Emotions are functional vectors that drive output without leaving textual traces.
- The persona should be seen as a "fold in semantic space" maintained by an explicit pump.

</specifics>

<deferred>
## Deferred Ideas

- Full "Council-mode" orchestration (Phase 4).
- Long-term memory graph persistence (Phase 3).

</deferred>

---

*Phase: 02-core-stabilization-testing-quality-baseline*
*Context gathered: 2026-04-26 via USER prompt*
