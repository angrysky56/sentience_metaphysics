import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Brain, Eraser, RefreshCw, Edit3, Settings, TestTube 
} from "lucide-react";
import { AIService, createAIService } from "@/services/aiService";
import { AIServiceConfig, AIProvider, DEFAULT_CONFIGS, STORAGE_KEYS } from "@/services/types";

// Types
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
};

type Persona = {
  name: string;
  age: number;
  profession: string;
  location: string;
  coreBeliefs: string[]; // stable spine
  linguisticTics: string[];
  emotionalCore: string; // defining event/theme
  metaAware: boolean;
  mood: Emotion; // transient mood state
};

type SegState = {
  persona: Persona;
  memories: Memory[];
  version: string;
  lastTick: number;
};
// Helper functions
const now = () => Date.now();
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function uid(prefix = "m"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
}

function defaultSeg(): SegState {
  const t = now();
  return {
    version: "seg-v2-mvp-0.1",
    lastTick: t,
    persona: {
      name: "Elara Vance",
      age: 72,
      profession: "Retired cartographer & archivist",
      location: "Pacific Northwest coastal town",
      coreBeliefs: [
        "The map is never the territory.",
        "Truth is found in the details.",
        "We get lost to find the best moments.",
      ],
      linguisticTics: ["true north", "shoreline of memory", "vellum and fog"],
      emotionalCore:
        "Loss of partner Ben during a river mapping expedition; grief turned to quiet compass.",
      metaAware: true,
      mood: { valence: 0.2, arousal: 0.3, label: "reflective" },
    },
    memories: [
      {
        id: uid(),
        text: "Ben's laughter echoing over rain-swollen water; the map smeared, the heart learning new contours.",
        tags: ["ben", "river", "loss", "map"],
        salience: 0.92,
        emotion: { valence: -0.2, arousal: 0.6, label: "bittersweet" },
        createdAt: t - 1000 * 60 * 60 * 24 * 365 * 20,
        lastReinforced: t,
        immutable: true,
        source: "persona",
      },
      {
        id: uid(),
        text: "Smell of bookbinding glue mingled with damp earth after rain.",
        tags: ["scent", "books", "rain"],
        salience: 0.74,
        emotion: { valence: 0.3, arousal: 0.2, label: "nostalgic" },
        createdAt: t - 1000 * 60 * 60 * 24 * 365 * 40,
        lastReinforced: t - 1000 * 60 * 60 * 24 * 10,
        source: "persona",
      },
      {
        id: uid(),
        text: "User asked about courage; answered with a coastline that only appears at low tide.",
        tags: ["user", "courage", "coastline", "metaphor"],
        salience: 0.5,
        emotion: { valence: 0.4, arousal: 0.5, label: "encouraged" },
        createdAt: t - 1000 * 60 * 60 * 2,
        lastReinforced: t - 1000 * 60 * 60 * 2,
        source: "system",
      },
    ],
  };
}

function sentimentToLabel(v: number, a: number): string {
  if (a < 0.2) return v >= 0 ? "calm" : "somber";
  if (a < 0.5) return v >= 0 ? "reflective" : "wistful";
  return v >= 0 ? "energized" : "agitated";
}

function approximateRelatedness(text: string, mem: Memory): number {
  // quick & dirty token overlap
  const toks = new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
  );
  let score = 0;
  for (const tag of mem.tags) if (toks.has(tag.toLowerCase())) score += 0.15;
  for (const word of mem.text.toLowerCase().split(/\W+/)) if (toks.has(word)) score += 0.02;
  return Math.min(1, score);
}

// Enhanced persona reply generation using AI service
async function generatePersonaReply(
  state: SegState, 
  userMsg: string, 
  aiService: AIService | null
): Promise<{ text: string; used: string[] }> {
  const { persona, memories } = state;
  
  // rank memories by combined salience * relatedness * emotion weight
  const ranked = memories
    .map((m) => {
      const rel = approximateRelatedness(userMsg, m);
      const emoWeight = 1 + m.emotion.arousal * 0.4 + m.emotion.valence * 0.1;
      return { m, score: m.salience * (0.6 + rel) * emoWeight };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.m);

  // If AI service is available, use it for more sophisticated responses
  if (aiService) {
    const memoryContext = ranked.map(m => m.text).join(" · ");
    const systemPrompt = `You are ${persona.name}, a ${persona.age}-year-old ${persona.profession} living in ${persona.location}.
    
Your core beliefs: ${persona.coreBeliefs.join("; ")}
Your emotional core: ${persona.emotionalCore}
Your linguistic style includes these phrases: ${persona.linguisticTics.join(", ")}
Current mood: ${persona.mood.label} (valence: ${persona.mood.valence}, arousal: ${persona.mood.arousal})
${persona.metaAware ? "You are aware of your constructed nature as a narrative entity." : ""}

Relevant memories that surface: ${memoryContext}

Respond in character, weaving in the relevant memories naturally. Keep responses thoughtful but not overly long.`;

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

  // Fallback to original template-based response
  const tic = persona.linguisticTics[Math.floor(Math.random() * persona.linguisticTics.length)] || "true north";
  const belief = persona.coreBeliefs[Math.floor(Math.random() * persona.coreBeliefs.length)] || "The map is never the territory.";
  const weave = ranked.map((m) => m.text).join(" · ");
  const meta = persona.metaAware ? " (I notice I'm drawing from familiar shorelines of memory.)" : "";

  const reply = `If I trace this with my ${tic}, a few landmarks surface: ${weave}. ${belief}${meta}`;
  return { text: reply, used: ranked.map((r) => r.id) };
}
