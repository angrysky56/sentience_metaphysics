# Phase 03 Context: Persistence & State Management

## User Decisions & Constraints
- **Primary Persistence**: `localStorage` for the frontend (simplicity for MVP).
- **Secondary Persistence**: File-based JSON for the MCP server.
- **Narrative Scope**: Focus on preserving the "experiential grounding" — ensuring the AI remembers the shared history and its own persona state.
- **UI Aesthetic**: Maintain the "premium, glassmorphism" aesthetic for new session management controls.

## Requirements Addressed
- **REQ-06**: State Persistence (Persistent storage for long-running narrative sessions).

## Architecture Implications
- **Frontend**: `PersonaLibrary` needs to be extended or complemented by a `NarrativeHistory` store.
- **Backend**: `SEGPersonaGenerator` in `seg_core.py` needs to handle persistence of custom replicants.
- **Sync**: The `run_council_session` and `analyze_through_seg_lens` tools should ideally accept a session context to maintain grounding.

## Success Criteria (Updated)
1.  **Session Survival**: Refreshing the browser restores the active persona and recent conversation history.
2.  **Custom Replicant Survival**: Custom personas created via tools persist across MCP server restarts.
3.  **Export/Import**: User can download and upload session files.
4.  **No Performance Regression**: Persistence operations should not block the main narrative loop.
