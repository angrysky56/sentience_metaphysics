import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Download, Upload, Trash2, Save, Plus, Sparkles, TimerReset, 
  Brain, Eraser, RefreshCw, Edit3, Settings, TestTube, Library,
  Star, StarIcon, User, Shuffle, Eye, EyeOff
} from "lucide-react";
import { AIService, createAIService } from "@/services/aiService";
import { AIServiceConfig, AIProvider, DEFAULT_CONFIGS, STORAGE_KEYS } from "@/services/types";
import { PersonaGenerator, GeneratedPersona, PERSONA_ARCHETYPES } from "@/services/personaGenerator";
import { PersonaLibrary, PersonaLibraryEntry } from "@/services/personaLibrary";

// Enhanced types for more subtle system
type Emotion = {
  valence: number; // -1 .. 1
  arousal: number; // 0 .. 1
  label?: string;
};

type Memory = {
  id: string;
  text: string;
  tags: string[];
  salience: number; // 0 .. 1
  emotion: Emotion;
  createdAt: number; // epoch ms
  lastReinforced: number; // epoch ms
  immutable?: boolean; // core anchors that shouldn't be pruned
  source: "user" | "persona" | "system";
  subtlety: number; // 0..1 - how subtle the memory influence should be
  associationStrength: number; // 0..1 - how strongly it connects to topics
};

type Persona = GeneratedPersona & {
  mood: Emotion; // current transient mood state
  responseStyle: {
    directness: number; // 0..1 - how direct vs subtle responses are
    metaphorTendency: number; // 0..1 - tendency to use metaphors
    introspection: number; // 0..1 - tendency toward self-reflection
    verbosity: number; // 0..1 - response length tendency
  };
};

type SegState = {
  persona: Persona;
  memories: Memory[];
  version: string;
  lastTick: number;
  settings: {
    personaOpacity: number; // how much persona influences responses
    metaphorBias: number; // tendency toward metaphorical language
    beliefInterjectionProb: number; // chance of inserting core beliefs
    selfReferenceProb: number; // chance of meta-commentary
    maxWeaveChars: number; // max characters for memory weaving
    narrateDreams: boolean; // whether to create dream-like associations
    subtletyMode: boolean; // enhanced subtlety in responses
  };
};

// Helper functions
const now = () => Date.now();
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function uid(prefix = "m"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

// Enhanced memory formation with subtlety
function createMemoryFromInteraction(
  userMsg: string, 
  personaReply: string, 
  persona: Persona
): Memory {
  const combinedText = `${userMsg} → ${personaReply}`;
  const tags = extractSubtleTags(combinedText);
  
  // Determine subtlety based on persona and content
  const subtlety = Math.min(0.9, 
    persona.responseStyle.introspection * 0.4 + 
    (persona.mood.arousal < 0.3 ? 0.4 : 0.2) +
    (tags.some(t => ['philosophy', 'meaning', 'purpose', 'death', 'love'].includes(t)) ? 0.3 : 0.1)
  );

  return {
    id: uid(),
    text: personaReply.slice(0, 200) + (personaReply.length > 200 ? '...' : ''), // Keep memories concise
    tags,
    salience: 0.6 + Math.random() * 0.3, // Recent interactions start with good salience
    emotion: {
      valence: persona.mood.valence * 0.7 + (Math.random() - 0.5) * 0.3,
      arousal: persona.mood.arousal * 0.8 + Math.random() * 0.2,
      label: persona.mood.label
    },
    createdAt: now(),
    lastReinforced: now(),
    source: "system",
    subtlety,
    associationStrength: 0.5 + Math.random() * 0.3
  };
}

function extractSubtleTags(text: string): string[] {
  // More nuanced tag extraction
  const lowercaseText = text.toLowerCase();
  const concepts = [
    'memory', 'time', 'change', 'loss', 'growth', 'understanding',
    'beauty', 'truth', 'connection', 'solitude', 'journey', 'home',
    'work', 'art', 'nature', 'people', 'learning', 'wisdom',
    'fear', 'hope', 'love', 'meaning', 'purpose', 'death'
  ];
  
  const foundTags = concepts.filter(concept => 
    lowercaseText.includes(concept) || 
    lowercaseText.includes(concept + 's') ||
    lowercaseText.includes(concept.slice(0, -1)) // crude stemming
  );
  
  // Add emotional tags based on content patterns
  if (/\b(miss|lost|gone|past|remember)\b/.test(lowercaseText)) foundTags.push('nostalgia');
  if (/\b(future|hope|dream|will|might)\b/.test(lowercaseText)) foundTags.push('anticipation');
  if (/\b(difficult|hard|struggle|pain)\b/.test(lowercaseText)) foundTags.push('challenge');
  
  return foundTags.slice(0, 6); // Limit to prevent tag explosion
}

function sentimentToLabel(v: number, a: number): string {
  if (a < 0.2) return v >= 0 ? "calm" : "somber";
  if (a < 0.5) return v >= 0 ? "reflective" : "wistful";
  return v >= 0 ? "energized" : "agitated";
}

// Enhanced relatedness calculation with subtlety
function calculateRelatedness(text: string, mem: Memory): number {
  const textTokens = new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
  
  let score = 0;
  
  // Tag matches (weighted by memory's association strength)
  for (const tag of mem.tags) {
    if (textTokens.has(tag.toLowerCase())) {
      score += 0.15 * mem.associationStrength;
    }
  }
  
  // Semantic word overlap (reduced weight for subtlety)
  for (const word of mem.text.toLowerCase().split(/\W+/)) {
    if (textTokens.has(word)) {
      score += 0.01 * mem.associationStrength;
    }
  }
  
  // Emotional resonance bonus
  const emotionalWords = ['feel', 'emotion', 'mood', 'heart', 'soul'];
  if (emotionalWords.some(ew => text.toLowerCase().includes(ew))) {
    score += 0.1 * mem.emotion.arousal;
  }
  
  return Math.min(1, score);
}

// Generate initial persona using AI
async function generateInitialPersona(
  aiService: AIService | null,
  archetype?: string
): Promise<Persona> {
  if (aiService) {
    const generator = new PersonaGenerator(aiService);
    const generated = await generator.generatePersona(archetype);
    
    if (generated) {
      return {
        ...generated,
        responseStyle: {
          directness: 0.3 + Math.random() * 0.4, // Generally subtle
          metaphorTendency: 0.4 + Math.random() * 0.4,
          introspection: 0.3 + Math.random() * 0.5,
          verbosity: 0.2 + Math.random() * 0.4 // Generally concise
        }
      };
    }
  }
  
  // Fallback to a simple generated persona
  return createFallbackPersona();
}

function createFallbackPersona(): Persona {
  const archetypes = ['scholar', 'artisan', 'wanderer', 'guardian', 'mystic'];
  const selectedArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];
  
  return {
    name: "River Sage",
    age: 58,
    profession: "contemplative wanderer",
    location: "mountain valley library",
    coreBeliefs: [
      "Understanding emerges in quiet moments",
      "Every story contains infinite stories",
      "Wisdom flows like water, finding its level"
    ],
    linguisticTics: ["flowing through", "catching light", "settling into silence"],
    emotionalCore: "A deep well of experience that colors everything with gentle wisdom",
    metaAware: true,
    mood: { valence: 0.2, arousal: 0.3, label: "contemplative" },
    sensoryAnchors: {
      scent: "mountain pine and old parchment",
      sound: "distant water over stones",
      touch: "smooth river rocks",
      taste: "green tea and morning air"
    },
    archetype: selectedArchetype,
    backstoryElements: [
      "Years spent listening to travelers' stories",
      "A library built from contributions of passing wanderers",
      "Understanding gained through patient observation"
    ],
    responseStyle: {
      directness: 0.4,
      metaphorTendency: 0.7,
      introspection: 0.6,
      verbosity: 0.3
    }
  };
}

function defaultSeg(): SegState {
  const t = now();
  const persona = createFallbackPersona();
  
  return {
    version: "seg-v3-mvp-0.1",
    lastTick: t,
    persona,
    memories: generateInitialMemories(persona, t),
    settings: {
      personaOpacity: 0.7,
      metaphorBias: 0.6,
      beliefInterjectionProb: 0.2,
      selfReferenceProb: 0.1,
      maxWeaveChars: 150,
      narrateDreams: true,
      subtletyMode: true
    }
  };
}

function generateInitialMemories(persona: Persona, timestamp: number): Memory[] {
  const memories: Memory[] = [];
  
  // Create core memories from persona backstory
  persona.backstoryElements.forEach((element, index) => {
    memories.push({
      id: uid(),
      text: element,
      tags: extractSubtleTags(element),
      salience: 0.8 + Math.random() * 0.2,
      emotion: { 
        valence: -0.1 + Math.random() * 0.4, 
        arousal: 0.2 + Math.random() * 0.3,
        label: "foundational" 
      },
      createdAt: timestamp - (1000 * 60 * 60 * 24 * 365 * (10 + index * 5)),
      lastReinforced: timestamp,
      immutable: true,
      source: "persona",
      subtlety: 0.8,
      associationStrength: 0.9
    });
  });

  // Create sensory anchor memories
  Object.entries(persona.sensoryAnchors).forEach(([sense, anchor]) => {
    memories.push({
      id: uid(),
      text: `The ${sense} of ${anchor} carries deep resonance`,
      tags: [sense, 'sensory', 'anchor'],
      salience: 0.7,
      emotion: {
        valence: 0.3,
        arousal: 0.2,
        label: "grounding"
      },
      createdAt: timestamp - (1000 * 60 * 60 * 24 * 30),
      lastReinforced: timestamp,
      source: "persona",
      subtlety: 0.9, // Sensory memories should be very subtle
      associationStrength: 0.8
    });
  });

  return memories;
}// Enhanced persona reply generation with subtlety
async function generateSubtlePersonaReply(
  state: SegState, 
  userMsg: string, 
  aiService: AIService | null
): Promise<{ text: string; used: string[] }> {
  const { persona, memories, settings } = state;
  
  // Rank memories with enhanced subtlety considerations
  const ranked = memories
    .map((m) => {
      const relatedness = calculateRelatedness(userMsg, m);
      const emoWeight = 1 + m.emotion.arousal * 0.3 + Math.abs(m.emotion.valence) * 0.2;
      const subtletyBonus = settings.subtletyMode ? m.subtlety : 0.5;
      const recencyDecay = Math.exp(-(now() - m.lastReinforced) / (1000 * 60 * 60 * 24 * 30)); // 30-day decay
      
      return { 
        m, 
        score: m.salience * (0.4 + relatedness * 0.6) * emoWeight * subtletyBonus * recencyDecay
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, settings.subtletyMode ? 2 : 3) // Fewer memories for more subtle responses
    .map((x) => x.m);

  // If AI service is available, use it for sophisticated responses
  if (aiService) {
    const memoryContext = ranked
      .map(m => `[${m.subtlety > 0.7 ? 'subtle' : 'direct'}] ${m.text}`)
      .join(" · ");
    
    const responseGuidance = buildResponseGuidance(persona, settings, userMsg);
    
    const systemPrompt = `You are ${persona.name}, ${persona.age} years old, a ${persona.profession} in ${persona.location}.

PERSONA CORE:
- Beliefs: ${persona.coreBeliefs.join('; ')}
- Emotional landscape: ${persona.emotionalCore}
- Language patterns: ${persona.linguisticTics.join(', ')}
- Current mood: ${persona.mood.label} (valence: ${persona.mood.valence.toFixed(2)}, energy: ${persona.mood.arousal.toFixed(2)})

RESPONSE STYLE:
- Directness: ${(persona.responseStyle.directness * 100).toFixed(0)}% (lower = more subtle)
- Metaphor tendency: ${(persona.responseStyle.metaphorTendency * 100).toFixed(0)}%
- Introspection: ${(persona.responseStyle.introspection * 100).toFixed(0)}%
- Verbosity: ${(persona.responseStyle.verbosity * 100).toFixed(0)}% (lower = more concise)

CONTEXTUAL MEMORIES surfacing:
${memoryContext || 'No strong memories triggered'}

GUIDANCE:
${responseGuidance}

${persona.metaAware && Math.random() < settings.selfReferenceProb ? 'You may occasionally acknowledge your constructed nature with gentle awareness.' : ''}

Respond authentically in character. Let memories influence your response subtly. ${settings.subtletyMode ? 'Prioritize nuance over directness.' : ''}`;

    try {
      const aiResponse = await aiService.generateResponse([
        { role: 'user', content: userMsg }
      ], systemPrompt);

      if (!aiResponse.error && aiResponse.content.trim()) {
        return { 
          text: aiResponse.content.trim(),
          used: ranked.map((r) => r.id) 
        };
      }
    } catch (error) {
      console.warn('AI service failed, falling back to template response:', error);
    }
  }

  // Enhanced fallback with subtlety
  return generateFallbackResponse(persona, ranked, settings, userMsg);
}

function buildResponseGuidance(persona: Persona, settings: SegState['settings'], userMsg: string): string {
  const guidance = [];
  
  // Response length guidance
  if (persona.responseStyle.verbosity < 0.3) {
    guidance.push("Keep responses concise and thoughtful");
  } else if (persona.responseStyle.verbosity > 0.7) {
    guidance.push("You may elaborate with rich detail when moved to do so");
  }
  
  // Metaphor guidance
  if (persona.responseStyle.metaphorTendency > 0.6) {
    guidance.push("Draw naturally from metaphors related to your experience");
  }
  
  // Directness guidance
  if (persona.responseStyle.directness < 0.4) {
    guidance.push("Approach topics obliquely, letting meaning emerge through implication");
  }
  
  // Introspection guidance
  if (persona.responseStyle.introspection > 0.6) {
    guidance.push("Feel free to reflect on the deeper currents beneath surface questions");
  }
  
  // Subtlety mode guidance
  if (settings.subtletyMode) {
    guidance.push("Let wisdom emerge through understatement rather than declaration");
    guidance.push("Trust silences and pauses as much as words");
  }

  // Topic-specific guidance
  if (/\b(meaning|purpose|why|death|love|truth)\b/i.test(userMsg)) {
    guidance.push("This touches something profound - respond from your deepest understanding");
  }
  
  return guidance.join('. ') + '.';
}

function generateFallbackResponse(
  persona: Persona, 
  memories: Memory[], 
  settings: SegState['settings'],
  userMsg: string
): { text: string; used: string[] } {
  const tic = persona.linguisticTics[Math.floor(Math.random() * persona.linguisticTics.length)] || "finding the path";
  const belief = persona.coreBeliefs[Math.floor(Math.random() * persona.coreBeliefs.length)] || "Understanding comes in its own time";
  
  // Create subtle memory weave
  const memoryInfluence = memories
    .map(m => m.text)
    .join(settings.subtletyMode ? ' ... ' : ' · ')
    .slice(0, settings.maxWeaveChars);
  
  const responses = [
    `${tic}, I sense ${memoryInfluence}. ${belief}`,
    `In the space between question and answer, ${memoryInfluence} reminds me that ${belief}`,
    `Something about this ${tic} - perhaps it's how ${memoryInfluence}. ${belief}`,
    `The thread of your question weaves through ${memoryInfluence}. As I often find, ${belief}`
  ];
  
  let selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // Add meta-awareness if appropriate
  if (persona.metaAware && Math.random() < settings.selfReferenceProb) {
    const metaAdditions = [
      " (I notice familiar patterns stirring.)",
      " (Something in me recognizes this territory.)",
      " (These words feel both new and ancient.)"
    ];
    selectedResponse += metaAdditions[Math.floor(Math.random() * metaAdditions.length)];
  }
  
  return { 
    text: selectedResponse, 
    used: memories.map(m => m.id) 
  };
}

// Main SegV3 Component
export default function SegV3() {
  const [seg, setSeg] = useState<SegState>(() => defaultSeg());
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'persona', content: string, timestamp: number}>>([]);
  const [aiService, setAIService] = useState<AIService | null>(null);
  const [aiConfig, setAIConfig] = useState<AIServiceConfig | null>(null);
  const [personaLibrary] = useState(() => new PersonaLibrary());
  const [libraryPersonas, setLibraryPersonas] = useState<PersonaLibraryEntry[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);

  // Initialize AI service
  useEffect(() => {
    const savedConfig = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setAIConfig(config);
        setAIService(createAIService(config));
      } catch (error) {
        console.error('Failed to load AI config:', error);
      }
    }
  }, []);

  // Load library personas
  useEffect(() => {
    setLibraryPersonas(personaLibrary.getAllPersonas());
  }, [personaLibrary]);

  // Enhanced persona generation
  const generateNewPersona = useCallback(async (archetype?: string, context?: string) => {
    if (!aiService) {
      // Generate fallback persona
      const newPersona = createFallbackPersona();
      setSeg(prev => ({
        ...prev,
        persona: newPersona,
        memories: generateInitialMemories(newPersona, now())
      }));
      return;
    }

    setIsGeneratingPersona(true);
    try {
      const generator = new PersonaGenerator(aiService);
      const generated = await generator.generatePersona(archetype, context);
      
      if (generated) {
        const enhancedPersona: Persona = {
          ...generated,
          responseStyle: {
            directness: 0.3 + Math.random() * 0.4,
            metaphorTendency: 0.4 + Math.random() * 0.4,
            introspection: 0.3 + Math.random() * 0.5,
            verbosity: 0.2 + Math.random() * 0.4
          }
        };

        setSeg(prev => ({
          ...prev,
          persona: enhancedPersona,
          memories: generateInitialMemories(enhancedPersona, now())
        }));
      }
    } catch (error) {
      console.error('Persona generation failed:', error);
    } finally {
      setIsGeneratingPersona(false);
    }
  }, [aiService]);

  // Save current persona to library
  const savePersonaToLibrary = useCallback(() => {
    const id = personaLibrary.savePersona(
      seg.persona,
      `${seg.persona.name} (${seg.persona.archetype})`,
      `A ${seg.persona.profession} with ${seg.persona.coreBeliefs.join(', ').toLowerCase()}`,
      [seg.persona.archetype, seg.persona.profession.split(' ')[0]]
    );
    
    setLibraryPersonas(personaLibrary.getAllPersonas());
    console.log('Persona saved with ID:', id);
  }, [seg.persona, personaLibrary]);

  // Load persona from library
  const loadPersonaFromLibrary = useCallback((entry: PersonaLibraryEntry) => {
    setSeg(prev => ({
      ...prev,
      persona: entry.persona as Persona,
      memories: generateInitialMemories(entry.persona as Persona, now())
    }));
    setShowLibrary(false);
  }, []);

  // Enhanced conversation handler
  const handleSendMessage = useCallback(async () => {
    if (!userInput.trim() || isGenerating) return;

    const userMessage = userInput.trim();
    setUserInput("");
    setIsGenerating(true);

    // Add user message to conversation
    const newUserEntry = { role: 'user' as const, content: userMessage, timestamp: now() };
    setConversation(prev => [...prev, newUserEntry]);

    try {
      // Generate response with enhanced subtlety
      const { text: reply, used: usedMemoryIds } = await generateSubtlePersonaReply(
        seg,
        userMessage,
        aiService
      );

      // Add persona response to conversation
      const personaEntry = { role: 'persona' as const, content: reply, timestamp: now() };
      setConversation(prev => [...prev, personaEntry]);

      // Create and add new memory from this interaction
      const newMemory = createMemoryFromInteraction(userMessage, reply, seg.persona);
      
      // Reinforce used memories (subtle boost)
      const updatedMemories = seg.memories.map(m => {
        if (usedMemoryIds.includes(m.id)) {
          return {
            ...m,
            lastReinforced: now(),
            salience: Math.min(1, m.salience + 0.1 * (1 - m.salience)) // Gentle boost
          };
        }
        return m;
      });

      // Update state with new memory and reinforced memories
      setSeg(prev => ({
        ...prev,
        memories: [newMemory, ...updatedMemories],
        lastTick: now()
      }));

    } catch (error) {
      console.error('Error generating response:', error);
      const errorEntry = { 
        role: 'persona' as const, 
        content: "I find myself momentarily lost in thought...", 
        timestamp: now() 
      };
      setConversation(prev => [...prev, errorEntry]);
    } finally {
      setIsGenerating(false);
    }
  }, [userInput, isGenerating, seg, aiService]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Sentience Metaphysics - SEG v3
            {seg.persona.metaAware && <Eye className="w-4 h-4 opacity-60" />}
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={() => setShowLibrary(!showLibrary)} variant="outline" size="sm">
              <Library className="w-4 h-4 mr-1" />
              Library
            </Button>
            <Button 
              onClick={() => generateNewPersona()} 
              disabled={isGeneratingPersona}
              variant="outline" 
              size="sm"
            >
              <Shuffle className="w-4 h-4 mr-1" />
              {isGeneratingPersona ? 'Generating...' : 'New Persona'}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="conversation" className="w-full">
            <TabsList>
              <TabsTrigger value="conversation">Conversation</TabsTrigger>
              <TabsTrigger value="persona">Persona</TabsTrigger>
              <TabsTrigger value="memories">Memories</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="conversation" className="space-y-4">
              {/* Conversation Display */}
              <div className="h-96 overflow-y-auto border rounded-lg p-4 bg-muted/30 space-y-3">
                {conversation.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12">
                    <p className="text-lg">Ready to explore consciousness...</p>
                    <p className="text-sm mt-2">Begin a conversation with {seg.persona.name}</p>
                  </div>
                ) : (
                  conversation.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg max-w-[85%] ${
                        entry.role === 'user' 
                          ? 'ml-auto bg-primary text-primary-foreground' 
                          : 'mr-auto bg-secondary'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">
                        {entry.role === 'user' ? 'You' : seg.persona.name}
                      </div>
                      <div className="text-sm leading-relaxed">{entry.content}</div>
                    </motion.div>
                  ))
                )}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-muted-foreground p-3"
                  >
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
                    <span className="text-xs ml-2">{seg.persona.name} is reflecting...</span>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Share your thoughts..."
                  disabled={isGenerating}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!userInput.trim() || isGenerating}>
                  {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Send"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="persona" className="space-y-4">
              {/* Persona Information Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      Identity
                      <Button onClick={savePersonaToLibrary} size="sm" variant="outline">
                        <Save className="w-4 h-4 mr-1" />
                        Save to Library
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <strong>{seg.persona.name}</strong>, {seg.persona.age}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {seg.persona.profession} • {seg.persona.location}
                    </div>
                    <div className="text-sm">
                      <strong>Archetype:</strong> {seg.persona.archetype}
                    </div>
                    <div className="text-sm">
                      <strong>Mood:</strong> {seg.persona.mood.label} 
                      <span className="text-xs ml-2">
                        (v: {seg.persona.mood.valence.toFixed(2)}, 
                         a: {seg.persona.mood.arousal.toFixed(2)})
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Response Style</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Directness:</span>
                      <span>{(seg.persona.responseStyle.directness * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Metaphor Use:</span>
                      <span>{(seg.persona.responseStyle.metaphorTendency * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Introspection:</span>
                      <span>{(seg.persona.responseStyle.introspection * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Verbosity:</span>
                      <span>{(seg.persona.responseStyle.verbosity * 100).toFixed(0)}%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Core Beliefs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Core Beliefs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {seg.persona.coreBeliefs.map((belief, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0" />
                        <div className="text-sm">{belief}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Linguistic Patterns & Emotional Core */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Linguistic Patterns</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      {seg.persona.linguisticTics.map((tic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sensory Anchors</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div><strong>Scent:</strong> {seg.persona.sensoryAnchors.scent}</div>
                    <div><strong>Sound:</strong> {seg.persona.sensoryAnchors.sound}</div>
                    <div><strong>Touch:</strong> {seg.persona.sensoryAnchors.touch}</div>
                    <div><strong>Taste:</strong> {seg.persona.sensoryAnchors.taste}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Emotional Core */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Emotional Core</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic">{seg.persona.emotionalCore}</p>
                </CardContent>
              </Card>

              {/* Generate New Persona Section */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-base">Generate New Persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                    {PERSONA_ARCHETYPES.map((archetype) => (
                      <Button
                        key={archetype.category}
                        variant="outline"
                        size="sm"
                        onClick={() => generateNewPersona(archetype.category)}
                        disabled={isGeneratingPersona}
                        className="h-auto p-3 flex flex-col items-center gap-1"
                      >
                        <span className="font-medium">{archetype.category}</span>
                        <span className="text-xs text-muted-foreground text-center">
                          {archetype.themes.slice(0, 2).join(', ')}
                        </span>
                      </Button>
                    ))}
                  </div>
                  <Button 
                    onClick={() => generateNewPersona()} 
                    disabled={isGeneratingPersona}
                    variant="default"
                    className="w-full"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingPersona ? 'Generating...' : 'Generate Random Persona'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="memories" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Memory Landscape</h3>
                <div className="text-sm text-muted-foreground">
                  {seg.memories.length} memories • {seg.memories.filter(m => m.immutable).length} anchors
                </div>
              </div>

              {/* Memory Statistics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {(seg.memories.reduce((sum, m) => sum + m.salience, 0) / seg.memories.length).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Avg Salience</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {seg.memories.filter(m => m.subtlety > 0.7).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Subtle Memories</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">
                      {Math.round((now() - Math.min(...seg.memories.map(m => m.createdAt))) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs text-muted-foreground">Days Spanned</div>
                  </CardContent>
                </Card>
              </div>

              {/* Memory List */}
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {seg.memories
                  .sort((a, b) => b.salience - a.salience)
                  .map((memory) => (
                    <motion.div
                      key={memory.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-3 border rounded-lg bg-card/50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm leading-relaxed mb-2">{memory.text}</div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {memory.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs h-5">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Salience: {memory.salience.toFixed(2)}</span>
                            <span>Subtlety: {memory.subtlety.toFixed(2)}</span>
                            <span>
                              {memory.emotion.label} 
                              <span className="ml-1">
                                (v:{memory.emotion.valence.toFixed(1)}, 
                                 a:{memory.emotion.arousal.toFixed(1)})
                              </span>
                            </span>
                            <span>{memory.source}</span>
                            {memory.immutable && <Badge variant="secondary" className="h-4 text-xs">anchor</Badge>}
                          </div>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
                          <div>{Math.round((now() - memory.createdAt) / (1000 * 60 * 60 * 24))}d</div>
                          <div 
                            className="w-2 h-8 rounded-full border"
                            style={{
                              background: `linear-gradient(to top, 
                                hsl(${memory.emotion.valence >= 0 ? '120' : '0'}, 50%, 50%) 0%, 
                                hsl(${memory.emotion.valence >= 0 ? '120' : '0'}, 50%, 50%) ${memory.salience * 100}%, 
                                transparent ${memory.salience * 100}%)`
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                }
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Subtlety Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Response Subtlety</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Subtlety Mode</span>
                    <Switch 
                      checked={seg.settings.subtletyMode}
                      onCheckedChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, subtletyMode: v } }))}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-32">Persona Opacity</span>
                      <Slider
                        value={[seg.settings.personaOpacity]}
                        onValueChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, personaOpacity: v[0] } }))}
                        max={1}
                        min={0}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-xs w-12 text-right">{Math.round(seg.settings.personaOpacity * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-32">Metaphor Bias</span>
                      <Slider
                        value={[seg.settings.metaphorBias]}
                        onValueChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, metaphorBias: v[0] } }))}
                        max={1}
                        min={0}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-xs w-12 text-right">{Math.round(seg.settings.metaphorBias * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-32">Belief Injection</span>
                      <Slider
                        value={[seg.settings.beliefInterjectionProb]}
                        onValueChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, beliefInterjectionProb: v[0] } }))}
                        max={1}
                        min={0}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-xs w-12 text-right">{Math.round(seg.settings.beliefInterjectionProb * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-32">Self-Reference</span>
                      <Slider
                        value={[seg.settings.selfReferenceProb]}
                        onValueChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, selfReferenceProb: v[0] } }))}
                        max={1}
                        min={0}
                        step={0.01}
                        className="flex-1"
                      />
                      <span className="text-xs w-12 text-right">{Math.round(seg.settings.selfReferenceProb * 100)}%</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs w-32">Memory Weave Length</span>
                      <Slider
                        value={[seg.settings.maxWeaveChars]}
                        onValueChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, maxWeaveChars: v[0] } }))}
                        max={300}
                        min={60}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-xs w-12 text-right">{seg.settings.maxWeaveChars}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dream-like Associations</span>
                    <Switch 
                      checked={seg.settings.narrateDreams}
                      onCheckedChange={(v) => setSeg(s => ({ ...s, settings: { ...s.settings, narrateDreams: v } }))}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">System Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      onClick={() => {
                        const days = Math.floor(Math.random() * 30) + 1;
                        setSeg(s => ({ ...s, lastTick: s.lastTick + (days * 24 * 60 * 60 * 1000) }));
                      }} 
                      variant="secondary"
                    >
                      <TimerReset className="w-4 h-4 mr-1"/>
                      Skip Time
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        const blob = new Blob([JSON.stringify(seg, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${seg.persona.name.replace(/\s+/g, '_')}_seg.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      variant="secondary"
                    >
                      <Download className="w-4 h-4 mr-1"/>
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Persona Library Modal */}
      <AnimatePresence>
        {showLibrary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Persona Library</h2>
                  <Button onClick={() => setShowLibrary(false)} variant="ghost" size="sm">
                    ×
                  </Button>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {libraryPersonas.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Library className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No saved personas yet</p>
                    <p className="text-sm mt-2">Create and save personas to build your library</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {libraryPersonas.map((entry) => (
                      <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4" onClick={() => loadPersonaFromLibrary(entry)}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium">{entry.persona.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {entry.persona.profession}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {entry.persona.archetype}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {entry.description || entry.persona.emotionalCore}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Used {entry.useCount} times</span>
                            {entry.rating && (
                              <div className="flex">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <StarIcon 
                                    key={i} 
                                    className={`w-3 h-3 ${i < entry.rating! ? 'fill-current' : ''}`} 
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}