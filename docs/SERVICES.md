<!-- generated-by: gsd-doc-writer -->
# Service Documentation

This document describes the domain services responsible for the logic and data management of the SEG framework.

## Core Services

### AIService (`src/services/aiService.ts`)
The `AIService` provides a unified interface for interacting with various LLM providers.
- **Supported Providers:** Ollama, LM Studio, OpenAI, Gemini.
- **Key Method:** `generateResponse(messages, systemPrompt)` - Processes multi-turn dialogue with provider-specific formatting.
- **Factory:** Use `createAIService(config)` to instantiate.

### PersonaGenerator (`src/services/personaGenerator.ts`)
Responsible for creating complex, grounded persona archetypes.
- **Logic:** Uses the `AIService` to generate backstory, beliefs, and sensory anchors based on a provided context or random selection.
- **Consistency:** Ensures generated personas adhere to the `GeneratedPersona` interface.

### HistoryService (`src/services/historyService.ts`)
Manages the persistence of sessions and memory.
- **Storage:** Interfaces with `localStorage`.
- **Methods:**
    - `saveCurrentSession(state, conversation)`: Serializes and stores the active state.
    - `loadCurrentSession()`: Retrieves and hydrates the last active session.

### CouncilService (`src/services/councilService.ts`)
Orchestrates multi-persona reasoning sessions.
- **Dialectic:** Manages the flow of interaction between multiple distinct personas to explore a single premise.

### PersonaLibrary (`src/services/personaLibrary.ts`)
A repository for saving and loading persona templates.
- **Persistence:** Allows users to save a "snapshot" of a generated persona for future use.

## Data Models (`src/services/types.ts`)

- **Persona:** Deep identity structure.
- **Memory:** Experiential data unit.
- **Emotion:** Valence/Arousal based mood state.
- **AIServiceConfig:** Provider configuration settings.

---
*Last Updated: 2026-04-30*
