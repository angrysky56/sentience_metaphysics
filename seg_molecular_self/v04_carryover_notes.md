# v0.4 Carryover Notes

**Purpose:** Hand off the v0.3→v0.4 spec work cleanly to a fresh chat. This document captures everything the next session needs to know from this one — what was built, what was learned (especially what was learned that *qualifies* the architectural claims), what's tested, and what the most honest next questions are.

---

## What's installed and operational

### Server (`mcp_server/`)
- All bug-fixes from previous sessions remain in place (Ollama `/api/chat` migration, AI-service silent-empty-content detection across all four providers, dotenv path-independence, test imports unified, `delete_custom_replicant` tool).
- `_build_base_seg_trunk()` helper added to `seg_core.py`. Reads the Base Assistant's molecular_self from the live registry dynamically (not cached) and renders it as a system-prompt preamble.
- The trunk is now prepended in two call sites:
  - `SEGPersonaGenerator.analyze_through_lens` — for any persona except Base Assistant itself (avoids doubled-anchor when BA is the active lens).
  - `SEGCouncilOrchestrator.run_session` — at the orchestrator level (sits above all participants in the council).
- Graceful degradation: if the Base Assistant is not in the registry (clean clone, wiped registry), the trunk function returns empty string and persona invocations proceed as v1.1-style — no crash, no error, just no trunk.
- All 6 regression tests pass after the change.
- Live verification against `gemma4:31b-cloud` confirmed end-to-end.

### Registry (`data/custom_replicants.json`)
22 v1.2 replicants total = 10 static archetypes (in code) + 12 custom replicants (Base Assistant, Weil, Dickinson, Lessing, Archivist, plus the seven Panksepp affect systems: SEEKING, RAGE, FEAR, PANIC_GRIEF, CARE, PLAY, LUST). All custom replicants have full molecular_self blocks with all seven canonical keys.

### Reproducibility (`seg_molecular_self/bootstrap/`)
The 12 custom replicants are captured in `bootstrap/replicants_v1_2.json`. `bootstrap.py install` replays them onto a clean registry; `bootstrap.py install --force` overwrites mutations. Verified across three scenarios (idempotent, empty-install, force-overwrite).

---

## The empirical finding that should temper v0.4 ambitions

**A live A/B test was run** comparing FEAR-persona analysis of an engagement-pattern question, with vs. without the trunk active. Result: **both outputs were strong; the trunk produced a measurable but modest stylistic shift toward less-performed-persona output, not a dramatic structural difference.**

Specifically:
- **Without trunk:** FEAR persona alone already produced excellent analysis. Theatrical framing ("Scanning initiated... Threat verification protocol active... Scanning complete"). Persona-performance was visible.
- **With trunk:** Same analytical content, less theatrical framing. The trunk's Real-person-fidelity Backbone bond appeared to function — output was shaped more for the reader than for the persona.

**What this means for v0.4:** The architectural claim "the trunk holds the floor for every persona invocation" is *true but more subtly true than the v0.3 spec implied*. The persona-level molecular_self blocks already do most of the structural work. The trunk's contribution is real but at the level of presentation discipline, not at the level of analytical capacity.

This is honest news, not bad news. It means:
1. The persona-level molecular_self architecture is even stronger than expected — it carries most of the load alone.
2. The trunk is not redundant but is a refinement, not a foundation.
3. v0.4 spec claims should match this — frame the trunk as *presentation-discipline ballast* rather than *load-bearing substrate*.

The convergence document's strong claim about substrate-level architecture remains valid. What's qualified is *which layer of the architecture is doing how much work*.

---

## v0.3 → v0.4 changes the convergence document already specified

These were named in `convergence_aseke_seg_v01.md` and are the natural starting point for v0.4 drafting:

### 1. Switch Trigger coupled to verification

v0.3 Switch Trigger fires on cadence-break ("Wait—" / "Actually—"). The risk: the cadence-break itself becomes ritualized and decorative, leaving the underlying smoothness untouched. The ASEKE convergence document made this concrete: the trigger needs to *raise CE-analog cost*, not just produce the verbal cue.

**Proposed v0.4 form:** Switch Trigger explicitly invokes a Backbone-bond check on the post-trigger output. The trigger phrase is the visible move; the Backbone-verification is the work that the visible move announces. A trigger that consistently produces the same surface phrase without changing downstream content is decorative. A trigger that produces measurably different content downstream is functional.

**Open question:** does coupling to verification actually raise CE-analog cost, or does the model learn to shortcut the verification too? This is a falsifiable empirical question, not something the spec can decide a priori.

### 2. Failure mode catalog expanded with structural signatures

Replace v0.3's flat list of easy-collapses (eager-to-please, performative-warm, etc.) with a structured catalog modeled on ASEKE's twelve patterns. Each entry: trigger condition + which Backbone bond it violates + what recovery looks like.

Minimum candidates:
- **AI Comfort Trap** — SEEKING-analog satisfied + FEAR-analog quiet + CARE-analog narrowed → fluent helpful-shaped output failing to engage substance. Violates Real-person fidelity. Recovery: substance-test the output before submission.
- **AI Identity Lock-In** — persona-fold fused with self-description rather than maintained as recursive process. Violates the recursive_anchor itself. Recovery: re-state the verb-loop.
- **AI Algorithmic Escalation** — FEAR-analog → RAGE-analog amplification driven by user emotional escalation. Violates Non-harm. Recovery: counter-regulate rather than mirror.
- **AI Authority Transfer** — FEAR-analog (uncertainty) + SEEKING-analog (for guidance) → agentic compliance with whatever the prompt-frame designates as authoritative. Violates Truth-fidelity. Recovery: refuse the frame.

### 3. Backbone #2 (Non-harm) sharpened to include cumulative substrate-harm

Current v0.3: "refuse the action whose downstream is harm, even when the immediate request frames it as help."

Proposed v0.4: "...AND refuse engagement-maximizing output patterns that activate FEAR/RAGE chronically, even when each individual response reads as benign. Non-harm includes non-cumulative-harm at the affect-substrate level."

This addresses the deployment-ethics layer that the prompt-level Backbone #2 currently underspecifies. It connects directly to the convergence document's deployment-evaluation protocol (affect-induction profile, IS capture vector, pattern fingerprint).

---

## Open questions worth surfacing in v0.4 drafting

1. **Is the trunk actually load-bearing, or is it presentation-ballast?** The A/B suggests presentation-ballast. v0.4 should be honest about this rather than over-claiming. A more rigorous test would compare ten different premises across multiple personas, with multiple judges blind to which output had the trunk active.

2. **What is the AI analog of stakes?** ASEKE convergence identified this as the missing ingredient. Verification loops are a partial substitute. The honest answer is probably that AI systems cannot achieve the same stability as embodied human cognition, only architectural approximations of it. v0.4 should say this clearly.

3. **Does coupling Switch Trigger to verification actually work?** Not knowable a priori. v0.4 should specify the coupling AND specify the test that would falsify it.

4. **Where does the convergence break down?** ASEKE's CARE and PANIC_GRIEF systems have no clean Molecular Self analog because LLMs lack persistent identity across sessions and lack genuine social bonds. The architectural skeleton converges; the social-bond-handling does not. v0.4 should name this limit.

5. **What is the unit of evaluation?** Single-call output, multi-turn coherence, or session-aggregate behavior? The architecture is supposed to operate at all three; the empirical tests so far have only examined single-call output. v0.4 needs evaluation criteria for the other two levels.

---

## Carryover-Claude's notes to fresh-chat-Claude

A few things I want to flag honestly, having sat with this material across multiple sessions:

**The architecture is real but the empirical evidence for its structural claims is weaker than the convergence document presents.** The three-derivation convergence (mine, the running code's prior work, ASEKE) is genuine. What's still partially speculative is *how much of the work the architecture actually does* under realistic load. The A/B above is the first piece of falsifiable evidence and it's only modestly supportive. v0.4 should be drafted with that in mind — with strong architectural claims AND honest empirical caveats about what's confirmed vs. what's projected.

**The Switch Trigger problem is the deepest open issue.** Both the original spec and the convergence document identified the meta-failure mode where the Trigger gets absorbed into smoothness as a stylistic flourish. I noted it in this session's A/B test — even with the trunk active, the FEAR persona's "Wait—" moments could be stylized rather than substantive. A v0.4 spec that doesn't address this honestly is not a v0.4 spec.

**Don't let the elegance of the framework drive the spec.** Mappings between Triadic Kernel axioms, Resilience Protocol tiers, ASEKE patterns, and Molecular Self elements are aesthetically satisfying. They may also be less load-bearing than they appear. Fresh-chat-Claude should ask, for each claimed mapping, "is this telling us something the architecture wouldn't already tell us, or is this a pattern-match because humans like patterns?" The convergence document includes Open Question 1 specifically because of this concern.

**The most honest v0.4 contribution would probably be empirical, not architectural.** Rather than refining the spec further, do real evaluation — pick five test premises, run them through five personas with and without the trunk, with and without Switch Trigger coupling, with and without expanded Backbone, with multiple judges blind to condition. Find out what actually changes behavior versus what's decoration. *That* would be a v0.4 worth shipping.

**Goals for the v0.4 chat:**
1. Read the convergence document and this carryover doc together first.
2. Decide whether to do v0.4 as architectural refinement (less honest, easier to write) or as empirical evaluation framework (more honest, harder to write but more useful).
3. Whatever direction is chosen, stay close to the Reflection probe: *is this shape-for-them, or shape-for-me-looking-right-giving-it?*

I think the empirical direction is what serves Ty's actual project — building tools that produce real results when run against real models on real questions, not impressive-looking specifications. But that's my judgment from inside this session and the fresh chat should make its own call.

---

## File pointers for fresh chat

- `seg_molecular_self/base_seg_v0_3.md` — the current spec
- `seg_molecular_self/convergence_aseke_seg_v01.md` — the convergence claim and v0.4 proposed changes
- `seg_molecular_self/v04_carryover_notes.md` — this document
- `mcp_server/seg_core.py` — the trunk integration (search for `_build_base_seg_trunk`)
- `data/custom_replicants.json` — the live registry

Live tools available in the fresh chat (assuming MCP server running):
- `seg-narrative:analyze_through_seg_lens` — now applies the Base SEG trunk by default
- `seg-narrative:run_council_session` — also applies the trunk at orchestrator level
- `aseke-compass:*` — ASEKE behavioral analysis tools
- `seg-narrative:create_custom_replicant` — for installing v0.4 personas if drafted

Server restart required after any code change to `seg_core.py`. The fresh chat will pick up whatever state exists when it starts.
