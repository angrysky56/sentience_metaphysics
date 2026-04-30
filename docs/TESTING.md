<!-- generated-by: gsd-doc-writer -->
# Testing Guide

This document explains how to run tests and the testing strategy for the SEG project.

## Test Runner

The project uses **Vitest** for unit and integration testing.

## Running Tests

### Frontend (TypeScript/Vitest)

- **Run all tests:**
    ```bash
    npm test
    ```
- **Watch mode:**
    ```bash
    npx vitest
    ```

### Backend (Python/pytest)

Ensure you have `pytest` installed:

- **Run all tests:**
    ```bash
    uv run pytest mcp_server/tests
    ```
- **Run with output:**
    ```bash
    uv run pytest -s mcp_server/tests
    ```

## Testing Strategy

### Unit Tests
Located in `__tests__` directories alongside the code they test (e.g., `src/services/__tests__`).
- `aiService.test.ts`: Mocks Axios to verify correct provider calls.
- `personaGenerator.test.ts`: Verifies persona structure and fallback logic.

### Component Tests
Currently, the project focuses on service-level testing. Future UI tests will use `@testing-library/react`.

## Mocking AI Responses

When writing tests for services that use the `AIService`, use Vitest's mocking capabilities to avoid real API calls:

```typescript
vi.mock('@/services/aiService', () => ({
  AIService: vi.fn().mockImplementation(() => ({
    generateResponse: vi.fn().mockResolvedValue({ content: 'Mocked response' })
  }))
}));
```

---
*Last Updated: 2026-04-30*
