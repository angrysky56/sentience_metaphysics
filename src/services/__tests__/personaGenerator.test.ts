import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PersonaGenerator } from '../personaGenerator';
import { AIService } from '../aiService';

describe('PersonaGenerator', () => {
  let mockAiService: any;
  let generator: PersonaGenerator;

  beforeEach(() => {
    mockAiService = {
      generateResponse: vi.fn()
    };
    generator = new PersonaGenerator(mockAiService as unknown as AIService);
  });

  it('should generate a persona via AI', async () => {
    const mockPersona = {
      name: 'Elias Thorne',
      age: 54,
      profession: 'archivist',
      location: 'ancient library',
      coreBeliefs: ['Knowledge is a river'],
      linguisticTics: ['as the ink dries'],
      emotionalCore: 'The weight of unread stories',
      sensoryAnchors: { scent: 'dust', sound: 'turning pages', touch: 'vellum', taste: 'tea' },
      backstoryElements: ['Found a hidden map'],
      mood: { valence: 0.2, arousal: 0.1, label: 'calm' }
    };

    mockAiService.generateResponse.mockResolvedValue({
      content: JSON.stringify(mockPersona)
    });

    const persona = await generator.generatePersona('scholar');
    expect(persona?.name).toBe('Elias Thorne');
    expect(persona?.archetype).toBe('scholar');
    expect(mockAiService.generateResponse).toHaveBeenCalled();
  });

  it('should fallback if AI fails', async () => {
    mockAiService.generateResponse.mockResolvedValue({ error: 'AI Error' });

    const persona = await generator.generatePersona('artisan');
    expect(persona).toBeDefined();
    expect(persona?.archetype).toBe('artisan');
  });
});
