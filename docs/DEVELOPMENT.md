<!-- generated-by: gsd-doc-writer -->
# Development Guide

This document outlines the development workflow, coding standards, and architectural patterns for the SEG project.

## Development Workflow

1.  **Branching:** Use descriptive branch names (e.g., `feature/memory-pruning`, `fix/ai-response-parsing`).
2.  **Commits:** Follow [Conventional Commits](https://www.conventionalcommits.org/).
3.  **Local Dev:** Run `npm run dev` for hot-reloading development.
4.  **Linting:** Run `npm run lint` before committing.

## Coding Standards

- **TypeScript:** Strict type safety is mandatory. Use interfaces for data models in `src/services/types.ts`.
- **React Components:**
    - Use functional components with hooks.
    - Leverage `framer-motion` for meaningful animations.
    - Use Radix UI primitives (located in `src/components/ui`) for accessibility.
- **Services:**
    - Keep services stateless where possible, or use the `HistoryService` for persistence.
    - Use async/await for all I/O operations.

## Technology Stack

- **Frontend:** React 18, Vite 5, TypeScript 5.2
- **Styling:** Tailwind CSS, Shadcn UI (Radix + Lucide)
- **Animation:** Framer Motion
- **Networking:** Axios

## Working with Personas

When adding new persona logic:
1.  Update the `Persona` type in `SegV3.tsx` or `types.ts`.
2.  Modify `PersonaGenerator.ts` if the generation logic changes.
3.  Ensure the `personaLibrary.ts` can still serialize and deserialize the new structure.

---
*Last Updated: 2026-04-30*
