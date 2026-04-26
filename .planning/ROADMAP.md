# Roadmap: SEG Narrative Organisms

## Milestones

- 🚧 **v1.0 MVP Stabilization** - Phases 1-3 (In Progress)
- 📋 **v1.1 Advanced Reasoners** - Phases 4-5 (Planned)

## Phases

### Phase 1: Codebase Mapping & Initialization
**Goal**: Establish visibility and management over the brownfield codebase.
**Status**: Complete (2026-04-26)
**Success Criteria**:
  1. All 7 codebase mapping files exist in `.planning/codebase/`.
  2. `PROJECT.md` and `ROADMAP.md` accurately reflect system state.
**Plans**: 1 plan
- [x] 01-01: Run /gsd-map-codebase and initialize planning artifacts.

### Phase 2: Testing Infrastructure (Quality Baseline)
**Goal**: Introduce automated verification to prevent regressions in narrative logic.
**Depends on**: Phase 1
**Requirements**: REQ-07
**Success Criteria**:
  1. `vitest` installed and configured for the frontend.
  2. `pytest` installed and configured for the MCP server.
  3. CI pipeline (via Trunk or GitHub Actions) runs tests on commit.
**Plans**: 2 plans
- [ ] 02-01: Set up frontend unit testing for AIService.
- [ ] 02-02: Set up backend testing for MCP tools.

### Phase 3: Persistence & State Management
**Goal**: Allow narrative organisms to survive session resets.
**Depends on**: Phase 2
**Requirements**: REQ-06
**Success Criteria**:
  1. User can refresh the page without losing the current narrative flow.
  2. Persona state is persisted (either localStorage or file-based DB).
**Plans**: 3 plans
- [ ] 03-01: Implement narrative history persistence.
- [ ] 03-02: Synchronize persona state with the MCP server.
- [ ] 03-03: Add "Save/Load Session" capability to the UI.

### Phase 4: Multi-Agent Council Orchestration
**Goal**: Enable collaborative reasoning between multiple Replicants.
**Depends on**: Phase 3
**Requirements**: REQ-09
**Success Criteria**:
  1. User can initiate a "Council" session with 3+ Replicants.
  2. Agents interact with each other's outputs based on their distinct philosophies.
**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Mapping | v1.0 | 1/1 | Complete | 2026-04-26 |
| 2. Testing | v1.0 | 0/2 | Not started | - |
| 3. Persistence | v1.0 | 0/3 | Not started | - |
| 4. Councils | v1.1 | 0/TBD | Not started | - |

---

*Roadmap generated: 2026-04-26*
