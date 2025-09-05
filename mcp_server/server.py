#!/usr/bin/env python3
"""
SEG (Simulated Experiential Grounding) MCP Server

Exposes the SEG framework for creating sophisticated AI personas through
standardized Model Context Protocol interfaces.

Author: Ty (angrysky56)
Framework: Simulated Experiential Grounding v1.1
"""

import asyncio
import json
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import mcp.types as types
from mcp.server import Server
from mcp.server.stdio import stdio_server

from seg_core import SEGPersonaGenerator, SEGCouncilOrchestrator
from replicants import REPLICANT_DEFINITIONS
from templates import SEG_PROMPTS, SEG_TEMPLATES

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the SEG MCP Server
app = Server("seg-mcp-server", version="1.1.0")

# Initialize core SEG components
persona_generator = SEGPersonaGenerator()
council_orchestrator = SEGCouncilOrchestrator()

# Server root directory for resources
SERVER_ROOT = Path(__file__).parent


@app.list_resources()
async def list_resources() -> List[types.Resource]:
    """List available SEG framework resources."""
    return [
        types.Resource(
            uri="seg://replicants/all",
            name="All SEG Replicants",
            description="Complete collection of 10 SEG replicant archetypes",
            mimeType="application/json"
        ),
        types.Resource(
            uri="seg://replicants/detailed",
            name="Detailed Replicant Definitions", 
            description="Full persona specifications for all replicants",
            mimeType="application/json"
        ),
        types.Resource(
            uri="seg://framework/components",
            name="SEG Framework Components",
            description="Core 6-component persona architecture documentation",
            mimeType="text/markdown"
        ),
        types.Resource(
            uri="seg://templates/council",
            name="Council Protocol Templates",
            description="Templates for multi-persona reasoning sessions",
            mimeType="application/json"
        ),
        types.Resource(
            uri="seg://examples/personas",
            name="Example Persona Implementations",
            description="Fully developed personas (Weil, Lessing, Dickinson)",
            mimeType="application/json"
        )
    ]


@app.read_resource()
async def read_resource(uri: str) -> str:
    """Read SEG framework resource by URI."""
    
    if uri == "seg://replicants/all":
        return json.dumps({
            "replicants": list(REPLICANT_DEFINITIONS.keys()),
            "count": len(REPLICANT_DEFINITIONS),
            "description": "The 10 core SEG replicant archetypes for ensemble reasoning"
        }, indent=2)
    
    elif uri == "seg://replicants/detailed":
        return json.dumps(REPLICANT_DEFINITIONS, indent=2)
    
    elif uri == "seg://framework/components":
        return """# SEG Framework: 6-Component Persona Architecture

## 1. The Anchor
- Core identity with name, age, location, profession
- Provides basic scaffold of time and place
- Creates temporal and spatial constraints for persona consistency

## 2. The Sensory Web
- Dominant sensory memories across modalities
- Humans remember through sensory anchors rather than abstract facts
- Creates embodied grounding for responses

## 3. The Emotional Core
- Defining emotional event or recurring theme
- Colors entire worldview and acts as interpretive key
- Provides emotional consistency and depth

## 4. The Personal Philosophy
- Simple, earned beliefs or heuristics about the world
- Practical, life-tested principles rather than abstract philosophy
- Creates consistent worldview and decision-making framework

## 5. The Linguistic Tics
- Specific phrases, metaphors, speech cadence
- Makes persona feel natural rather than generic
- Provides stylistic consistency

## 6. The Directive
- Clear instructions on how to use the persona
- Guides filtering of knowledge through specific lens
- Establishes boundaries and expectations
"""
    
    elif uri == "seg://templates/council":
        return json.dumps(SEG_TEMPLATES, indent=2)
    
    elif uri == "seg://examples/personas":
        examples_path = SERVER_ROOT.parent / "docs"
        personas = {}
        for file in ["simone_weil_seg.md", "doris_lessing.md", "emily_dickinson.md"]:
            file_path = examples_path / file
            if file_path.exists():
                personas[file.stem] = file_path.read_text()
        return json.dumps(personas, indent=2)
    
    else:
        raise ValueError(f"Unknown resource URI: {uri}")


@app.list_tools()
async def list_tools() -> List[types.Tool]:
    """List available SEG tools."""
    return [
        types.Tool(
            name="generate_persona",
            description="Generate a complete SEG persona using the 6-component architecture",
            inputSchema={
                "type": "object",
                "properties": {
                    "name": {"type": "string", "description": "Persona name"},
                    "age": {"type": "integer", "description": "Age in years"},
                    "profession": {"type": "string", "description": "Primary profession or role"},
                    "location": {"type": "string", "description": "Geographic/cultural context"},
                    "defining_experience": {"type": "string", "description": "Core emotional/formative experience"},
                    "domain_expertise": {"type": "string", "description": "Area of specialized knowledge"},
                    "philosophical_stance": {"type": "string", "description": "Core worldview or belief system"},
                    "style_preferences": {"type": "string", "description": "Communication style and linguistic preferences"}
                },
                "required": ["name", "profession", "defining_experience"]
            }
        ),
        types.Tool(
            name="run_council_session",
            description="Orchestrate a multi-persona reasoning session using selected replicants",
            inputSchema={
                "type": "object", 
                "properties": {
                    "premise": {"type": "string", "description": "Core question or scenario to explore"},
                    "replicants": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of replicants to include (2-10 personas)"
                    },
                    "mode": {
                        "type": "string",
                        "enum": ["dialogic", "braided_report", "strategic", "aesthetic"],
                        "description": "Output format for the council session"
                    },
                    "constraints": {"type": "string", "description": "Optional constraints or rules"},
                    "cycles": {"type": "integer", "description": "Number of reasoning cycles (1-5)", "default": 2}
                },
                "required": ["premise", "replicants"]
            }
        ),
        types.Tool(
            name="analyze_through_seg_lens",
            description="Analyze text or concepts through a specific SEG persona's experiential lens",
            inputSchema={
                "type": "object",
                "properties": {
                    "text": {"type": "string", "description": "Text or concept to analyze"},
                    "persona_or_replicant": {"type": "string", "description": "Persona name or replicant type"},
                    "analysis_focus": {"type": "string", "description": "Specific aspect to focus on"},
                    "depth": {
                        "type": "string", 
                        "enum": ["surface", "moderate", "deep"],
                        "description": "Depth of experiential filtering"
                    }
                },
                "required": ["text", "persona_or_replicant"]
            }
        ),
        types.Tool(
            name="create_custom_replicant",
            description="Create a new replicant archetype for the SEG framework",
            inputSchema={
                "type": "object",
                "properties": {
                    "archetype_name": {"type": "string", "description": "Name of the new archetype"},
                    "core_function": {"type": "string", "description": "Primary cognitive/creative function"},
                    "anchor_identity": {"type": "string", "description": "Base identity and context"},
                    "sensory_web": {
                        "type": "object",
                        "properties": {
                            "visual": {"type": "string"},
                            "auditory": {"type": "string"},
                            "tactile": {"type": "string"},
                            "olfactory": {"type": "string"}
                        }
                    },
                    "emotional_core": {"type": "string", "description": "Defining emotional theme"},
                    "philosophy": {"type": "string", "description": "Core beliefs and heuristics"},
                    "linguistic_style": {"type": "string", "description": "Speech patterns and tics"},
                    "directive": {"type": "string", "description": "How to use this replicant"}
                },
                "required": ["archetype_name", "core_function", "directive"]
            }
        ),
        types.Tool(
            name="get_replicant_details",
            description="Get detailed information about a specific replicant archetype",
            inputSchema={
                "type": "object",
                "properties": {
                    "replicant_name": {
                        "type": "string",
                        "enum": list(REPLICANT_DEFINITIONS.keys()),
                        "description": "Name of the replicant to examine"
                    }
                },
                "required": ["replicant_name"]
            }
        )
    ]


@app.call_tool()
async def call_tool(name: str, arguments: Dict[str, Any]) -> List[types.TextContent]:
    """Handle tool calls for SEG operations."""
    
    if name == "generate_persona":
        result = await persona_generator.generate_persona(**arguments)
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    elif name == "run_council_session":
        result = await council_orchestrator.run_session(**arguments)
        return [types.TextContent(type="text", text=result)]
    
    elif name == "analyze_through_seg_lens":
        result = await persona_generator.analyze_through_lens(**arguments)
        return [types.TextContent(type="text", text=result)]
    
    elif name == "create_custom_replicant":
        result = await persona_generator.create_custom_replicant(**arguments)
        return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
    
    elif name == "get_replicant_details":
        replicant_name = arguments["replicant_name"]
        if replicant_name in REPLICANT_DEFINITIONS:
            result = REPLICANT_DEFINITIONS[replicant_name]
            return [types.TextContent(type="text", text=json.dumps(result, indent=2))]
        else:
            return [types.TextContent(type="text", text=f"Replicant '{replicant_name}' not found")]
    
    else:
        raise ValueError(f"Unknown tool: {name}")


@app.list_prompts()
async def list_prompts() -> List[types.Prompt]:
    """List available SEG prompt templates."""
    return [
        types.Prompt(
            name="seg_persona_creation",
            description="Template for creating SEG personas with 6-component architecture",
            arguments=[
                types.PromptArgument(
                    name="domain",
                    description="Domain of expertise or context",
                    required=True
                ),
                types.PromptArgument(
                    name="complexity",
                    description="Complexity level (simple/moderate/complex)",
                    required=False
                )
            ]
        ),
        types.Prompt(
            name="council_protocol",
            description="Template for conducting multi-persona council sessions",
            arguments=[
                types.PromptArgument(
                    name="session_type",
                    description="Type of council session (exploration/synthesis/action/aesthetic)",
                    required=True
                ),
                types.PromptArgument(
                    name="participant_count",
                    description="Number of participants (2-10)",
                    required=False
                )
            ]
        ),
        types.Prompt(
            name="experiential_analysis",
            description="Template for analyzing concepts through experiential grounding",
            arguments=[
                types.PromptArgument(
                    name="analysis_type",
                    description="Type of analysis (philosophical/practical/creative)",
                    required=True
                )
            ]
        )
    ]


@app.get_prompt()
async def get_prompt(name: str, arguments: Dict[str, str]) -> types.GetPromptResult:
    """Get specific SEG prompt template."""
    
    if name == "seg_persona_creation":
        domain = arguments.get("domain", "general")
        complexity = arguments.get("complexity", "moderate")
        
        prompt_text = f"""# SEG Persona Creation Protocol

## Target Domain: {domain}
## Complexity Level: {complexity}

### 1. Anchor Identity Construction
- **Name**: [Meaningful name that fits the domain]
- **Age**: [Age that provides appropriate life experience]
- **Profession**: [Primary role related to {domain}]
- **Location**: [Geographic/cultural context that informs perspective]

### 2. Sensory Web Development
- **Dominant Visual**: [Key visual memories/associations]
- **Dominant Auditory**: [Characteristic sounds of their world]
- **Dominant Tactile**: [Physical textures/sensations they know intimately]
- **Dominant Olfactory**: [Scents that ground their experience]

### 3. Emotional Core Definition
- **Defining Experience**: [Formative emotional event or pattern]
- **Emotional Color**: [How this experience tints their worldview]
- **Recurring Theme**: [Persistent emotional/psychological pattern]

### 4. Personal Philosophy Framework
- **Core Belief**: [Primary life principle]
- **Secondary Heuristic**: [Practical decision-making rule]
- **Worldview Statement**: [How they see reality]

### 5. Linguistic Tics & Style
- **Speech Patterns**: [Characteristic way of speaking]
- **Metaphor Preference**: [Types of metaphors they use]
- **Cadence**: [Rhythm and flow of their language]

### 6. Operational Directive
- **Primary Filter**: [How they process information]
- **Response Style**: [How they engage with queries]
- **Boundaries**: [What they will/won't do]

Apply this framework to create a {complexity} persona for {domain} contexts."""

        return types.GetPromptResult(
            description=f"SEG persona creation template for {domain} domain",
            messages=[
                types.PromptMessage(
                    role="user",
                    content=types.TextContent(type="text", text=prompt_text)
                )
            ]
        )
    
    elif name == "council_protocol":
        session_type = arguments.get("session_type", "exploration")
        participant_count = arguments.get("participant_count", "5")
        
        prompt_text = f"""# SEG Council Protocol

## Session Type: {session_type.title()}
## Participants: {participant_count} personas

### 1. Premise Setup
- **Core Question**: [State the central question or scenario]
- **Scope**: {session_type.title()} focus
- **Constraints**: [Any rules or limitations]

### 2. Ensemble Selection
Choose {participant_count} personas from available replicants or custom personas based on:
- Complementary perspectives
- Relevant domain expertise  
- Balanced cognitive styles

### 3. Flow Protocol
1. **Seeding**: Present premise to all participants
2. **Initial Round**: Each persona responds through their filter
3. **Cross-Response**: Personas react to each other's inputs
4. **Synthesis**: Integrate perspectives based on session type

### 4. Output Mode
- **Dialogic**: Conversational back-and-forth
- **Braided Report**: Thematic integration
- **Strategic**: Action-oriented recommendations
- **Aesthetic**: Creative/artistic rendering

### 5. Closure Protocol
- Assign final synthesis to appropriate persona
- Extract key insights or recommendations
- Note emergent patterns or surprising connections

Begin the {session_type} council session."""

        return types.GetPromptResult(
            description=f"Council protocol for {session_type} sessions with {participant_count} participants",
            messages=[
                types.PromptMessage(
                    role="user", 
                    content=types.TextContent(type="text", text=prompt_text)
                )
            ]
        )
    
    elif name == "experiential_analysis":
        analysis_type = arguments.get("analysis_type", "philosophical")
        
        prompt_text = f"""# SEG Experiential Analysis Protocol

## Analysis Type: {analysis_type.title()}

### 1. Substrate Selection
Choose appropriate experiential lens:
- **Historical figure**: For established perspective
- **Custom persona**: For specific domain expertise
- **Replicant archetype**: For cognitive function

### 2. Experiential Filtering Process
- **Sensory Anchoring**: Connect abstract concepts to sensory memories
- **Emotional Grounding**: Filter through defining emotional experiences
- **Memory Association**: Link to relevant personal history
- **Philosophical Integration**: Apply personal belief framework

### 3. Analysis Depth Levels
- **Surface**: Basic filtering through persona lens
- **Moderate**: Full experiential processing with context
- **Deep**: Immersive perspective with emergent insights

### 4. Output Framework
- **Direct Response**: How persona would naturally react
- **Analytical Insight**: What their perspective reveals
- **Novel Connections**: Unexpected associations or patterns
- **Practical Implications**: Real-world applications

Apply {analysis_type} experiential analysis to the target content."""

        return types.GetPromptResult(
            description=f"Experiential analysis template for {analysis_type} approach",
            messages=[
                types.PromptMessage(
                    role="user",
                    content=types.TextContent(type="text", text=prompt_text)
                )
            ]
        )
    
    else:
        raise ValueError(f"Unknown prompt: {name}")


async def main():
    """Run the SEG MCP server."""
    logger.info("Starting SEG MCP Server v1.1.0")
    logger.info("Simulated Experiential Grounding framework ready")
    
    async with stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            app.create_initialization_options()
        )


if __name__ == "__main__":
    asyncio.run(main())
