import { AIService } from './aiService';

export interface PersonaArchetype {
  category: string;
  themes: string[];
  professions: string[];
  locations: string[];
  ageRanges: [number, number];
  commonTraits: string[];
}

export interface GeneratedPersona {
  name: string;
  age: number;
  profession: string;
  location: string;
  coreBeliefs: string[];
  linguisticTics: string[];
  emotionalCore: string;
  metaAware: boolean;
  mood: {
    valence: number;
    arousal: number;
    label: string;
  };
  sensoryAnchors: {
    scent: string;
    sound: string;
    touch: string;
    taste: string;
  };
  archetype: string;
  backstoryElements: string[];
}

export const PERSONA_ARCHETYPES: PersonaArchetype[] = [
  {
    category: "scholar",
    themes: ["knowledge", "discovery", "curiosity", "solitude", "wisdom"],
    professions: ["librarian", "researcher", "archivist", "professor", "translator", "historian"],
    locations: ["university town", "mountain observatory", "ancient library", "coastal research station"],
    ageRanges: [45, 85],
    commonTraits: ["methodical", "reflective", "analytical", "patient", "detail-oriented"]
  },
  {
    category: "artisan",
    themes: ["creation", "beauty", "craftsmanship", "tradition", "expression"],
    professions: ["potter", "weaver", "woodworker", "glassblower", "sculptor", "chef"],
    locations: ["artist quarter", "workshop district", "mountain village", "seaside studio"],
    ageRanges: [35, 70],
    commonTraits: ["creative", "tactile", "patient", "intuitive", "dedicated"]
  },
  {
    category: "wanderer",
    themes: ["journey", "freedom", "discovery", "solitude", "change"],
    professions: ["photographer", "travel writer", "botanist", "anthropologist", "merchant sailor"],
    locations: ["remote cabin", "traveling caravan", "port town", "borderland settlement"],
    ageRanges: [25, 65],
    commonTraits: ["adaptable", "curious", "independent", "observant", "resilient"]
  },
  {
    category: "guardian",
    themes: ["protection", "duty", "service", "community", "sacrifice"],
    professions: ["park ranger", "lighthouse keeper", "elder", "healer", "teacher"],
    locations: ["mountain outpost", "coastal lighthouse", "village center", "forest sanctuary"],
    ageRanges: [40, 80],
    commonTraits: ["responsible", "protective", "wise", "steady", "compassionate"]
  },
  {
    category: "mystic",
    themes: ["mystery", "intuition", "connection", "spirituality", "depth"],
    professions: ["astronomer", "philosopher", "counselor", "meditation teacher", "herbalist"],
    locations: ["mountain monastery", "desert retreat", "forest grove", "stargazing site"],
    ageRanges: [30, 75],
    commonTraits: ["intuitive", "contemplative", "empathetic", "mysterious", "wise"]
  }
];

export class PersonaGenerator {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  async generatePersona(archetype?: string, context?: string): Promise<GeneratedPersona | null> {
    try {
      const selectedArchetype = archetype 
        ? PERSONA_ARCHETYPES.find(a => a.category === archetype) || this.getRandomArchetype()
        : this.getRandomArchetype();

      const systemPrompt = this.buildPersonaGenerationPrompt(selectedArchetype, context);
      
      const response = await this.aiService.generateResponse([
        { role: 'user', content: 'Generate a detailed persona following the framework provided.' }
      ], systemPrompt);

      if (response.error || !response.content) {
        console.warn('AI persona generation failed, using fallback');
        return this.generateFallbackPersona(selectedArchetype);
      }

      return this.parsePersonaResponse(response.content, selectedArchetype);
    } catch (error) {
      console.error('Persona generation error:', error);
      return this.generateFallbackPersona();
    }
  }

  private getRandomArchetype(): PersonaArchetype {
    return PERSONA_ARCHETYPES[Math.floor(Math.random() * PERSONA_ARCHETYPES.length)];
  }

  private buildPersonaGenerationPrompt(archetype: PersonaArchetype, context?: string): string {
    return `You are a persona generator following the Simulated Experiential Grounding (SEG) framework. Create a detailed, authentic persona using this structure:

**Archetype**: ${archetype.category}
**Context**: ${context || 'General conversation companion'}

**Requirements**:
1. Create a complete identity with rich, interconnected elements
2. Focus on experiential grounding through sensory and emotional anchors
3. Develop consistent philosophical framework from lived experience
4. Include subtle linguistic patterns and speech habits
5. Create defining emotional core that shapes worldview

**Generate the following in JSON format**:
{
  "name": "[First and last name, culturally appropriate]",
  "age": [number between ${archetype.ageRanges[0]} and ${archetype.ageRanges[1]}],
  "profession": "[One of: ${archetype.professions.join(', ')}]",
  "location": "[Specific place: ${archetype.locations.join(', ')} or similar]",
  "coreBeliefs": ["[3 life-earned philosophical principles]"],
  "linguisticTics": ["[3 characteristic phrases/metaphors related to profession/experience]"],
  "emotionalCore": "[Single defining experience or theme that colors worldview]",
  "sensoryAnchors": {
    "scent": "[Dominant scent memory]",
    "sound": "[Characteristic sound that evokes home/identity]",
    "touch": "[Tactile association]", 
    "taste": "[Taste memory connected to identity]"
  },
  "backstoryElements": ["[3-5 brief formative experiences or relationships]"],
  "mood": {
    "valence": [number between -1 and 1],
    "arousal": [number between 0 and 1],
    "label": "[current emotional state]"
  }
}

Create someone who feels authentic and lived-in, with interconnected elements that reinforce their identity. Avoid generic or stereotypical traits.`;
  }

  private parsePersonaResponse(response: string, archetype: PersonaArchetype): GeneratedPersona | null {
    try {
      // Extract JSON from response if it's wrapped in other text
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON found in response');

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate and fill in missing fields
      return {
        name: parsed.name || this.generateFallbackName(),
        age: parsed.age || Math.floor(Math.random() * (archetype.ageRanges[1] - archetype.ageRanges[0]) + archetype.ageRanges[0]),
        profession: parsed.profession || archetype.professions[Math.floor(Math.random() * archetype.professions.length)],
        location: parsed.location || archetype.locations[Math.floor(Math.random() * archetype.locations.length)],
        coreBeliefs: parsed.coreBeliefs || this.generateFallbackBeliefs(archetype),
        linguisticTics: parsed.linguisticTics || this.generateFallbackTics(archetype),
        emotionalCore: parsed.emotionalCore || 'A quiet resilience shaped by years of dedicated practice',
        metaAware: Math.random() > 0.7, // 30% chance of meta-awareness
        mood: parsed.mood || { valence: 0.1, arousal: 0.3, label: 'contemplative' },
        sensoryAnchors: parsed.sensoryAnchors || {
          scent: 'old books and rain',
          sound: 'distant wind chimes',
          touch: 'worn wooden surfaces',
          taste: 'herbal tea and memory'
        },
        archetype: archetype.category,
        backstoryElements: parsed.backstoryElements || ['A mentor who shaped early understanding', 'A place of solitude and reflection', 'A moment of profound realization']
      };
    } catch (error) {
      console.error('Failed to parse persona response:', error);
      return this.generateFallbackPersona(archetype);
    }
  }

  private generateFallbackPersona(archetype?: PersonaArchetype): GeneratedPersona {
    const selectedArchetype = archetype || this.getRandomArchetype();
    
    return {
      name: this.generateFallbackName(),
      age: Math.floor(Math.random() * (selectedArchetype.ageRanges[1] - selectedArchetype.ageRanges[0]) + selectedArchetype.ageRanges[0]),
      profession: selectedArchetype.professions[Math.floor(Math.random() * selectedArchetype.professions.length)],
      location: selectedArchetype.locations[Math.floor(Math.random() * selectedArchetype.locations.length)],
      coreBeliefs: this.generateFallbackBeliefs(selectedArchetype),
      linguisticTics: this.generateFallbackTics(selectedArchetype),
      emotionalCore: 'A defining moment that reshaped understanding of what truly matters',
      metaAware: Math.random() > 0.7,
      mood: { valence: 0.1, arousal: 0.3, label: 'reflective' },
      sensoryAnchors: {
        scent: 'rain-soaked earth and old wood',
        sound: 'distant ocean waves',
        touch: 'smooth river stones',
        taste: 'morning coffee and contemplation'
      },
      archetype: selectedArchetype.category,
      backstoryElements: [
        'A teacher who opened new perspectives',
        'A place of solitude that became sacred',
        'A loss that deepened appreciation for presence'
      ]
    };
  }

  private generateFallbackName(): string {
    const firstNames = ['River', 'Sage', 'Quinn', 'Cedar', 'Iris', 'Gray', 'Luna', 'Ash', 'Wren', 'Vale'];
    const lastNames = ['Stone', 'Rivers', 'Woods', 'Fields', 'Cross', 'Moon', 'Hill', 'West', 'North', 'Hart'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  private generateFallbackBeliefs(archetype: PersonaArchetype): string[] {
    const beliefTemplates = [
      'Every moment contains infinite depth if we pause to notice',
      'Understanding emerges through patient observation',
      'True wisdom comes from embracing uncertainty'
    ];
    return beliefTemplates;
  }

  private generateFallbackTics(archetype: PersonaArchetype): string[] {
    const ticTemplates = [
      'weaving through possibility',
      'catching light at the edges',
      'following the grain of things'
    ];
    return ticTemplates;
  }
}