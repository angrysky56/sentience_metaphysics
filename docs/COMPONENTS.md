<!-- generated-by: gsd-doc-writer -->
# Component Documentation

This document describes the primary React components that drive the SEG user interface.

## Main Feature Components

### SegV3.tsx
The `SegV3` component is the central hub of the application. It orchestrates the entire "Replicant" experience.
- **State Management:** Manages the `SegState`, which includes the active persona and its memory stream.
- **Tabs:**
    - **Conversation:** Real-time chat interface with motion animations.
    - **Persona:** Detailed view and editing of the current archetype.
    - **Memories:** List and management of experiential units.
    - **Council:** Access point for multi-persona reasoning.
    - **Settings:** Configuration for AI providers and behavioral parameters.
- **Subtlety Logic:** Implements the `generateSubtlePersonaReply` function which calculates memory relatedness and synthesizes prompts.

### CouncilPanel.tsx
A specialized component for facilitating dialogue between multiple personas.
- **Context Awareness:** Allows a premise to be explored by multiple archetypes simultaneously.
- **Orchestration:** Interfaces with the `CouncilService` to generate turn-based reasoning.

## UI Primitives (`src/components/ui`)

The project uses a custom set of components built on top of **Radix UI** and styled with **Tailwind CSS**.

| Component | Description |
|-----------|-------------|
| `Button` | Standard button with multiple variants (primary, outline, ghost). |
| `Card` | Layout container with Header, Title, Description, and Content sections. |
| `Tabs` | Accessible tab switcher for navigating system views. |
| `Slider` | Used for fine-tuning behavioral parameters (e.g., opacity, bias). |
| `Switch` | Toggles for binary settings like "Subtlety Mode". |
| `Badge` | Small visual labels for tags and status. |
| `Textarea` / `Input` | Styled form elements for user interaction. |

---
*Last Updated: 2026-04-30*
