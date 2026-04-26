# Code Conventions

**Analysis Date:** 2026-04-26

## General Principles

- **Framework Alignment:** Follow React 18 patterns (hooks over classes).
- **Type Safety:** Strict TypeScript usage for all frontend logic.
- **Asynchronicity:** Extensive use of `async/await` for both TS and Python.
- **Modularity:** Separation of UI (components) from Logic (services/MCP).

## TypeScript Conventions

**Naming:**
- PascalCase for React components and types.
- camelCase for variables, functions, and service instances.
- kebab-case for CSS modules or tailwind configuration.

**Structure:**
- Use functional components with hooks.
- Interfaces for all API response shapes and component props.
- Service pattern for external communication (e.g., `AIService`).

**Styling:**
- Atomic styling using Tailwind CSS.
- Component variance managed via `cva` (Class Variance Authority).

## Python Conventions

**Style:**
- Follow PEP 8 guidelines.
- Use type hints for all function signatures.

**Pattern:**
- Asynchronous functions (`async def`) preferred for I/O and server logic.
- MCP SDK usage for exposing tools and resources.

## Tooling & Automation

- **Linting:** Trunk and ESLint enforced via `.trunk` configuration.
- **Build:** Vite handles the frontend build pipeline.

## Documentation

- **Philosophy:** Extensive inline comments are rare, but architecture is heavily documented in `docs/` and `molecular_self/`.
- **System Prompts:** Stored as structured constants in service files.

---

*Conventions audit: 2026-04-26*
*Update when standardizing new patterns*
