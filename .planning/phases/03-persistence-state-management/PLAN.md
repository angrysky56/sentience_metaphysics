# Phase 03: Persistence & State Management - Plan

## Goal
Implement robust state persistence for narrative sessions and persona definitions across both frontend and backend.

## 1. Backend: Persona Persistence
- [ ] **Infrastructure**: Create `mcp_server/data/` directory for persistent storage.
- [ ] **Registry Logic**: Update `replicants.py` or create a new `registry.py` to handle loading/merging custom personas from `data/custom_replicants.json`.
- [ ] **Persistence Hook**: Update `SEGPersonaGenerator.create_custom_replicant` in `seg_core.py` to trigger a disk write.
- [ ] **Validation**: Verify custom personas survive server restarts.

## 2. Frontend: Narrative History
- [ ] **History Store**: Create `src/services/historyService.ts` to manage conversation logs in `localStorage`.
- [ ] **Integration**: Connect `historyService` to the main UI component to auto-save/load messages.
- [ ] **Session Context**: Update message history logic to include persona-specific context markers for better grounding retrieval.

## 3. UI: Session Management
- [ ] **Control Panel**: Add a "Session Settings" modal/sidebar.
- [ ] **Save/Load**: Implement "Export to File" and "Import from File" buttons.
- [ ] **History View**: Add a basic history navigator to switch between recent sessions.
- [ ] **Polishing**: Ensure smooth transitions and clear feedback during save/load operations.

## 4. Verification & Quality
- [ ] **Unit Tests**:
    - [ ] Test `historyService` load/save logic.
    - [ ] Test Python persona registry persistence.
- [ ] **Integration Test**:
    - [ ] Refresh browser mid-conversation and verify state restoration.
    - [ ] Restart MCP server and verify custom persona availability.
- [ ] **UAT**: Export a session, clear storage, import it back, and verify the narrative continues seamlessly.

## Success Criteria
- Narrative organisms survive browser refreshes.
- Custom personas survive server restarts.
- User can export/import sessions as JSON.
