<!-- generated-by: gsd-doc-writer -->
# Architecture: SEG Narrative Organisms

This document outlines the architectural principles and system design of the Sentience Metaphysics (SEG Framework v3) project.

## System Overview

The SEG (Simulated Experiential Grounding) framework is designed to create "Living Narrative Organisms" (Replicants) that possess dynamic memory, transient emotional states, and persona-driven context enrichment.

The system is a hybrid architecture consisting of a React-based Single Page Application (SPA) and a Python-based backend service. The frontend handles the primary interactive dashboard, while the Python backend provides deep persona grounding, multi-persona reasoning (Council), and Model Context Protocol (MCP) support.

## Component Diagram

```mermaid
graph TD
    User[User Interface] --> SegV3[SegV3 Dashboard]
    
    subgraph Frontend [React SPA]
        SegV3 --> UI[Radix UI / Framer Motion]
        SegV3 --> Gen[PersonaGenerator]
        SegV3 --> History[HistoryService]
        SegV3 --> AI_FE[AIService (FE)]
    end
    
    subgraph Backend [Python / FastAPI]
        Bridge[Council Bridge] --> CouncilMgr[CouncilManager]
        CouncilMgr --> CrewAI[CrewAI / Agents]
        MCP[MCP Server] --> Registry[ReplicantRegistry]
        Registry --> Data[(Local JSON Data)]
    end
    
    SegV3 --> Bridge
    Bridge --> Registry
    
    AI_FE --> Providers[AI Providers (OpenAI/Gemini/Ollama)]
    CrewAI --> Providers
    
    History --> LocalStorage[(Browser LocalStorage)]
```

## Data Flow

1.  **Initialization:** The `SegV3` component loads the current session from `HistoryService`. If none exists, a fallback or new persona is generated via `PersonaGenerator`.
2.  **Interaction:** When a user sends a message, `SegV3` triggers a relatedness calculation to surface relevant `Memories`.
3.  **Prompt Synthesis:** The `AIService` receives a synthesized prompt containing the Persona's core beliefs, current mood, sensory anchors, and surfaced memories.
4.  **Completion:** The selected AI provider generates a response, which is then processed to form new memories and update the persona's transient state.
5.  **Persistence:** Every interaction and state change is auto-saved to LocalStorage via `HistoryService`.

## Key Abstractions

-   **Persona:** A deep structure containing backstory, core beliefs, linguistic tics, and "Molecular Self" parameters.
-   **Memory:** An experiential unit with salience, emotional valence/arousal, and association strength.
-   **SegState:** The global snapshot of a narrative organism's current existence.
-   **Council:** A specialized mode for multi-persona dialectic reasoning.

## Directory Structure Rationale

-   `src/components`: Separation of high-level feature containers (`SegV3`) from low-level UI primitives (`ui/`).
-   `src/services`: Decoupled domain logic (AI, History, Persona) that can be tested independently of the React lifecycle.
-   `src/lib`: Shared utilities and grounding logic used across both components and services.
-   `docs/`: Comprehensive project documentation, including the SEG theory and implementation guides.

---
*Last Updated: 2026-04-30*
