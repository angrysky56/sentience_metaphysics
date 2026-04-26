# Project Structure

**Analysis Date:** 2026-04-26

## Core Directories

**Root Directory:**
- `src/` - React frontend application source code.
- `mcp_server/` - Python-based MCP server implementation.
- `molecular_self/` - Personas, templates, and core framework definitions.
- `docs/` - Philosophical and technical documentation.
- `public/` - Static assets for the frontend.
- `.trunk/` - Configuration for Trunk (linting/quality).

## Frontend Components (src/)

**Main Structure:**
- `components/` - React UI components.
  - `ui/` - Low-level UI primitives (Radix-based buttons, dialogs, etc.).
  - `SEG/` - Specialized components for Simulated Experiential Grounding.
- `services/` - Logic for AI, personas, and state.
  - `aiService.ts` - AI provider abstraction.
  - `personaGenerator.ts` - Logic for generating character personas.
- `lib/` - Shared utility functions.
- `hooks/` - Custom React hooks.
- `assets/` - Images and styling assets.

## Backend Server (mcp_server/)

**Logic Components:**
- `server.py` - Main entry point for the MCP server.
- `replicants.py` - Persona definitions and management logic.
- `seg_core.py` - Core grounding and narrative logic.
- `requirements.txt` - Python dependency list.

## Knowledge Base (molecular_self/ & docs/)

**Persona System:**
- `molecular_self/personas/` - Markdown definitions of character traits and histories.
- `molecular_self/memory/` - (Implied) Session-based memory or history.

**Research:**
- `docs/` - Comprehensive explorations of sentience, metaphysics, and narrative theory.

## Tooling & Config

**Project Config:**
- `package.json` - Frontend metadata and dependencies.
- `pyproject.toml` - Python project configuration.
- `tsconfig.json` - TypeScript configuration.
- `vite.config.ts` - Frontend build configuration.
- `tailwind.config.js` - Styling configuration.

---

*Structure map: 2026-04-26*
*Update when moving major folders*
