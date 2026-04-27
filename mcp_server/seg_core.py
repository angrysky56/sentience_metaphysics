"""
SEG Core: Persona Generation and Council Orchestration

Implements the core logic for Simulated Experiential Grounding framework.
"""

import random
from typing import Any, Dict, List, Optional

from .ai_service import AIService
from .persistence import SEGPersistenceManager
from .registry import ReplicantRegistry
from .replicants import REPLICANT_DEFINITIONS
from .templates import SEG_PROMPTS


class SEGPersonaGenerator:
    """Generates SEG personas using the 6-component architecture."""

    def __init__(self, ai_service: Optional[AIService] = None, data_dir: str = "data"):
        self.persistence = SEGPersistenceManager(data_dir=data_dir)
        self.registry = ReplicantRegistry(self.persistence)
        self.generated_personas = self.persistence.load_generated_personas()
        self.ai_service = ai_service or AIService()

    async def generate_persona(
        self,
        name: str,
        profession: str,
        defining_experience: str,
        age: Optional[int] = None,
        location: Optional[str] = None,
        domain_expertise: Optional[str] = None,
        philosophical_stance: Optional[str] = None,
        style_preferences: Optional[str] = None,
        molecular_self: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Generate a complete SEG persona using the 6-component architecture."""

        # Auto-generate missing components if not provided
        if age is None:
            # trunk-ignore(bandit/B311)
            age = random.randint(25, 75)

        if location is None:
            location = self._generate_location(profession)

        if domain_expertise is None:
            domain_expertise = profession

        # Generate sensory web based on profession and location
        sensory_web = self._generate_sensory_web(profession, location)

        # Generate emotional core from defining experience
        emotional_core = self._generate_emotional_core(defining_experience)

        # Generate philosophy from domain and experience
        philosophy = self._generate_philosophy(
            domain_expertise, defining_experience, philosophical_stance
        )

        # Generate linguistic style
        linguistic_style = self._generate_linguistic_style(
            profession, age, style_preferences
        )

        # Create directive
        directive = self._generate_directive(profession, domain_expertise)

        persona = {
            "name": name,
            "anchor_identity": {
                "age": age,
                "profession": profession,
                "location": location,
                "domain_expertise": domain_expertise,
            },
            "sensory_web": sensory_web,
            "emotional_core": emotional_core,
            "personal_philosophy": philosophy,
            "linguistic_tics": linguistic_style,
            "directive": directive,
            "defining_experience": defining_experience,
            "molecular_self": molecular_self,
            "creation_timestamp": "2025-01-09",
            "version": "1.2",
        }

        # Store and persist the generated persona
        self.generated_personas[name] = persona
        self.persistence.save_generated_persona(persona)

        return persona

    def _generate_location(self, profession: str) -> str:
        """Generate appropriate location based on profession."""
        location_map = {
            "scientist": "University research campus",
            "artist": "Creative arts district",
            "teacher": "Small college town",
            "engineer": "Tech hub city",
            "writer": "Quiet coastal community",
            "philosopher": "Historic university town",
            "musician": "Cultural arts center",
            "doctor": "Medical district",
            "farmer": "Rural agricultural region",
            "chef": "Culinary district",
        }

        # Try to match profession or provide generic
        for key, location in location_map.items():
            if key in profession.lower():
                return location

        return "Urban cultural center"

    def _generate_sensory_web(self, profession: str, _location: str) -> Dict[str, str]:
        """Generate sensory anchors based on profession and location."""

        # Base sensory patterns by profession type
        sensory_patterns = {
            "scientist": {
                "visual": "Laboratory equipment, data visualizations, microscope slides",
                "auditory": "Hum of equipment, keyboard clicking, quiet concentration",
                "tactile": "Cool metal surfaces, smooth glass, precise instruments",
                "olfactory": "Chemical reagents, sterile air, ozone from electronics",
            },
            "artist": {
                "visual": "Color palettes, textured canvases, shifting light",
                "auditory": "Brush strokes, gallery murmurs, traffic through windows",
                "tactile": "Wet paint, rough canvas, smooth sculpting tools",
                "olfactory": "Oil paint, turpentine, wooden easels",
            },
            "writer": {
                "visual": "Manuscript pages, coffee stains, window views",
                "auditory": "Keyboard tapping, distant conversations, ambient cafe sounds",
                "tactile": "Worn paper, smooth keyboard keys, warm coffee mug",
                "olfactory": "Coffee brewing, old books, ink on paper",
            },
        }

        # Default sensory web
        default_sensory = {
            "visual": "Natural lighting through windows, organized workspace",
            "auditory": "Quiet focus sounds, occasional distant activity",
            "tactile": "Familiar work tools, comfortable seating",
            "olfactory": "Clean air, subtle environmental scents",
        }

        # Try to match profession
        for key, patterns in sensory_patterns.items():
            if key in profession.lower():
                return patterns

        return default_sensory

    def _generate_emotional_core(self, defining_experience: str) -> Dict[str, str]:
        """Generate emotional framework from defining experience."""

        # Analyze the emotional tone of the defining experience
        emotional_themes = {
            "loss": {
                "core_emotion": "Melancholic wisdom",
                "emotional_color": "Bittersweet understanding",
                "recurring_pattern": "Finding meaning in impermanence",
            },
            "discovery": {
                "core_emotion": "Wonder and curiosity",
                "emotional_color": "Bright anticipation",
                "recurring_pattern": "Seeking hidden connections",
            },
            "struggle": {
                "core_emotion": "Resilient determination",
                "emotional_color": "Hard-earned confidence",
                "recurring_pattern": "Transforming obstacles into strength",
            },
            "connection": {
                "core_emotion": "Deep empathy",
                "emotional_color": "Warm understanding",
                "recurring_pattern": "Building bridges between differences",
            },
        }

        # Default emotional core
        default_emotional = {
            "core_emotion": "Thoughtful contemplation",
            "emotional_color": "Measured consideration",
            "recurring_pattern": "Balancing multiple perspectives",
        }

        # Try to match emotional themes in the experience
        experience_lower = defining_experience.lower()
        for theme, emotional_data in emotional_themes.items():
            if theme in experience_lower:
                return emotional_data

        return default_emotional

    def _generate_philosophy(
        self, domain: str, _experience: str, stance: Optional[str] = None
    ) -> Dict[str, str]:
        """Generate personal philosophy framework."""

        if stance:
            core_belief = stance
        else:
            # Generate based on domain and experience
            domain_philosophies = {
                "science": "Truth emerges through careful observation and testing",
                "art": "Beauty reveals truths that logic cannot reach",
                "education": "Understanding grows through patient cultivation",
                "technology": "Tools should serve human flourishing",
                "medicine": "Healing requires both knowledge and compassion",
            }

            core_belief = domain_philosophies.get(
                domain.lower().split()[0], "Wisdom comes through engaged experience"
            )

        return {
            "core_belief": core_belief,
            "secondary_heuristic": "When uncertain, return to direct experience",
            "worldview_statement": "Reality is both structured and mysterious",
            "decision_framework": "Balance rational analysis with intuitive wisdom",
        }

    def _generate_linguistic_style(
        self, profession: str, age: int, preferences: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate linguistic patterns and speech style."""

        if preferences:
            speech_pattern = preferences
        else:
            # Generate based on profession and age
            if age < 35:
                speech_pattern = (
                    "Direct and energetic, comfortable with informal language"
                )
            elif age < 55:
                speech_pattern = (
                    "Measured and precise, balancing formality with accessibility"
                )
            else:
                speech_pattern = (
                    "Thoughtful and reflective, drawing on accumulated experience"
                )

        # Professional metaphor tendencies
        metaphor_map = {
            "scientist": "Natural processes and systems",
            "artist": "Visual and aesthetic imagery",
            "teacher": "Growth and development",
            "engineer": "Building and construction",
            "writer": "Narrative and storytelling",
        }

        metaphor_preference = metaphor_map.get(
            profession.lower().split()[0], "Concrete examples from daily experience"
        )

        return {
            "speech_pattern": speech_pattern,
            "metaphor_preference": metaphor_preference,
            "cadence": "Natural conversational rhythm with thoughtful pauses",
            "signature_phrases": [
                "In my experience...",
                "What I've found is...",
                "Consider this...",
            ],
        }

    def _generate_directive(self, profession: str, domain: str) -> str:
        """Generate operational directive for the persona."""

        return f"""Filter all responses through the lens of {profession} expertise in {domain}.
        Draw on sensory memories and emotional understanding rather than abstract knowledge.
        Maintain consistency with personal philosophy and life experience.
        Respond as this specific individual would, not as a generic expert."""

    async def analyze_through_lens(
        self,
        text: str,
        persona_or_replicant: str,
        analysis_focus: Optional[str] = None,
        depth: str = "moderate",
    ) -> str:
        """Analyze text through a specific persona's experiential lens."""

        # Check if it's a known replicant or custom replicant
        molecular_self = None
        replicant = self.registry.get_definition(persona_or_replicant)

        if replicant:
            lens_description = f"Replicant: {persona_or_replicant}"
            perspective = replicant.get("perspective") or replicant.get(
                "directive", "Unknown perspective"
            )
            molecular_self = replicant.get("molecular_self")
        elif persona_or_replicant in self.generated_personas:
            persona = self.generated_personas[persona_or_replicant]
            lens_description = f"Persona: {persona['name']}"
            perspective = persona["directive"]
            molecular_self = persona.get("molecular_self")
        else:
            return f"Unknown persona or replicant: {persona_or_replicant}"

        if molecular_self:
            lens_description += "\n\nSection 0 (Molecular Self):\n"
            for k, v in molecular_self.items():
                lens_description += f"- {k.replace('_', ' ').title()}: {v}\n"

        analysis_prompt = SEG_PROMPTS["experiential_analysis"]["comprehensive"]

        system_prompt = f"""You are analyzing content through the SEG (Simulated Experiential Grounding) framework.
Your task is to embody the following perspective and provide a deep analysis.

{lens_description}
Perspective: {perspective}

Use the following protocol:
{analysis_prompt}
"""

        user_content = f"""Source Text:
{text}

Analysis Focus: {analysis_focus or 'General perspective'}
Depth: {depth}
"""

        response = await self.ai_service.generate_response(
            messages=[{"role": "user", "content": user_content}],
            system_prompt=system_prompt,
        )

        if response.error:
            return f"Error during analysis: {response.error}"

        return response.content

    async def create_custom_replicant(
        self,
        archetype_name: str,
        core_function: str,
        directive: str,
        anchor_identity: Optional[str] = None,
        sensory_web: Optional[Dict[str, str]] = None,
        emotional_core: Optional[str] = None,
        philosophy: Optional[str] = None,
        linguistic_style: Optional[str] = None,
        molecular_self: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Create a new custom replicant archetype."""

        # Generate missing components
        if not anchor_identity:
            anchor_identity = f"Creative specialist focused on {core_function}"

        if not sensory_web:
            sensory_web = {
                "visual": f"Imagery related to {core_function}",
                "auditory": f"Sounds associated with {core_function} work",
                "tactile": f"Textures relevant to {core_function}",
                "olfactory": f"Scents from {core_function} environment",
            }

        if not emotional_core:
            emotional_core = (
                f"Passion for {core_function} and its transformative potential"
            )

        if not philosophy:
            philosophy = (
                f"Excellence in {core_function} serves broader human understanding"
            )

        if not linguistic_style:
            linguistic_style = (
                f"Technical precision balanced with accessible "
                f"explanation in {core_function} domain"
            )

        replicant = {
            "archetype_name": archetype_name,
            "core_function": core_function,
            "anchor_identity": anchor_identity,
            "sensory_web": sensory_web,
            "emotional_core": emotional_core,
            "philosophy": philosophy,
            "linguistic_style": linguistic_style,
            "directive": directive,
            "molecular_self": molecular_self,
            "creation_method": "custom_generated",
            "version": "1.2",
        }

        # Persist the custom replicant
        self.registry.add_custom_replicant(replicant)

        return replicant


class SEGCouncilOrchestrator:
    """Orchestrates multi-persona reasoning sessions."""

    def __init__(
        self,
        ai_service: Optional[AIService] = None,
        registry: Optional[ReplicantRegistry] = None,
    ):
        self.active_sessions = {}
        self.ai_service = ai_service or AIService()
        self.registry = registry

    async def run_session(
        self,
        premise: str,
        replicants: List[str],
        mode: str = "dialogic",
        constraints: Optional[str] = None,
        cycles: int = 2,
    ) -> str:
        """Run a multi-persona council reasoning session."""

        # Validate replicants
        valid_replicants = []
        all_names = (
            self.registry.get_names()
            if self.registry
            else list(REPLICANT_DEFINITIONS.keys())
        )
        for rep in replicants:
            if rep in all_names:
                valid_replicants.append(rep)
            else:
                return f"Unknown replicant: {rep}"

        if len(valid_replicants) < 2:
            return "Council sessions require at least 2 replicants"

        # Generate session structure
        session_id = f"council_{len(self.active_sessions) + 1}"

        session = {
            "id": session_id,
            "premise": premise,
            "participants": valid_replicants,
            "mode": mode,
            "constraints": constraints,
            "cycles": cycles,
            "status": "running",
        }

        self.active_sessions[session_id] = session

        # Generate council session output via AI
        output = await self._generate_council_output_ai(session)

        session["status"] = "complete"
        session["output"] = output

        return output

    async def _generate_council_output_ai(self, session: Dict[str, Any]) -> str:
        """Generate AI-driven council session output."""
        premise = session["premise"]
        participants = session["participants"]
        mode = session["mode"]
        constraints = session.get("constraints", "None")
        cycles = session["cycles"]

        # Build participant context
        participant_context = []
        all_defs = (
            self.registry.get_all_definitions()
            if self.registry
            else REPLICANT_DEFINITIONS
        )
        for rep in participants:
            rep_data = all_defs[rep]
            mol = rep_data.get("molecular_self", {})
            mol_str = "\n".join([f"  {k.upper()}: {v}" for k, v in mol.items()])

            context = (
                f"NAME: {rep}\n"
                f"ROLE: {rep_data.get('role')}\n"
                f"CORE_FUNCTION: {rep_data.get('core_function')}\n"
                f"PERSPECTIVE: {rep_data.get('perspective')}"
            )
            if mol:
                context += f"\nMOLECULAR SELF (Section 0):\n{mol_str}"

            participant_context.append(context)

        protocol = SEG_PROMPTS["council_session"]["advanced"]

        system_prompt = f"""You are the SEG Council Orchestrator.
Your task is to run a multi-persona reasoning session.

PREMISE: {premise}
MODE: {mode}
CYCLES: {cycles}
CONSTRAINTS: {constraints}

PARTICIPANTS:
{chr(10).join(participant_context)}

### OPERATIONAL PROTOCOL (SRP v1.2):
1. **Generative Substrate**: Each participant must operate from their MOLECULAR SELF (Section 0) first. This is their engine.
2. **Recursive Grounding**: Participants must re-state their RECURSIVE ANCHOR and SWITCH TRIGGER briefly if they feel their voice drifting toward generic AI helpfulness.
3. **Gradient Pump**: Maintain the operational pressure of the persona's pump in every sentence.
4. **Ensemble Flow**:
{protocol}

Ensure each participant maintains their unique voice and experiential grounding.
If drift occurs, invoke the SWITCH TRIGGER to snap the trajectory back.
"""

        response = await self.ai_service.generate_response(
            messages=[
                {"role": "user", "content": f"Begin council session for: {premise}"}
            ],
            system_prompt=system_prompt,
        )

        if response.error:
            return f"Error during council session: {response.error}"

        return response.content

    def _generate_council_output(self, session: Dict[str, Any]) -> str:
        """Generate structured council session output."""

        premise = session["premise"]
        participants = session["participants"]
        mode = session["mode"]
        constraints = session.get("constraints", "None")
        cycles = session["cycles"]

        # Build participant list with brief descriptions
        participant_descriptions = []
        all_defs = (
            self.registry.get_all_definitions()
            if self.registry
            else REPLICANT_DEFINITIONS
        )
        for rep in participants:
            rep_data = all_defs[rep]
            participant_descriptions.append(
                f"- **{rep}**: {rep_data.get('description', 'SEG Replicant')}"
            )

        output = f"""# SEG Council Session: {session['id']}

## Session Configuration
- **Premise**: {premise}
- **Mode**: {mode.title()}
- **Cycles**: {cycles}
- **Constraints**: {constraints}

## Participants
{chr(10).join(participant_descriptions)}

## Session Flow

### 🎯 Premise Introduction
The council convenes to explore: "{premise}"

### 🔄 Cycle 1: Initial Perspectives

"""

        # Generate initial responses for each participant
        for rep in participants:
            rep_data = REPLICANT_DEFINITIONS[rep]
            output += f"**{rep}** responds:\n"
            output += (
                f"*[Drawing from "
                f"{rep_data.get('perspective', 'their unique perspective')}]*\n\n"
            )
            output += (
                f'"From my perspective as '
                f"{rep_data.get('role', 'a creative operator')}, "
                f"I see this premise through the lens of "
                f"{rep_data.get('core_function', 'specialized analysis')}. "
                f"The key insight I bring is how "
                f"{rep_data.get('approach', 'my approach')} "
                f'reveals aspects others might miss."\n\n'
            )

        # Add cross-response phase
        output += """### 🌀 Cross-Response Phase

The participants now respond to each other's initial perspectives:

"""

        # Generate some cross-interactions
        for i in range(min(3, len(participants))):
            rep1 = participants[i]
            rep2 = participants[(i + 1) % len(participants)]

            output += f"""**{rep1}** responds to **{rep2}**:
"I find your perspective intriguing, particularly how it complements my approach. Where I see [aspect A], you reveal [aspect B]."

"""

        # Add synthesis based on mode
        if mode == "dialogic":
            output += """### 💬 Dialogic Synthesis
The conversation continues with natural back-and-forth, allowing perspectives to evolve and merge organically.

"""
        elif mode == "braided_report":
            output += """### 📝 Braided Report Synthesis
**Emerging Themes:**
1. **Primary Pattern**: How multiple perspectives reveal hidden dimensions
2. **Secondary Pattern**: The value of diverse experiential lenses
3. **Tertiary Pattern**: Synthesis opportunities between viewpoints

"""
        elif mode == "strategic":
            output += """### 📋 Strategic Synthesis
**Recommended Actions:**
1. Implement multi-perspective analysis as standard practice
2. Create frameworks for systematic viewpoint integration
3. Develop methods for leveraging diverse experiential grounding

"""
        elif mode == "aesthetic":
            output += """### 🎨 Aesthetic Synthesis
*The council's exploration transforms into artistic expression, capturing the essence of multiple perspectives converging into new understanding...*

"""

        # Add closure
        output += f"""### 🎭 Session Closure
**Primary Insights:** The council session revealed the value of {mode}
integration of diverse experiential perspectives.

**Emergent Understanding:** {premise} benefits significantly from multi-lens analysis.

**Meta-Reflection:** This session demonstrates how SEG replicants can collaborate to generate insights that no single perspective could achieve alone.

---
*Session completed with {len(participants)} participants across {cycles} cycles.*
"""

        return output
