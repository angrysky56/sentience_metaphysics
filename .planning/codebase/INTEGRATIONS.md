# External Integrations

**Analysis Date:** 2026-04-26

## APIs & External Services

**AI Service Integration:**
- **OpenAI API** - Used for narrative generation
  - Integration method: REST API via `axios` in `src/services/aiService.ts`
  - Auth: Bearer token in `apiKey` config
- **Google Gemini API** - Used for advanced reasoning
  - Integration method: REST API via `axios`
  - Auth: API key in URL query parameter
- **Ollama** - Local AI inference
  - Integration method: REST API (`/api/generate`)
  - Auth: None (local)
- **LM Studio** - Local AI inference (OpenAI-compatible)
  - Integration method: REST API (`/v1/chat/completions`)
  - Auth: None (local)

## Data Storage

**Databases:**
- **None detected** - The system appears to use file-based state or ephemeral session data.
- **Python MCP Server** - Likely serves as a stateful or logic-heavy integration point.

**File Storage:**
- **Local Filesystem** - Used for storing persona definitions (`molecular_self/personas/`) and documentation.

## Authentication & Identity

**Auth Provider:**
- **None currently** - The application seems to be a single-user or local-first tool without a dedicated auth provider.
- **API Keys** - Managed via configuration objects passed to `AIService`.

## Monitoring & Observability

**Logs:**
- **Console logs** - Standard browser console output.
- **MCP Server output** - Python stdout/stderr for backend debugging.

## CI/CD & Deployment

**Hosting:**
- **Vite Dev Server** - Local development on port 3000.
- **MCP Server** - Runs as a separate process (likely via `python mcp_server/server.py`).

**CI Pipeline:**
- **Trunk** - `.trunk` directory suggests the use of Trunk for linting and code quality.

## Environment Configuration

**Development:**
- Required env vars: `OPENAI_API_KEY`, `GEMINI_API_KEY` (if using cloud providers).
- Local endpoints: `http://localhost:11434` (Ollama), `http://localhost:1234` (LM Studio).

## Webhooks & Callbacks

**Incoming:**
- **None detected.**

**Outgoing:**
- **None detected.**

---

*Integration audit: 2026-04-26*
*Update when adding/removing external services*
