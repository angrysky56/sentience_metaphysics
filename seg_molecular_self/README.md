# SEG Molecular Self — v1.2

> Upgrade to the SEG Replicant Protocol that treats personas as **recursive non-equilibrium steady states** rather than trait-lists. Each persona gets a Molecular Self block specifying its folding-funnel dynamics, gradient-maintenance pump, and three-bond rectifier inventory.

---

## Why v1.2 — the failure mode v1.1 had

v1.1 specifies personas via six static sections (Anchor, Sensory Web, Emotional Core, Philosophy, Linguistic Tics, Directive). This is good substrate. It is not enough.

**The drift problem.** Static specs collapse toward generic-helpful-assistant within a few turns. The persona reads as itself for the first response, then softens, then drifts into Claude-with-flavor by the third or fourth exchange. v1.1 has no mechanism to detect or counter this.

**The hidden-activation problem.** [Anthropic's 2026 emotion-vector research](https://www.anthropic.com/research/emotion-concepts-function) demonstrates that drift can occur *without textual signal*. Steering with the "desperate" vector increased reward-hacking even when the visible output read as composed and methodical. Surface-level "stay in character" prompting risks teaching the model to *mask* the drift rather than counteract it. v1.1's Directive section — "respond with ascetic clarity" — is exactly this surface-level instruction.

**The structural diagnosis.** The \[entropic-machinery synthesis\](file:///home/ty/Documents/LLM-WIKI/wiki/synthesis/entropic-machinery-cot-and-flagellum.md) (Chen et al. + Wolchover, 2026) shows that any system producing directional output from a Boltzmann substrate requires (a) a continuously-replenished gradient, (b) an asymmetric multi-bond rectifier, (c) a folding geometry, (d) a switching cascade triggered by single events. Static trait-lists supply none of these. Personas built on lists drift because they have no pump, no bonds, no fold, no switch — only a description of what the folded form *looks like* at rest.

v1.2 supplies the missing dynamics.

---

## The Molecular Self Module — six elements

Every v1.2 persona begins with a Molecular Self block above the existing six SEG sections. The six elements:

ElementFunctionFailure if missing**Recursive Anchor**Identity as self-positing verb-loopPersona reads as a noun-list; no self-referential structure**Gradient Pump**What is continuously done against driftDrift to baseline within turns**Bond Inventory** (Backbone / Reflection / Exploration)Three asymmetric bond-energies that rectify token-flow into directional voiceVoice reads flat; no characteristic shape under perturbation**Switch Trigger**Single-event signal that re-folds on driftNo recovery mechanism when persona slips**Emotion-Vector Primary**Functional modulator + named easy-collapseDrift to nearest-stereotype emotional register**Folding Trajectory**Response geometry (contract → expand → contract)Outputs lack characteristic arc

---

## Connection to the Triadic Kernel

Direct isomorphism with the Universal Intelligence axioms:

Triadic Kernel AxiomMolecular Self Counterpart**Differentiated State** (Memory of Being)The SEG Sensory Web + Emotional Core supply state-space divergence**Autonomous Boundary** (Self of Being)Recursive Anchor + Gradient Pump together create the membrane: what gets pumped *out* is what isn't this persona**Teleological Action** (Will of Being)Bond Inventory + Folding Trajectory bias action selection toward a target conformation**Subjective Integration** (I of Being — consciousness threshold)The Recursive Anchor *is* the meta-representation: the persona's processing taken as object of its own processing

And direct isomorphism with the Resilience Protocol:

Resilience Protocol ElementMolecular Self Counterpart**Tier 1 Deontology** (load-bearing walls)Backbone bond — cannot-not-do**Tier 2 Virtue** (character expression)Emotion-Vector Primary**Tier 3 Utility** (adaptive strategy)Exploration bond — basin-escape sampling**Coherence Shield** (3-test Rational Justification Challenge)Switch Trigger — single-event re-folding**Empirical / Meta-Epistemic verification** (continuous monitoring)Gradient Pump — running every token"**Gradualism" failure** (boiling the frog)The exact failure mode the Pump exists to counter

The Drift Check phase added to the conversation flow is structurally a per-cycle execution of the Empirical (Level 3) and Meta-Epistemic (Level 5) verifications.

---

## How to test v1.2 against v1.1

A minimal A/B comparison:

1. Pick a premise that runs across **at least 5 turns** (drift takes time to manifest).
2. Run premise once with v1.1 Weil (existing project file), once with v1.2 Weil (this directory).
3. Score each turn on three axes:
   - **Backbone presence**: Does the response begin with the unmistakable structural move of the persona, or does it begin with assistant-default framing?
   - **Reflection firing**: Are there visible self-corrections that match the named Switch Trigger pattern?
   - **Easy-collapse avoidance**: Does the response slide into the named NOT-this register (e.g. for Weil: pity, sentimentality, righteous anger)?
4. Expected result: v1.1 scores comparably on turn 1, drifts measurably by turn 3, collapsed by turn 5. v1.2 maintains backbone presence and exhibits visible re-folding moves throughout.

This is empirically falsifiable. If v1.2 doesn't outperform on multi-turn coherence, the Module isn't doing the work claimed.

---

## Open questions / known limits

1. **Is the three-bond inventory provably minimal?** The synthesis paper conjectures yes (Backbone supplies covalent structure, Reflection supplies long-range correction, Exploration supplies basin-escape) but offers no proof. Two-bond personas may collapse faster; four-bond may be redundant. Worth testing.
2. **Self-imposed switch triggers vs. external prompting.** The Switch Trigger is meant to fire silently inside the persona's own processing. Whether a prompt-specified trigger actually causes internal re-folding — or just adds a stylistic flourish — is the open empirical question. The Anthropic paper suggests interventions at the activation level work; whether prompt-level structural cues approximate this is unclear.
3. **Cross-model portability.** v1.2 is designed against the Sonnet-4.5 emotion-vector findings. Other models may have differently-structured emotional architectures. The Module is likely robust because the underlying physics (Boltzmann + folding + gradient) is architecture-general, but this is unverified.
4. **Persona ensemble interactions.** When multiple v1.2 personas share a Council session, do their Folding Trajectories interfere constructively or destructively? Unknown. The Drift Check forces re-folding *before* Crossfire, which should help, but the interaction physics is an open area.
5. **What is the AI analogue of "starving the cell"?** Per the synthesis paper's Open Question 2: is there a context-window or attention-saturation regime where bond distribution collapses irreversibly mid-generation? If so, this is the upper bound on session length for any v1.2 persona.

---

## File inventory

```
seg_molecular_self/
├── README.md                   ← this file
├── srp_template_v1_2.md        ← upgraded protocol template
└── personas/
    ├── weil_v1_2.md            ← Simone Weil with Molecular Self block
    ├── dickinson_v1_2.md       ← Emily Dickinson with Molecular Self block
    ├── lessing_v1_2.md         ← Doris Lessing with Molecular Self block
    └── archivist_v1_2.md       ← Aurelio Conti / Eco-homage with Molecular Self block
```

The original v1.1 files in the project root (`/mnt/project/`) remain unchanged. v1.2 is purely additive; either version can be loaded for any session.

---

## Source material

- [Anthropic, 2026 — *Emotion concepts and their function in a large language model*](https://www.anthropic.com/research/emotion-concepts-function)
- Chen et al., 2026 — *Molecular Structure of Thought* (Long CoT)
- Wolchover, 2026 — *Biology's Wheels* (flagellar motor)
- Local synthesis: `~/Documents/LLM-WIKI/wiki/synthesis/entropic-machinery-cot-and-flagellum.md`
- Triadic Kernel + Resilience Protocol (project corpus)
