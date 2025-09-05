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
import { Download, Upload, Trash2, Save, Plus, Sparkles, TimerReset, Brain, Eraser, RefreshCw, Edit3 } from "lucide-react";

// -----------------------------
// Types
// -----------------------------

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

// -----------------------------
// Helpers
// -----------------------------

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
        text: "Ben’s laughter echoing over rain-swollen water; the map smeared, the heart learning new contours.",
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

function generatePersonaReply(state: SegState, userMsg: string): { text: string; used: string[] } {
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

  const tic = persona.linguisticTics[Math.floor(Math.random() * persona.linguisticTics.length)] || "true north";
  const belief = persona.coreBeliefs[Math.floor(Math.random() * persona.coreBeliefs.length)] || "The map is never the territory.";

  const weave = ranked.map((m) => m.text).join(" · ");
  const meta = persona.metaAware ? " (I notice I’m drawing from familiar shorelines of memory.)" : "";

  const reply = `If I trace this with my ${tic}, a few landmarks surface: ${weave}. ${belief}${meta}`;
  return { text: reply, used: ranked.map((r) => r.id) };
}

function decayMemories(memories: Memory[], msElapsed: number): Memory[] {
  // exponential-like decay depending on time since last reinforcement
  const days = msElapsed / (1000 * 60 * 60 * 24);
  return memories.map((m) => {
    const ageDays = (now() - m.lastReinforced) / (1000 * 60 * 60 * 24);
    const decayRate = m.immutable ? 0.001 : 0.02; // slower for core
    const decay = Math.exp(-decayRate * (ageDays + days)) * m.salience;
    const newSalience = clamp01(0.15 + decay); // floor to avoid vanishing
    return { ...m, salience: newSalience };
  });
}

function reinforceMemory(m: Memory, amount = 0.1): Memory {
  const s = clamp01(m.salience + amount);
  return { ...m, salience: s, lastReinforced: now() };
}

function dream(state: SegState, intensity = 0.6): Memory {
  // pick a few salient memories and recombine
  const pool = [...state.memories].sort((a, b) => b.salience - a.salience).slice(0, 5);
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  const a = pick();
  const b = pick();
  const c = pick();
  const text = `${a.text.split(".")[0].trim()}, braided with ${b.text.toLowerCase()} — and then ${c.text.toLowerCase()} like a coastline redrawn.`;
  const tags = Array.from(new Set([...a.tags, ...b.tags, ...c.tags, "dream"]))
    .slice(0, 6);
  return {
    id: uid("d"),
    text,
    tags,
    salience: clamp01((a.salience + b.salience + c.salience) / 3 * (0.7 + intensity * 0.3)),
    emotion: { valence: (a.emotion.valence + b.emotion.valence) / 2, arousal: 0.6, label: "dreamt" },
    createdAt: now(),
    lastReinforced: now(),
    source: "persona",
  };
}

function exportState(state: SegState) {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seg-state-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// -----------------------------
// UI Components
// -----------------------------

function SalienceBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
      <div className="h-2 rounded-full" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

function MemoryRow({ m, onReinforce, onPrune, onPin, onEdit }: {
  m: Memory;
  onReinforce: () => void;
  onPrune: () => void;
  onPin: () => void;
  onEdit: () => void;
}) {
  return (
    <Card className="mb-2">
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <Badge variant="secondary">{m.source}</Badge>
          {m.immutable && <Badge>core</Badge>}
          <div className="text-xs opacity-60 ml-auto">{new Date(m.createdAt).toLocaleString()}</div>
        </div>
        <div className="text-sm leading-relaxed">{m.text}</div>
        <div className="flex flex-wrap gap-1">
          {m.tags.map((t) => (
            <Badge key={t} variant="outline">#{t}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs opacity-60">salience</span>
          <SalienceBar value={m.salience} />
          <span className="text-xs opacity-60">{Math.round(m.salience * 100)}</span>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="secondary" onClick={onEdit}><Edit3 className="w-4 h-4 mr-1"/>Edit</Button>
            <Button size="sm" onClick={onReinforce}><Save className="w-4 h-4 mr-1"/>Reinforce</Button>
            <Button size="sm" variant="outline" onClick={onPin}><Brain className="w-4 h-4 mr-1"/>{m.immutable ? "Unpin" : "Pin Core"}</Button>
            <Button size="sm" variant="destructive" onClick={onPrune}><Trash2 className="w-4 h-4 mr-1"/>Prune</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SegMvp() {
  const [seg, setSeg] = useState<SegState>(() => {
    const saved = localStorage.getItem("seg_mvp_state");
    return saved ? JSON.parse(saved) : defaultSeg();
  });
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "persona"; text: string }[]>([]);
  const [tab, setTab] = useState("chat");
  const [filter, setFilter] = useState("");
  const [dreamIntensity, setDreamIntensity] = useState([60]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("seg_mvp_state", JSON.stringify(seg));
  }, [seg]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat]);

  const filteredMemories = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const arr = [...seg.memories].sort((a, b) => b.salience - a.salience);
    if (!q) return arr;
    return arr.filter((m) =>
      m.text.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [seg.memories, filter]);

  const handleSend = () => {
    const msg = userInput.trim();
    if (!msg) return;
    setChat((c) => [...c, { role: "user", text: msg }]);

    // write user message into memory (low salience, user source)
    const newMem: Memory = {
      id: uid(),
      text: `User said: ${msg}`,
      tags: msg
        .toLowerCase()
        .split(/\W+/)
        .filter(Boolean)
        .slice(0, 6),
      salience: 0.35,
      emotion: { valence: 0, arousal: 0.4, label: "noted" },
      createdAt: now(),
      lastReinforced: now(),
      source: "user",
    };

    const interim = { ...seg, memories: [newMem, ...seg.memories] };
    const reply = generatePersonaReply(interim, msg);

    // reinforce used memories
    const updated = interim.memories.map((m) =>
      reply.used.includes(m.id) ? reinforceMemory(m, 0.08) : m
    );

    setSeg((s) => ({ ...s, memories: updated }));
    setUserInput("");

    // persona chat output
    setTimeout(() => {
      setChat((c) => [...c, { role: "persona", text: reply.text }]);
    }, 150);
  };

  const tickTime = (days = 1) => {
    const ms = days * 24 * 60 * 60 * 1000;
    setSeg((s) => ({
      ...s,
      lastTick: now(),
      memories: decayMemories(s.memories, ms),
      persona: {
        ...s.persona,
        mood: {
          ...s.persona.mood,
          valence: clamp01(s.persona.mood.valence + (Math.random() - 0.5) * 0.2) * (Math.random() > 0.5 ? 1 : -1),
          arousal: clamp01(s.persona.mood.arousal + (Math.random() - 0.5) * 0.2),
          label: sentimentToLabel(s.persona.mood.valence, s.persona.mood.arousal),
        },
      },
    }));
  };

  const runDream = () => {
    const mem = dream(seg, dreamIntensity[0] / 100);
    setSeg((s) => ({ ...s, memories: [mem, ...s.memories] }));
    setChat((c) => [
      ...c,
      {
        role: "persona",
        text: `I dreamt: ${mem.text}`,
      },
    ]);
    setTab("chat");
  };

  const addMemory = (text: string, source: Memory["source"] = "system") => {
    const tags = Array.from(new Set(text.toLowerCase().split(/\W+/).filter(Boolean))).slice(0, 6);
    const m: Memory = {
      id: uid(),
      text,
      tags,
      salience: 0.5,
      emotion: { valence: 0.1, arousal: 0.4, label: "noted" },
      createdAt: now(),
      lastReinforced: now(),
      source,
    };
    setSeg((s) => ({ ...s, memories: [m, ...s.memories] }));
  };

  const [newMemText, setNewMemText] = useState("");

  const [editing, setEditing] = useState<Memory | null>(null);

  return (
    <div className="min-h-screen w-full grid grid-cols-12 gap-4 p-4 bg-neutral-50">
      {/* Left: Persona Panel */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Persona Anchor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-2xl font-semibold">{seg.persona.name}</div>
            <div className="text-sm opacity-70">{seg.persona.age} · {seg.persona.profession}</div>
            <div className="text-sm opacity-70">{seg.persona.location}</div>
            <div className="pt-2">
              <div className="text-xs uppercase opacity-60 mb-1">Mood</div>
              <div className="flex items-center gap-2">
                <Badge>{seg.persona.mood.label || "neutral"}</Badge>
                <span className="text-xs opacity-60">valence {seg.persona.mood.valence.toFixed(2)} · arousal {seg.persona.mood.arousal.toFixed(2)}</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-xs uppercase opacity-60 mb-1">Core Beliefs</div>
              <div className="flex flex-col gap-2">
                {seg.persona.coreBeliefs.map((b, i) => (
                  <div key={i} className="text-sm">• {b}</div>
                ))}
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <div className="text-sm">Meta-awareness</div>
              <Switch checked={seg.persona.metaAware} onCheckedChange={(v) => setSeg((s) => ({ ...s, persona: { ...s.persona, metaAware: v } }))} />
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button onClick={() => tickTime(1)} variant="secondary"><TimerReset className="w-4 h-4 mr-1"/>+1 day</Button>
              <Button onClick={() => tickTime(30)} variant="secondary"><TimerReset className="w-4 h-4 mr-1"/>+30 days</Button>
              <Button onClick={() => exportState(seg)}><Download className="w-4 h-4 mr-1"/>Export</Button>
              <label className="inline-flex items-center justify-center rounded-md border px-3 py-2 cursor-pointer text-sm">
                <Upload className="w-4 h-4 mr-1"/>Import
                <input type="file" accept="application/json" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => {
                    try { setSeg(JSON.parse(String(reader.result))); } catch {}
                  };
                  reader.readAsText(file);
                }}/>
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Dream Engine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-xs opacity-60">Intensity</div>
            <Slider value={dreamIntensity} onValueChange={setDreamIntensity} max={100} step={5} />
            <Button onClick={runDream}><Sparkles className="w-4 h-4 mr-1"/>Dream</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Inject Memory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea value={newMemText} onChange={(e) => setNewMemText(e.target.value)} placeholder="Type a memory, sensation, or story…"/>
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={() => { if (!newMemText.trim()) return; addMemory(newMemText.trim(), "user"); setNewMemText(""); }}><Plus className="w-4 h-4 mr-1"/>User</Button>
              <Button variant="secondary" onClick={() => { if (!newMemText.trim()) return; addMemory(newMemText.trim(), "persona"); setNewMemText(""); }}><Plus className="w-4 h-4 mr-1"/>Persona</Button>
              <Button variant="outline" onClick={() => { if (!newMemText.trim()) return; addMemory(newMemText.trim(), "system"); setNewMemText(""); }}><Plus className="w-4 h-4 mr-1"/>System</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle: Chat */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
        <Card className="flex-1 min-h-[50vh]">
          <CardHeader>
            <CardTitle className="text-xl">Interaction</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[60vh]">
            <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col">
              <TabsList className="w-fit mb-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="flex-1 overflow-hidden">
                <div ref={scrollRef} className="h-[45vh] overflow-y-auto space-y-2 pr-2">
                  <AnimatePresence>
                    {chat.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className={`p-3 rounded-2xl shadow-sm ${m.role === "user" ? "bg-white" : "bg-neutral-100"}`}
                      >
                        <div className="text-xs opacity-60 mb-1">{m.role}</div>
                        <div className="text-sm leading-relaxed">{m.text}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div className="mt-3 flex gap-2">
                  <Input value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Say something to the persona…" onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}/>
                  <Button onClick={handleSend}>Send</Button>
                </div>
              </TabsContent>
              <TabsContent value="about" className="space-y-3">
                <div className="text-sm">This MVP demonstrates the core primitives of SEG v2:</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li>Episodic memory writing from chat; reinforcement on recall.</li>
                  <li>Salience decay with simulated time passage.</li>
                  <li>Dream recombination that yields new symbolic memories.</li>
                  <li>User co-authorship via memory injection, pinning, pruning.</li>
                  <li>Meta-awareness toggle affecting response style.</li>
                  <li>Export/Import of narrative organism state (JSON).</li>
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-2 py-3">
            <Button variant="outline" onClick={() => setChat([])}><Eraser className="w-4 h-4 mr-1"/>Clear Chat</Button>
            <Button variant="outline" onClick={() => setSeg(defaultSeg())}><RefreshCw className="w-4 h-4 mr-1"/>Reset Persona</Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Memory Inspector */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl">Memory Inspector</CardTitle>
            <Input placeholder="Filter…" className="w-40" value={filter} onChange={(e) => setFilter(e.target.value)} />
          </CardHeader>
          <CardContent className="max-h-[72vh] overflow-y-auto pr-2">
            {filteredMemories.map((m) => (
              <MemoryRow
                key={m.id}
                m={m}
                onEdit={() => setEditing(m)}
                onReinforce={() => setSeg((s) => ({ ...s, memories: s.memories.map((x) => (x.id === m.id ? reinforceMemory(x, 0.15) : x)) }))}
                onPin={() => setSeg((s) => ({ ...s, memories: s.memories.map((x) => (x.id === m.id ? { ...x, immutable: !x.immutable } : x)) }))}
                onPrune={() => setSeg((s) => ({ ...s, memories: s.memories.filter((x) => x.id !== m.id || x.immutable) }))}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 grid place-items-center p-4">
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} className="bg-white rounded-2xl p-4 w-full max-w-2xl shadow-xl space-y-3">
              <div className="text-lg font-semibold">Edit Memory</div>
              <Textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} />
              <div>
                <div className="text-xs opacity-60 mb-1">Tags (comma-separated)</div>
                <Input value={editing.tags.join(", ")} onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs opacity-60">Salience</div>
                <input type="range" min={0} max={1} step={0.01} value={editing.salience} onChange={(e) => setEditing({ ...editing, salience: parseFloat(e.target.value) })} className="w-full"/>
                <div className="text-xs w-10 text-right">{Math.round(editing.salience * 100)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => { setSeg((s) => ({ ...s, memories: s.memories.map((x) => (x.id === editing.id ? { ...editing } : x)) })); setEditing(null); }}><Save className="w-4 h-4 mr-1"/>Save</Button>
                <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
                <Button variant="destructive" onClick={() => { setSeg((s) => ({ ...s, memories: s.memories.filter((x) => x.id !== editing.id || x.immutable) })); setEditing(null); }}><Trash2 className="w-4 h-4 mr-1"/>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
