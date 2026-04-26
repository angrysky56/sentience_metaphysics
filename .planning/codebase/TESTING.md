# Testing Strategy

**Analysis Date:** 2026-04-26

## Overview

**Current Status:** **NOT IMPLEMENTED**
- No test files (`*.test.ts`, `*.spec.ts`, `tests/`) were found in the codebase.
- No test scripts exist in `package.json`.

## Gaps Identified

1. **Unit Testing:** Missing for core logic in `src/services/` (especially `AIService`).
2. **Integration Testing:** Missing for frontend component interactions.
3. **Backend Testing:** No tests for the Python MCP server (`server.py`).
4. **Validation:** No automated verification for persona generation logic.

## Recommended Strategy

**Priority 1: Logic Verification**
- Introduce `vitest` or `jest` for testing `AIService.ts` and `personaGenerator.ts`.
- Mock external AI provider responses to ensure robust handling of edge cases.

**Priority 2: MCP Server Testing**
- Use `pytest` for testing Python server logic.
- Verify that tool registration and response formatting align with the MCP spec.

**Priority 3: Component Testing**
- Implement `React Testing Library` for critical UI components (e.g., narrative display).

**Priority 4: Narrative Evaluation**
- Develop "narrative organisms" specific tests to verify grounding consistency over long sessions.

## Tooling Recommendations

- **Frontend:** Vitest, React Testing Library.
- **Backend:** Pytest.
- **E2E:** Playwright (for verifying full narrative flows).

---

*Testing audit: 2026-04-26*
*Update after implementing the first test suite*
