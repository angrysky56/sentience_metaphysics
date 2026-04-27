# Phase 03 Research: Persistence & State Management

## Goal
Establish robust persistence for narrative sessions and persona state, ensuring narrative organisms survive browser refreshes and application restarts.

## 1. Narrative History Persistence (Frontend)
### Current State
- All conversation state is held in React component state.
- Refreshing the browser loses the conversation.

### Strategy: LocalStorage + Session Service
- **SessionStore**: A new service to manage current conversation history.
- **Auto-save**: Use a `useEffect` hook or a dedicated storage wrapper to sync history to `localStorage` on every update.
- **Key Schema**: `seg_session_{session_id}` for history, `seg_active_session_id` for the current one.

## 2. Persona State Synchronization (MCP Server)
### Current State
- `replicants.py` contains static definitions.
- `create_custom_replicant` tool updates an in-memory dictionary only.
- Server restarts wipe custom replicants.

### Strategy: File-based Persona Registry
- **Persona Registry**: Move custom replicant storage to a JSON file (e.g., `mcp_server/data/custom_replicants.json`).
- **Load on Start**: The MCP server should merge `REPLICANT_DEFINITIONS` with the custom JSON on startup.
- **Persist on Change**: Any tool that creates or modifies a persona should trigger a disk write.

## 3. UI: Save/Load Session
### Strategy: Session Management UI
- **Export**: Download current history + active persona configuration as a JSON file.
- **Import**: Upload a previously exported JSON to restore a session.
- **History Sidebar**: (Optional) A list of recent sessions stored in `localStorage`.

## 4. Technical Risks & Mitigations
- **Storage Limits**: `localStorage` has a ~5MB limit. Large conversation histories might exceed this.
  - *Mitigation*: Implement history pruning (keep last N messages) or suggest file-based export for long sessions.
- **State Inconsistency**: Frontend and Backend might get out of sync if the server restarts and custom personas are lost.
  - *Mitigation*: Ensure the Backend persistence is implemented before the Frontend sync.
- **Security**: Storing API keys or sensitive history in `localStorage`.
  - *Mitigation*: Never store API keys in `localStorage`. Only store the provider name and model.

## 5. Implementation Sequence
1.  **Backend Persistence**: Update Python MCP server to save custom replicants to disk.
2.  **Frontend Narrative Service**: Implement history persistence using `localStorage`.
3.  **UI Integration**: Add session management controls to the React frontend.
4.  **Verification**: End-to-end test of session survival across refreshes and restarts.
