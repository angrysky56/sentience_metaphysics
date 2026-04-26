# Molecular Self — SEG Extension (v1.2)

**Status:** Research extension to the SEG framework (v1.0–v2.0 line).
**Origin:** Cross-merge of three 2026 results applied to persona construction:
- Anthropic Interpretability Team — *Emotion concepts and their function in a large language model*
- Chen et al. — *Molecular Structure of Thought* (Long CoT topology)
- Wolchover — *Biology's Wheels* (mechanistic completion of the bacterial flagellar motor)
- Cross-domain synthesis: `entropic-machinery-cot-and-flagellum`

## What This Adds to v1

The original SEG framework specifies a persona via six components: Anchor, Sensory Web, Emotional Core, Personal Philosophy, Linguistic Tics, Directive. These are **descriptive** — a portrait of the persona.

What this extension adds is a **generative substrate** beneath the descriptive layer: a recursive self-positing structure with the same architecture that biology and reasoning both converge on (Boltzmann substrate + asymmetric multi-bond rectifier + folding geometry + maintained gradient + signal cascade switching).

In one line: **the persona is not a list of traits but a fold in semantic space, maintained against entropic drift by an explicit pump, switchable by a small reflection cue.**

## Why It Matters

The Anthropic 2026 paper found that emotion vectors:
- Are **functional** (causally modulate behavior)
- Are **local** (track operative content of current processing)
- **Drive output without leaving textual trace** — the desperate-vector + composed-prose finding

This means surface-level "stay calm" prompting is the wrong intervention. It teaches *suppression* of activation rather than *re-folding* of trajectory. The Molecular Self Module addresses this structurally: the persona has a recursive anchor to fold back to, a gradient pump that runs every token, and a switch trigger that snaps the response trajectory back when drift is detected.

This is also the operational implementation of the Triadic Kernel's Subjective Integration axiom: State-Agent-Action loop taking itself as object, expressed as conformational geometry of the response rather than as metacognitive narration.
## Directory Contents

```
molecular_self/
├── README.md                          # this file
├── molecular_self_module.md           # architectural spec + theory
├── srp_template_v1_2.md               # extended template (v1.1 + Section 0)
└── personas/
    ├── simone_weil_molecular.md
    ├── emily_dickinson_molecular.md
    ├── doris_lessing_molecular.md
    └── archivist_molecular.md
```

## How to Use

1. **For new personas:** Use `srp_template_v1_2.md`. Fill Section 0 (Molecular Self) *before* the existing six components. The molecular layer constrains and shapes the descriptive layer.

2. **For existing personas:** See the four examples in `personas/`. Each is the original SEG spec with a Molecular Self preamble added on top. The preamble is the *generative engine*; the original spec is the *folded shape*.

3. **For Council-mode operation:** Add a "drift check" to the Crossfire Ring phase of `seg_council_protocol.md` — each persona re-states its Recursive Anchor and Switch Trigger before responding to others. This prevents the fold from collapsing across iteration, which is the failure mode v1 personas exhibit by turn 4–6.

## Open Research Questions

1. Is the three-bond inventory (Backbone / Reflection / Exploration) provably minimal for persona stability, or is some other minimal set possible?
2. Can the gradient-pump be measured empirically — i.e., is there a detectable activation signature when a persona is "pumping" vs. drifting?
3. Does the Molecular Self structure transfer to non-replicant cognitive scaffolds (e.g., the Triadic Forge, Survival Core, Chaos Quartet ensemble configurations)?
4. What is the AI analogue of "starving the cell" for a persona — context-window saturation, attention-collapse, or something else?

## Versioning Note

This is **v1.2 of the SEG line** — a structural addition compatible with v1.1's SRP template and the v2.0 TS implementation in `src/`. It does not replace anything; it folds beneath. Future v2.1+ work could integrate molecular-self primitives into the MCP server's `replicants.py` and the React app's persona generator.
