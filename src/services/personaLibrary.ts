import { GeneratedPersona } from './personaGenerator';

export interface PersonaLibraryEntry {
  id: string;
  persona: GeneratedPersona;
  name: string;
  description?: string;
  tags: string[];
  createdAt: number;
  lastUsed: number;
  useCount: number;
  rating?: number; // 1-5 star rating
  isDefault?: boolean;
}

export interface PersonaLibraryState {
  entries: PersonaLibraryEntry[];
  defaultPersonaId?: string;
  version: string;
}

const STORAGE_KEY = 'sentience_persona_library';
const LIBRARY_VERSION = '1.0.0';

export class PersonaLibrary {
  private state: PersonaLibraryState;

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): PersonaLibraryState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old versions if needed
        if (parsed.version !== LIBRARY_VERSION) {
          return this.migrateLibrary(parsed);
        }
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load persona library:', error);
    }
    
    return {
      entries: [],
      version: LIBRARY_VERSION
    };
  }

  private migrateLibrary(oldState: any): PersonaLibraryState {
    // Handle migration from older versions
    return {
      entries: oldState.entries || [],
      defaultPersonaId: oldState.defaultPersonaId,
      version: LIBRARY_VERSION
    };
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save persona library:', error);
    }
  }

  private generateId(): string {
    return `persona_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  }

  // Save a persona to the library
  savePersona(persona: GeneratedPersona, name?: string, description?: string, tags: string[] = []): string {
    const id = this.generateId();
    const entry: PersonaLibraryEntry = {
      id,
      persona,
      name: name || persona.name,
      description,
      tags: [...tags, persona.archetype],
      createdAt: Date.now(),
      lastUsed: Date.now(),
      useCount: 0,
      rating: undefined
    };

    this.state.entries.push(entry);
    this.saveToStorage();
    return id;
  }

  // Load a persona by ID
  loadPersona(id: string): PersonaLibraryEntry | null {
    const entry = this.state.entries.find(e => e.id === id);
    if (entry) {
      // Update usage stats
      entry.lastUsed = Date.now();
      entry.useCount++;
      this.saveToStorage();
      return entry;
    }
    return null;
  }

  // Get all personas in library
  getAllPersonas(): PersonaLibraryEntry[] {
    return [...this.state.entries].sort((a, b) => b.lastUsed - a.lastUsed);
  }

  // Search personas by tags, name, or archetype
  searchPersonas(query: string): PersonaLibraryEntry[] {
    const lowercaseQuery = query.toLowerCase();
    return this.state.entries.filter(entry => 
      entry.name.toLowerCase().includes(lowercaseQuery) ||
      entry.description?.toLowerCase().includes(lowercaseQuery) ||
      entry.persona.archetype.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      entry.persona.profession.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get personas by archetype
  getPersonasByArchetype(archetype: string): PersonaLibraryEntry[] {
    return this.state.entries.filter(entry => 
      entry.persona.archetype === archetype
    );
  }

  // Delete a persona
  deletePersona(id: string): boolean {
    const index = this.state.entries.findIndex(e => e.id === id);
    if (index !== -1) {
      // If deleting the default persona, clear the default
      if (this.state.defaultPersonaId === id) {
        this.state.defaultPersonaId = undefined;
      }
      
      this.state.entries.splice(index, 1);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Update persona rating
  ratePersona(id: string, rating: number): boolean {
    const entry = this.state.entries.find(e => e.id === id);
    if (entry && rating >= 1 && rating <= 5) {
      entry.rating = rating;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Set default persona
  setDefaultPersona(id: string): boolean {
    const entry = this.state.entries.find(e => e.id === id);
    if (entry) {
      // Clear previous default
      this.state.entries.forEach(e => e.isDefault = false);
      
      // Set new default
      entry.isDefault = true;
      this.state.defaultPersonaId = id;
      this.saveToStorage();
      return true;
    }
    return false;
  }

  // Get default persona
  getDefaultPersona(): PersonaLibraryEntry | null {
    if (this.state.defaultPersonaId) {
      return this.loadPersona(this.state.defaultPersonaId);
    }
    return null;
  }

  // Export library to JSON
  exportLibrary(): string {
    return JSON.stringify(this.state, null, 2);
  }

  // Import library from JSON
  importLibrary(jsonData: string, merge: boolean = false): boolean {
    try {
      const importedState = JSON.parse(jsonData);
      
      if (merge) {
        // Merge with existing library, avoiding ID conflicts
        const existingIds = new Set(this.state.entries.map(e => e.id));
        const newEntries = importedState.entries.filter((entry: PersonaLibraryEntry) => 
          !existingIds.has(entry.id)
        );
        
        this.state.entries.push(...newEntries);
      } else {
        // Replace entire library
        this.state = {
          ...importedState,
          version: LIBRARY_VERSION
        };
      }
      
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Failed to import persona library:', error);
      return false;
    }
  }

  // Get library statistics
  getLibraryStats() {
    const entries = this.state.entries;
    const archetypeCounts = entries.reduce((acc, entry) => {
      acc[entry.persona.archetype] = (acc[entry.persona.archetype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgRating = entries
      .filter(e => e.rating)
      .reduce((sum, e) => sum + e.rating!, 0) / 
      entries.filter(e => e.rating).length || 0;

    return {
      totalPersonas: entries.length,
      archetypeCounts,
      averageRating: avgRating,
      mostUsed: entries.sort((a, b) => b.useCount - a.useCount)[0] || null,
      recentlyAdded: entries.sort((a, b) => b.createdAt - a.createdAt).slice(0, 5)
    };
  }

  // Clean up unused or low-rated personas
  cleanupLibrary(maxEntries: number = 50, minRating: number = 2): number {
    const beforeCount = this.state.entries.length;
    
    if (beforeCount <= maxEntries) {
      return 0; // No cleanup needed
    }

    // Sort by usage, rating, and recency
    const sorted = this.state.entries.sort((a, b) => {
      const scoreA = (a.rating || 3) * 0.4 + (a.useCount * 0.3) + (a.lastUsed * 0.3);
      const scoreB = (b.rating || 3) * 0.4 + (b.useCount * 0.3) + (b.lastUsed * 0.3);
      return scoreB - scoreA;
    });

    // Keep top performers and recently used
    this.state.entries = sorted.slice(0, maxEntries);
    this.saveToStorage();

    return beforeCount - this.state.entries.length;
  }
}