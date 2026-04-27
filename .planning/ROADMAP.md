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

### Phase 2: Core Stabilization & Testing (Quality Baseline)
**Goal**: Stabilize the core infrastructure by finishing the MCP server, adding basic project hygiene (.gitignore), and integrating the "Molecular Self" conceptual framework.
**Status**: Complete (2026-04-26)
**Depends on**: Phase 1
**Requirements**: REQ-03, REQ-07
**Success Criteria**:
  1. `.gitignore` exists and excludes standard build artifacts/secrets.
  2. MCP server is functional and exposes the core replicant logic.
  3. "Molecular Self" generative substrate is integrated into the persona system.
  4. Basic testing infrastructure (Vitest/Pytest) is established.
**Plans**: 3 plans
- [x] 02-01: Project hygiene and basic infrastructure (.gitignore, server fix).
- [x] 02-02: Integrate "Molecular Self" generative substrate.
- [x] 02-03: Establish testing baseline (Vitest and Pytest).

### Phase 3: Persistence & State Management
**Goal**: Allow narrative organisms to survive session resets.
**Status**: Complete (2026-04-26)
**Depends on**: Phase 2
**Requirements**: REQ-06
**Success Criteria**:
  1. User can refresh the page without losing the current narrative flow.
  2. Persona state is persisted (either localStorage or file-based DB).
**Plans**: 3 plans
- [x] 03-01: Implement backend persona persistence (Registry & File I/O).
- [x] 03-02: Implement frontend narrative history (LocalStorage & Service).
- [x] 03-03: Implement UI session management (Save/Load & History controls).

### Phase 4: Multi-Agent Council Orchestration
**Goal**: Enable collaborative reasoning between multiple Replicants.
**Status**: In Progress
**Depends on**: Phase 3
**Requirements**: REQ-09
**Success Criteria**:
  1. User can initiate a "Council" session with 3+ Replicants.
  2. Agents interact with each other's outputs based on their distinct philosophies.
**Plans**: 9 tasks
- [ ] 04-01: Install Dependencies and Initialize Council Logic
- [ ] 04-02: Implement 5-Step Protocol (TDD)
- [ ] 04-03: Expose Council Tools via MCP
- [ ] 04-04: Create CouncilView Component
- [ ] 04-05: Implement Council Timeline & Animations
- [ ] 04-06: Council State Management
- [ ] 04-07: Instrumentation with Arize Phoenix
- [ ] 04-08: Drift Guard & Regex Verification
- [ ] 04-09: End-to-End Council Verification

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Mapping | v1.0 | 1/1 | Complete | 2026-04-26 |
| 2. Stabilization | v1.0 | 3/3 | Complete | 2026-04-26 |
| 3. Persistence | v1.0 | 3/3 | Complete | 2026-04-26 |
| 4. Councils | v1.1 | 0/9 | In Progress | - |

---

*Roadmap generated: 2026-04-26*
