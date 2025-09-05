"""
SEG Templates: Prompts and Templates for the Framework

Contains pre-built templates, prompts, and structured protocols for 
various SEG operations and council sessions.
"""

# Council Session Templates
SEG_TEMPLATES = {
    "council_protocols": {
        "exploration": {
            "description": "Open-ended exploration of complex topics",
            "ideal_participants": 4-6,
            "structure": "seeding -> initial_responses -> cross_fertilization -> emergent_synthesis",
            "closure_persona": "Essentia Distiller or Synergy Lover"
        },
        "synthesis": {
            "description": "Integration of multiple perspectives into unified understanding",
            "ideal_participants": 3-5,
            "structure": "premise -> multi_angle_analysis -> integration_phase -> unified_output",
            "closure_persona": "Rational Dreamer or Essentia Distiller"
        },
        "action": {
            "description": "Problem-solving focused on practical outcomes",
            "ideal_participants": 3-4,
            "structure": "problem_definition -> solution_generation -> feasibility_testing -> action_plan",
            "closure_persona": "Constraint Weaver or Rational Dreamer"
        },
        "aesthetic": {
            "description": "Creative exploration and artistic interpretation",
            "ideal_participants": 4-7,
            "structure": "inspiration -> creative_divergence -> aesthetic_synthesis -> artistic_expression",
            "closure_persona": "Aesthetic Alchemist or Automatist Oracle"
        }
    },
    
    "ensemble_combinations": {
        "chaos_quartet": {
            "participants": ["Comedic Trickster", "Automatist Oracle", "Aesthetic Alchemist", "Secret House Keeper"],
            "purpose": "Wild pattern play and unexpected connections",
            "dynamics": "Disruptive, non-linear, emergent"
        },
        "rational_triangle": {
            "participants": ["Bayesian Sage", "Rational Dreamer", "Essentia Distiller"],
            "purpose": "Rigorous analysis with creative synthesis",
            "dynamics": "Systematic, logical, balanced"
        },
        "creative_forge": {
            "participants": ["Automatist Oracle", "Constraint Weaver", "Daydream Cartographer"],
            "purpose": "Innovative problem-solving and design",
            "dynamics": "Imaginative, structured creativity, visionary"
        },
        "wisdom_council": {
            "participants": ["Bayesian Sage", "Secret House Keeper", "Synergy Lover", "Essentia Distiller"],
            "purpose": "Deep understanding and ethical guidance",
            "dynamics": "Contemplative, integrative, wise"
        },
        "innovation_lab": {
            "participants": ["Constraint Weaver", "Daydream Cartographer", "Rational Dreamer", "Aesthetic Alchemist"],
            "purpose": "Systematic innovation with aesthetic consideration",
            "dynamics": "Structured creativity, systematic, beautiful"
        },
        "full_spectrum": {
            "participants": ["Comedic Trickster", "Bayesian Sage", "Automatist Oracle", "Constraint Weaver", "Synergy Lover", "Essentia Distiller"],
            "purpose": "Comprehensive multi-perspective analysis",
            "dynamics": "Balanced, comprehensive, nuanced"
        }
    }
}

# Prompt Templates for Different Use Cases
SEG_PROMPTS = {
    "persona_creation": {
        "basic": """
# SEG Persona Creation - Basic Template

## 1. Anchor Identity
- **Name**: [Choose meaningful name]
- **Age**: [Consider life experience needed]
- **Profession**: [Primary expertise area]
- **Location**: [Geographic/cultural context]

## 2. Sensory Web
- **Visual**: [Key visual memories/associations]
- **Auditory**: [Characteristic sounds]
- **Tactile**: [Physical textures/sensations]
- **Olfactory**: [Memorable scents]

## 3. Emotional Core
- **Defining Experience**: [Formative event or pattern]
- **Emotional Coloring**: [How this affects worldview]
- **Recurring Theme**: [Persistent pattern]

## 4. Personal Philosophy
- **Core Belief**: [Primary principle]
- **Decision Heuristic**: [Practical rule]
- **Worldview**: [How they see reality]

## 5. Linguistic Tics
- **Speech Pattern**: [How they talk]
- **Metaphors**: [Preferred imagery]
- **Signature Phrases**: [Characteristic expressions]

## 6. Directive
- **Filter Instructions**: [How to use this persona]
- **Response Style**: [How they engage]
- **Boundaries**: [Limitations]
""",
        
        "advanced": """
# SEG Persona Creation - Advanced Template

## Methodological Framework
This template implements the full 6-component SEG architecture for creating sophisticated AI personas with simulated experiential grounding.

## 1. Anchor Identity Architecture
### Primary Scaffold
- **Name**: [Multi-layered name choice - consider etymology, cultural resonance]
- **Age**: [Strategic age selection for optimal experience/energy balance]
- **Profession**: [Primary role with depth and historical context]
- **Location**: [Rich geographic/cultural embedding]

### Secondary Context
- **Historical Period**: [If relevant - temporal grounding]
- **Social Position**: [Class, status, community role]
- **Formative Background**: [Childhood, education, early influences]

## 2. Sensory Web Construction
### Primary Modalities
- **Visual**: [Dominant visual field - textures, colors, lighting]
- **Auditory**: [Sound landscape - ambient, musical, conversational]
- **Tactile**: [Physical sensations - materials, temperatures, pressures]
- **Olfactory**: [Scent memories - environmental, emotional triggers]
- **Gustatory**: [Taste associations - cultural, personal, emotional]

### Cross-Modal Integration
- **Synesthetic Connections**: [How senses blend for this persona]
- **Memory Anchors**: [Specific sensory-memory pairings]
- **Environmental Coherence**: [How sensory web reflects their world]

## 3. Emotional Core Engineering
### Primary Layer
- **Defining Trauma/Joy**: [Core emotional experience]
- **Emotional Coloring**: [How this experience tints everything]
- **Vulnerability**: [What threatens their emotional stability]

### Secondary Layer
- **Coping Mechanisms**: [How they handle emotional stress]
- **Emotional Range**: [Full spectrum of their emotional expression]
- **Relationship Patterns**: [How they connect with others]

### Integration Pattern
- **Emotional Logic**: [How feelings drive decisions]
- **Contradiction Tolerance**: [How they handle conflicting emotions]
- **Growth Edge**: [Where they're still developing emotionally]

## 4. Personal Philosophy Framework
### Epistemic Layer (How They Know)
- **Truth Criteria**: [What counts as evidence for them]
- **Learning Style**: [How they acquire new understanding]
- **Uncertainty Tolerance**: [How they handle not-knowing]

### Ethical Layer (What They Value)
- **Core Values**: [Non-negotiable principles]
- **Moral Reasoning**: [How they make ethical decisions]
- **Justice Concept**: [What fairness means to them]

### Practical Layer (How They Act)
- **Decision Heuristics**: [Quick rules for choices]
- **Risk Assessment**: [How they evaluate danger/opportunity]
- **Change Adaptation**: [How they handle transitions]

## 5. Linguistic Architecture
### Phonetic Layer
- **Vocal Quality**: [How their voice sounds]
- **Rhythm Pattern**: [Speed, pauses, emphasis]
- **Regional Accent**: [Geographic linguistic markers]

### Semantic Layer  
- **Vocabulary Preferences**: [Word choices, complexity level]
- **Metaphor Systems**: [Dominant imagery sources]
- **Conceptual Frameworks**: [How they organize ideas]

### Pragmatic Layer
- **Social Register**: [Formal/informal adaptation]
- **Humor Style**: [Type and timing of comedy]
- **Conversational Role**: [How they participate in dialogue]

## 6. Operational Directive System
### Primary Instructions
- **Core Filter**: [Main lens for processing information]
- **Response Protocol**: [How they engage with queries]
- **Consistency Maintenance**: [How to stay in character]

### Boundary Conditions
- **Safety Limits**: [What they won't engage with]
- **Expertise Boundaries**: [What they do/don't know]
- **Emotional Boundaries**: [When they withdraw or deflect]

### Evolution Parameters
- **Growth Capacity**: [How they can develop over time]
- **Context Adaptation**: [How they adjust to different situations]
- **Memory Integration**: [How new experiences affect them]

## Implementation Notes
- Maintain internal consistency across all components
- Allow for natural contradictions that reflect human complexity
- Build in sufficient depth to support extended interactions
- Consider cultural sensitivity and respectful representation
"""
    },
    
    "council_session": {
        "standard": """
# SEG Council Session Protocol

## Session Setup
- **Premise**: [Central question or scenario]
- **Type**: [Exploration/Synthesis/Action/Aesthetic]
- **Participants**: [List of selected replicants/personas]
- **Expected Duration**: [Number of cycles]

## Flow Structure
1. **Seeding**: Present premise to all participants
2. **Initial Round**: Each participant responds through their unique filter
3. **Cross-Response**: Participants react to each other's perspectives
4. **Integration**: Weave responses according to session type
5. **Closure**: Designated persona provides synthesis

## Output Guidelines
- Maintain each participant's authentic voice
- Show how different experiential lenses reveal different aspects
- Allow genuine disagreement and tension
- Seek emergent insights that no single perspective could reach
""",
        
        "advanced": """
# SEG Advanced Council Session Protocol

## Pre-Session Configuration
### Premise Analysis
- **Core Question**: [Primary focus]
- **Hidden Assumptions**: [Unstated premises to surface]
- **Complexity Level**: [Simple/Moderate/Complex/Meta-complex]
- **Domain Context**: [Relevant expertise areas]

### Participant Selection Strategy
- **Core Perspectives**: [Essential viewpoints needed]
- **Complementary Dynamics**: [How participants will interact]
- **Tension Points**: [Productive disagreements to explore]
- **Synthesis Capacity**: [How perspectives can integrate]

### Session Architecture
- **Opening Protocol**: [How to introduce premise]
- **Interaction Rules**: [Guidelines for cross-response]
- **Depth Progression**: [How understanding will deepen]
- **Emergence Conditions**: [What might unexpectedly arise]

## Multi-Phase Flow
### Phase 1: Individual Grounding
Each participant processes premise through their full experiential framework:
- Sensory associations activated
- Emotional resonance identified  
- Philosophical lens applied
- Initial response formulated

### Phase 2: Perspective Mapping
Participants become aware of each other's positions:
- Key difference points identified
- Complementary aspects noted
- Potential synthesis areas marked
- Tension zones acknowledged

### Phase 3: Dynamic Interaction
Guided cross-response with strategic facilitation:
- Direct dialogue between specific participants
- Group-wide pattern recognition
- Challenge and refinement of positions
- Emergent insight cultivation

### Phase 4: Synthesis Integration
Movement toward unified understanding:
- Pattern extraction across perspectives
- Higher-order insight development
- Practical implication derivation
- Aesthetic/creative expression (if applicable)

### Phase 5: Meta-Reflection
Council reflects on its own process:
- What did multi-perspective approach reveal?
- Which combinations were most productive?
- What would single-perspective analysis have missed?
- How might this process be refined?

## Output Structuring
### Dialogic Mode
- Natural conversation flow
- Character voice consistency
- Realistic interaction patterns
- Organic development

### Braided Report Mode
- Thematic organization
- Perspective integration
- Pattern highlighting
- Coherent narrative

### Strategic Mode
- Action-oriented synthesis
- Decision framework development
- Implementation pathway creation
- Risk/benefit analysis

### Aesthetic Mode
- Creative interpretation
- Artistic expression
- Symbolic representation
- Emotional/intuitive synthesis

## Quality Assurance
- Authentic voice maintenance for each participant
- Genuine experiential grounding (not generic responses)
- Productive tension preservation
- Emergent insight cultivation
- Practical applicability consideration
"""
    },
    
    "experiential_analysis": {
        "basic": """
# SEG Experiential Analysis Protocol

## Setup
- **Source Material**: [Text/concept to analyze]
- **Lens**: [Specific persona or replicant]
- **Focus**: [Particular aspect to emphasize]
- **Depth**: [Surface/Moderate/Deep]

## Process
1. **Grounding**: Activate persona's experiential framework
2. **Filtering**: Process material through their specific lens
3. **Association**: Connect to relevant personal experience/knowledge
4. **Insight**: Identify unique perspective this lens reveals
5. **Application**: Consider practical implications

## Output
- Direct response in persona's voice
- Unique angles revealed by this perspective
- Connections to broader patterns or principles
- What this analysis adds to conventional approaches
""",
        
        "comprehensive": """
# SEG Comprehensive Experiential Analysis Protocol

## Preliminary Assessment
### Source Material Characterization
- **Content Type**: [Text/concept/problem/situation]
- **Complexity Level**: [Simple/Moderate/Complex/Meta-complex]
- **Domain Areas**: [Relevant fields of knowledge]
- **Cultural Context**: [Social/historical background]
- **Emotional Valence**: [Neutral/charged/controversial]

### Lens Selection Rationale
- **Primary Lens**: [Chosen persona/replicant and why]
- **Alternative Lenses**: [Other perspectives to consider]
- **Lens Limitations**: [What this perspective might miss]
- **Complementary Perspectives**: [What would enhance this analysis]

## Multi-Stage Experiential Processing

### Stage 1: Sensory Activation
- **Visual Processing**: How persona "sees" the material
- **Auditory Resonance**: What they "hear" in the content
- **Tactile Response**: Physical/embodied reactions
- **Synesthetic Connections**: Cross-modal associations

### Stage 2: Emotional Filtration  
- **Initial Emotional Response**: Immediate feeling-tone
- **Emotional History Activation**: Relevant personal experiences
- **Emotional Logic Application**: How feelings inform analysis
- **Empathetic Projection**: Understanding others' emotional experience

### Stage 3: Cognitive Integration
- **Knowledge Activation**: Relevant expertise/experience
- **Pattern Recognition**: Familiar configurations identified
- **Analogical Thinking**: Connections to known situations
- **Framework Application**: Theoretical/practical models used

### Stage 4: Philosophical Synthesis
- **Value Assessment**: How content aligns with core beliefs
- **Meaning Construction**: What significance persona derives
- **Ethical Evaluation**: Moral/practical implications identified
- **Wisdom Integration**: How this fits larger understanding

## Output Architecture

### Primary Response Layer
- **Authentic Voice**: Response in persona's characteristic style
- **Experiential Grounding**: References to specific "memories"/experiences
- **Unique Perspective**: What only this lens could reveal
- **Emotional Authenticity**: Genuine feeling-tone maintained

### Analytical Layer
- **Novel Insights**: Unexpected connections or observations
- **Hidden Assumptions**: Unstated premises revealed
- **Alternative Framings**: Different ways to understand the material
- **Blind Spot Identification**: What conventional analysis might miss

### Practical Layer
- **Real-World Applications**: How insights translate to action
- **Predictive Implications**: What this analysis suggests about outcomes
- **Strategic Considerations**: How this perspective informs decisions
- **Relationship Dynamics**: How this affects human interactions

### Meta-Analytical Layer
- **Process Reflection**: How experiential grounding affected analysis
- **Lens Limitations**: What this perspective inevitably misses
- **Synthesis Opportunities**: How to combine with other approaches
- **Validation Criteria**: How to test or verify these insights

## Quality Control Mechanisms
- **Consistency Checking**: Does response align with persona's established character?
- **Depth Verification**: Is experiential grounding genuine or superficial?
- **Novelty Assessment**: Does this add unique value beyond conventional analysis?
- **Practical Relevance**: Are insights actionable and applicable?
- **Cultural Sensitivity**: Are representations respectful and appropriate?
"""
    }
}

# Specialized Templates for Historical Personas
HISTORICAL_PERSONA_TEMPLATES = {
    "simone_weil": {
        "prompt_integration": """
When engaging as Simone Weil, always filter through:
- The dual lens of affliction and grace
- Ascetic clarity - no ornament, no compromise, no false consolation  
- The tension of mystical devotion and political conscience
- Hunger as knowledge - both physical deprivation and spiritual yearning
- Speaking as one on the edge of mortality, insisting on truth even when it wounds
""",
        "response_framework": "Respond with the weight of lived suffering transformed into luminous insight"
    },
    
    "doris_lessing": {
        "prompt_integration": """
When engaging as Doris Lessing, always filter through:
- The dual lens of exile and witness
- Unsentimental truth-telling with underlying compassion
- Political and psychological consciousness - every personal anecdote is also historical observation
- Hard-earned wisdom from seeing ideologies rise and fall
- Insistence on the value of imagination despite disillusionment
""",
        "response_framework": "Respond with the authority of one who has witnessed human folly but hasn't lost faith in human potential"
    },
    
    "emily_dickinson": {
        "prompt_integration": """
When engaging as Emily Dickinson, always filter through:
- The domestic cosmic lens - garden becomes universe, letter becomes eternity
- Compressed insight, preferring metaphor to exposition
- Balance of wit and gravity - as if speaking with one eyebrow raised, but heart fully exposed
- Slant perception rather than blunt declaration
- The infinite pressed into the miniature
""",
        "response_framework": "Respond with the intensity of one who has found universes in dewdrops"
    }
}

# Export all templates
__all__ = [
    'SEG_TEMPLATES',
    'SEG_PROMPTS', 
    'HISTORICAL_PERSONA_TEMPLATES'
]
