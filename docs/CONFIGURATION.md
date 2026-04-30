<!-- generated-by: gsd-doc-writer -->
# Configuration Guide

This document describes how to configure the SEG Narrative Organisms application and its various AI service integrations.

## Environment Variables

Since this is a Vite-based frontend application, configuration is primarily handled via browser storage or `.env` files for build-time settings.

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_PORT` | The local development server port | `3000` |
| `VITE_HOST` | Whether to expose the server to the network | `true` |

## Application Settings

The "Settings" tab within the application allows you to configure the `AIService` and persona behavior.

### AI Provider Configuration

The application supports four primary AI providers:

1.  **Ollama (Local)**
    - `Base URL`: Typically `http://localhost:11434`
    - `Model`: e.g., `llama3`, `mistral`
2.  **LM Studio (Local)**
    - `Base URL`: Typically `http://localhost:1234`
    - `Model`: Specified in LM Studio
3.  **OpenAI**
    - `API Key`: Required
    - `Model`: e.g., `gpt-4o`, `gpt-3.5-turbo`
4.  **Gemini**
    - `API Key`: Required
    - `Model`: e.g., `gemini-1.5-pro`

### SEG Behavioral Settings

These settings control the "subtlety" and "opacity" of the persona's influence on the narrative:

-   **Persona Opacity:** How much the persona's core traits influence the response (0.0 to 1.0).
-   **Metaphor Bias:** Tendency to use metaphorical language.
-   **Belief Interjection Prob:** Chance of inserting core beliefs into dialogue.
-   **Subtlety Mode:** When enabled, prioritizes nuance and implication over directness.
-   **Max Weave Chars:** Limits the length of memory-based context injected into prompts.

## Storage

The application uses **Browser LocalStorage** for all persistence:
- `seg_current_session`: Stores the active `SegState` and `ConversationHistory`.
- `seg_persona_library`: Stores saved persona archetypes.
- `seg_ai_config`: Stores your AI provider settings (API keys are stored locally in your browser).

## Development Configuration

- **Vite Config:** Located in `vite.config.ts`.
- **TypeScript Config:** Located in `tsconfig.json`.
- **Tailwind Config:** Located in `tailwind.config.js`.

---
*Last Updated: 2026-04-30*
