# System Concerns

**Analysis Date:** 2026-04-26

## Critical Risks

**1. Lack of Automated Testing:**
- The codebase currently has zero test coverage.
- **Impact:** High risk of regressions when modifying core narrative logic or switching AI providers.

**2. Tight Coupling to External APIs:**
- `AIService` relies on direct Axios calls to external providers.
- **Impact:** Fragile if API schemas change or rate limits are hit without robust retry/fallback logic.

## Technical Debt

**1. State Management:**
- The system appears to rely on React component state or props for complex narrative history.
- **Concern:** May lead to "prop drilling" or state sync issues as the application grows.

**2. Error Boundaries:**
- Limited global error handling for AI response failures.
- **Concern:** API failures might leave the UI in an inconsistent or "loading forever" state.

## Operational Concerns

**1. Local Inference Performance:**
- Support for Ollama and LM Studio implies heavy local compute requirements.
- **Concern:** User experience may degrade significantly on machines without dedicated GPUs.

**2. MCP Server Maturity:**
- The Python backend is a separate process.
- **Concern:** Service discovery and lifecycle management between the React frontend and Python backend are not explicitly handled in the current build scripts.

## Strategic Gaps

**1. Memory Persistence:**
- No database is present.
- **Gap:** Long-term "experiential grounding" may be lost between page refreshes unless local storage is being used extensively (needs verification).

**2. Narrative Coherence:**
- "Molecular Personas" are complex.
- **Gap:** Without structured evaluation metrics, verifying that AI responses maintain philosophical alignment is subjective and difficult to automate.

---

*Concerns audit: 2026-04-26*
*Update as issues are resolved or new risks appear*
