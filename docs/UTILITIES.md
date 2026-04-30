<!-- generated-by: gsd-doc-writer -->
# Utilities Documentation

This document describes the helper functions and shared logic found in the `src/lib` directory.

## Core Utilities

### segUtils.ts
Contains logic specific to the Simulated Experiential Grounding (SEG) framework.
- **Grounding Logic:** Functions for updating the "Molecular Self" parameters and calculating grounding effects based on interaction history.
- **State Helpers:** Utility functions for managing the transition of transient states (mood, salience).

### utils.ts
A general-purpose utility file primarily used for styling and class management.
- **cn(...inputs):** A wrapper around `clsx` and `tailwind-merge` that allows for conditional class names while resolving Tailwind conflict issues.

## Common Patterns

### ID Generation
The project uses a custom `uid(prefix)` helper (found in `SegV3.tsx` and shared logic) to generate unique identifiers for memories and sessions.

### Math & Normalization
Many utilities focus on normalizing values (0.0 to 1.0) for emotional states, salience, and relatedness scores, ensuring consistent behavior across the AI prompting logic.

---
*Last Updated: 2026-04-30*
