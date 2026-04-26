# Architecture

**Analysis Date:** 2026-04-26

## Pattern Overview

**Overall:** Decoupled Frontend-Backend (MCP) Architecture

**Key Characteristics:**
- **React Frontend**: Modern SPA for interaction and visualization.
- **Python MCP Server**: Encapsulates core logic, persona management, and grounding frameworks.
- **Service-Oriented**: Frontend communicates with AI providers and the local MCP server via standardized services.
- **Persona-Driven**: System behavior is centered around "Replicants" and "Molecular Self" frameworks.

## Layers

**Frontend Presentation Layer:**
- Purpose: Render UI components and handle user interactions.
- Contains: React components, hooks, styling.
- Location: `src/components/`
- Depends on: Frontend Service Layer.

**Frontend Service Layer:**
- Purpose: Abstract external API calls and business logic.
- Contains: `AIService`, `personaGenerator`, `types`.
- Location: `src/services/`
- Depends on: `axios`, `lib/utils`.

**Backend Logic Layer (MCP):**
- Purpose: Provide structured AI capabilities and specialized reasoning.
- Contains: `server.py`, `replicants.py`, `seg_core.py`.
- Location: `mcp_server/`
- Depends on: Python libraries (`anyio`, `mcp`).

**Knowledge/Data Layer:**
- Purpose: Store static persona definitions and theoretical frameworks.
- Contains: Markdown files, templates.
- Location: `molecular_self/`, `docs/`.

## Data Flow

**Narrative Generation Flow:**

1. User interacts with UI (e.g., `SegV3.tsx`).
2. Component calls `AIService.generateResponse`.
3. `AIService` routes request to selected provider (OpenAI, Gemini, Ollama).
4. Prompt is enriched with system prompts and persona context.
5. Response is returned to UI for rendering.

**MCP Integration Flow:**

1. Frontend (or AI client) connects to MCP server.
2. Server exposes tools/resources defined in `server.py`.
3. Logic in `replicants.py` or `seg_core.py` is invoked.
4. Results are streamed back through the MCP protocol.

## Key Abstractions

**AIService:**
- Purpose: Unified interface for multiple LLM providers.
- Location: `src/services/aiService.ts`
- Pattern: Strategy/Factory pattern.

**Replicant:**
- Purpose: Specialized AI persona with distinct sensory and emotional cores.
- Location: `mcp_server/replicants.py`
- Pattern: Structured configuration / Data object.

**Molecular Self:**
- Purpose: Framework for dynamic identity and experiential grounding.
- Location: `molecular_self/`
- Pattern: Conceptual framework documented in Markdown.

## Entry Points

**Frontend Entry:**
- Location: `src/main.tsx`
- Triggers: Browser page load.
- Responsibilities: Initialize React, mount App component.

**MCP Server Entry:**
- Location: `mcp_server/server.py`
- Triggers: Manual execution or daemon start.
- Responsibilities: Listen for MCP connections, register tools.

## Error Handling

**Strategy:** Exception bubbling with UI-level display.

**Patterns:**
- `try/catch` blocks in `AIService` returning error messages in response objects.
- Axios interceptors or per-call handling for network issues.

## Cross-Cutting Concerns

**Styling:**
- Tailwind CSS utility classes and Radix UI primitives.
- Dark mode support configured via "class" strategy.

**Formatting:**
- Trunk and ESLint for code quality and consistency.

---

*Architecture analysis: 2026-04-26*
*Update when major patterns change*
