import { describe, it, expect, vi } from 'vitest';
import { AIService } from '../aiService';
import axios from 'axios';

vi.mock('axios');

describe('AIService', () => {
  const config = {
    provider: 'ollama' as const,
    model: 'llama3',
    baseUrl: 'http://localhost:11434'
  };

  it('should initialize with correct config', () => {
    const service = new AIService(config);
    expect(service).toBeDefined();
  });

  it('should call Ollama correctly', async () => {
    const service = new AIService(config);
    const mockResponse = { data: { response: 'Hello world' } };
    vi.mocked(axios.post).mockResolvedValueOnce(mockResponse);

    const response = await service.generateResponse([{ role: 'user', content: 'hi' }]);
    expect(response.content).toBe('Hello world');
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/api/generate'),
      expect.objectContaining({ model: 'llama3' })
    );
  });

  it('should handle errors gracefully', async () => {
    const service = new AIService(config);
    vi.mocked(axios.post).mockRejectedValueOnce(new Error('Network Error'));

    const response = await service.generateResponse([{ role: 'user', content: 'hi' }]);
    expect(response.error).toBe('Network Error');
    expect(response.content).toBe('');
  });
});
