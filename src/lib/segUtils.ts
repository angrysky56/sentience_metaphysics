import { Memory, SegState, Emotion } from './SegV2';

export function decayMemories(memories: Memory[], msElapsed: number): Memory[] {
  // exponential-like decay depending on time since last reinforcement
  const days = msElapsed / (1000 * 60 * 60 * 24);
  return memories.map((m) => {
    const ageDays = (Date.now() - m.lastReinforced) / (1000 * 60 * 60 * 24);
    const decayRate = m.immutable ? 0.001 : 0.02; // slower for core
    const decay = Math.exp(-decayRate * (ageDays + days)) * m.salience;
    const newSalience = Math.max(0, Math.min(1, 0.15 + decay)); // floor to avoid vanishing
    return { ...m, salience: newSalience };
  });
}

export function reinforceMemory(m: Memory, amount = 0.1): Memory {
  const s = Math.max(0, Math.min(1, m.salience + amount));
  return { ...m, salience: s, lastReinforced: Date.now() };
}

export function dream(state: SegState, intensity = 0.6): Memory {
  // pick a few salient memories and recombine
  const pool = [...state.memories].sort((a, b) => b.salience - a.salience).slice(0, 5);
  const pick = () => pool[Math.floor(Math.random() * pool.length)];
  const a = pick();
  const b = pick();
  const c = pick();
  const text = `${a.text.split(".")[0].trim()}, braided with ${b.text.toLowerCase()} — and then ${c.text.toLowerCase()} like a coastline redrawn.`;
  const tags = Array.from(new Set([...a.tags, ...b.tags, ...c.tags, "dream"]))
    .slice(0, 6);
  
  const uid = (prefix = "m") => `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  
  return {
    id: uid("d"),
    text,
    tags,
    salience: Math.max(0, Math.min(1, (a.salience + b.salience + c.salience) / 3 * (0.7 + intensity * 0.3))),
    emotion: { valence: (a.emotion.valence + b.emotion.valence) / 2, arousal: 0.6, label: "dreamt" },
    createdAt: Date.now(),
    lastReinforced: Date.now(),
    source: "persona" as const,
  };
}

export function exportState(state: SegState) {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `seg-state-${new Date().toISOString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
