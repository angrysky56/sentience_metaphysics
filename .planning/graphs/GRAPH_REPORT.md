# Graph Report - sentience_metaphysics  (2026-04-29)

## Corpus Check
- 47 files · ~62,491 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 338 nodes · 626 edges · 16 communities detected
- Extraction: 67% EXTRACTED · 33% INFERRED · 0% AMBIGUOUS · INFERRED: 207 edges (avg confidence: 0.52)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 19|Community 19]]

## God Nodes (most connected - your core abstractions)
1. `AIService` - 71 edges
2. `SEGPersonaGenerator` - 43 edges
3. `SEGCouncilOrchestrator` - 40 edges
4. `CouncilManager` - 37 edges
5. `SEGPersistenceManager` - 36 edges
6. `ReplicantRegistry` - 28 edges
7. `PersonaLibrary` - 19 edges
8. `AIService` - 13 edges
9. `call_tool()` - 10 edges
10. `PersonaGenerator` - 10 edges

## Surprising Connections (you probably didn't know these)
- `main()` --calls--> `AIService`  [INFERRED]
  mcp_server/verify_uat.py → src/services/aiService.ts
- `dream()` --calls--> `uid()`  [INFERRED]
  src/lib/segUtils.ts → backups/seg_v2.ts
- `List all available replicant archetypes.` --uses--> `CouncilManager`  [INFERRED]
  mcp_server/bridge.py → mcp_server/council.py
- `Start a new council session.` --uses--> `CouncilManager`  [INFERRED]
  mcp_server/bridge.py → mcp_server/council.py
- `Get the status of an active council session.` --uses--> `CouncilManager`  [INFERRED]
  mcp_server/bridge.py → mcp_server/council.py

## Communities

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (34): Manages persistent storage for SEG framework components., Save a custom replicant to disk., Load all custom replicants from disk., Delete a custom replicant from disk. Returns True if removed., Save a generated persona to disk., Load all generated personas from disk., Load JSON file or return empty dict if not exists., Save dictionary to JSON file. (+26 more)

### Community 1 - "Community 1"
Cohesion: 0.1
Nodes (46): BaseModel, AIService, Python implementation of AI Service for MCP server stabilization., CouncilStatusResponse, CouncilManager, Manages multiple active Council Flow sessions., Retrieves the status of a specific council session., Step 1: Seed the council with a premise. (+38 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (17): get_council_status(), get_replicants(), List all available replicant archetypes., Start a new council session., Get the status of an active council session., start_council(), StartCouncilRequest, CouncilState (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.1
Nodes (15): AIMessage, Persistence management for SEG framework data., create_balanced_council(), get_complementary_replicants(), get_replicant_by_function(), get_replicant_names(), SEG Replicants: The 10 Core Archetypes  Definitions for the 10 primary SEG repli, Get list of all available replicant names. (+7 more)

### Community 4 - "Community 4"
Cohesion: 0.16
Nodes (1): PersonaLibrary

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (7): AIService, AIResponse, Call Ollama via /api/chat for proper system-role + chat-template handling., council_orchestrator(), mock_ai_service(), MockAIService, persona_generator()

### Community 6 - "Community 6"
Cohesion: 0.16
Nodes (7): clamp01(), defaultSeg(), dream(), now(), reinforceMemory(), uid(), dream()

### Community 7 - "Community 7"
Cohesion: 0.26
Nodes (6): clamp01(), defaultSeg(), dream(), now(), reinforceMemory(), uid()

### Community 8 - "Community 8"
Cohesion: 0.27
Nodes (1): AIService

### Community 9 - "Community 9"
Cohesion: 0.32
Nodes (10): buildResponseGuidance(), createFallbackPersona(), createMemoryFromInteraction(), defaultSeg(), extractSubtleTags(), generateFallbackResponse(), generateInitialMemories(), generateSubtlePersonaReply() (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.4
Nodes (1): PersonaGenerator

### Community 11 - "Community 11"
Cohesion: 0.42
Nodes (8): cmd_export(), cmd_install(), _load_json(), main(), Bootstrap utility for the SEG Molecular Self v1.2 custom-replicant set.  Two ope, Return a list of validation issues. Empty list = clean., _validate_replicant(), _write_json()

### Community 12 - "Community 12"
Cohesion: 0.28
Nodes (1): HistoryService

### Community 13 - "Community 13"
Cohesion: 0.36
Nodes (7): main(), Set up the Python environment for the SEG MCP server., Test that the server can be imported without errors., Show usage instructions for the MCP server., setup_environment(), show_usage(), test_server()

### Community 14 - "Community 14"
Cohesion: 0.36
Nodes (3): defaultSeg(), now(), uid()

### Community 19 - "Community 19"
Cohesion: 1.0
Nodes (1): Pytest configuration: ensure mcp_server package is importable.  Adds the project

## Knowledge Gaps
- **29 isolated node(s):** `Bootstrap utility for the SEG Molecular Self v1.2 custom-replicant set.  Two ope`, `Return a list of validation issues. Empty list = clean.`, `Step 1: Seed the council with a premise.`, `Step 2: Ground participants in their core identities.`, `Step 3: Explore diverse perspectives.` (+24 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Community 4`** (20 nodes): `PersonaLibrary`, `.cleanupLibrary()`, `.constructor()`, `.deletePersona()`, `.exportLibrary()`, `.generateId()`, `.getAllPersonas()`, `.getDefaultPersona()`, `.getLibraryStats()`, `.getPersonasByArchetype()`, `.importLibrary()`, `.loadFromStorage()`, `.loadPersona()`, `.migrateLibrary()`, `.ratePersona()`, `.savePersona()`, `.saveToStorage()`, `.searchPersonas()`, `.setDefaultPersona()`, `personaLibrary.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 8`** (12 nodes): `.__init__()`, `AIService`, `.callGemini()`, `.callLMStudio()`, `.callOllama()`, `.callOpenAI()`, `.constructor()`, `.generateResponse()`, `.messagesToPrompt()`, `.testConnection()`, `createAIService()`, `aiService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 10`** (11 nodes): `PersonaGenerator`, `.buildPersonaGenerationPrompt()`, `.constructor()`, `.generateFallbackBeliefs()`, `.generateFallbackName()`, `.generateFallbackPersona()`, `.generateFallbackTics()`, `.generatePersona()`, `.getRandomArchetype()`, `.parsePersonaResponse()`, `personaGenerator.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 12`** (9 nodes): `HistoryService`, `.archiveSession()`, `.clearHistory()`, `.exportHistory()`, `.getHistory()`, `.importHistory()`, `.loadCurrentSession()`, `.saveCurrentSession()`, `historyService.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 19`** (2 nodes): `conftest.py`, `Pytest configuration: ensure mcp_server package is importable.  Adds the project`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AIService` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `SEGPersistenceManager` connect `Community 0` to `Community 1`, `Community 3`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `SEGPersonaGenerator` connect `Community 0` to `Community 1`, `Community 3`, `Community 5`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **Are the 62 inferred relationships involving `AIService` (e.g. with `CouncilState` and `SEGCouncilFlow`) actually correct?**
  _`AIService` has 62 INFERRED edges - model-reasoned connections that need verification._
- **Are the 31 inferred relationships involving `SEGPersonaGenerator` (e.g. with `GeneratePersonaArgs` and `RunCouncilSessionArgs`) actually correct?**
  _`SEGPersonaGenerator` has 31 INFERRED edges - model-reasoned connections that need verification._
- **Are the 34 inferred relationships involving `SEGCouncilOrchestrator` (e.g. with `GeneratePersonaArgs` and `RunCouncilSessionArgs`) actually correct?**
  _`SEGCouncilOrchestrator` has 34 INFERRED edges - model-reasoned connections that need verification._
- **Are the 32 inferred relationships involving `CouncilManager` (e.g. with `AIService` and `StartCouncilRequest`) actually correct?**
  _`CouncilManager` has 32 INFERRED edges - model-reasoned connections that need verification._