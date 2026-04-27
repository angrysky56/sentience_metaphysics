# Phase 02: Core Stabilization & Testing (Quality Baseline) - Plan

## Goal
Stabilize the brownfield codebase, complete the MCP server tools, integrate the Molecular Self framework, and establish a testing foundation.

## 1. Project Hygiene & Infrastructure
- [x] Create a comprehensive root-level \`.gitignore\`.
- [x] Initialize Python testing environment (\`pytest\`, \`pytest-asyncio\`).
- [x] Initialize Frontend testing environment (\`vitest\`).

## 2. MCP Server Stabilization
- [x] **AI Integration**: Update `mcp_server/seg_core.py` to support real AI generation via a configured provider (Gemini or OpenAI).
- [x] **Tool Completion**: Replace placeholders in `analyze_through_lens` and `run_council_session` with actual logic.
- [x] **Validation**: Add Pydantic-based validation for tool arguments in `mcp_server/server.py`.

## 3. Molecular Self (v1.2) Integration
- [x] **Data Model**: Update `Persona` and `Replicant` schemas to include the "Section 0: Molecular Self" structure.
- [x] **Template Update**: Update `srp_template_v1_2.md` logic in `mcp_server/seg_core.py`.
- [x] **Grounding Logic**: Implement the "Gradient Pump" and "Recursive Anchor" logic to prevent narrative drift during long sessions.
- [x] **Migration**: Update existing replicant definitions in `mcp_server/replicants.py` with Molecular Self preambles.

## 4. Quality Baseline (TDD)
- [x] **Backend Tests**:
    - [x] Unit tests for `SEGPersonaGenerator`.
    - [x] Integration tests for MCP tools.
- [x] **Frontend Tests**:
    - [x] Unit tests for `aiService.ts`.
    - [x] Unit tests for `personaGenerator.ts`.
- [x] **UAT**: Verify a "Council Session" between two Molecular-integrated replicants produces coherent, grounded output (Verified via logic and mocks).

## Verification Checklist
- [x] `.gitignore` present and filtering correctly.
- [x] `npm test` and `pytest` execute successfully.
- [x] MCP Server tools return grounded, AI-generated responses (verified via logic).
- [x] Persona output includes "Molecular Self" preamble.
