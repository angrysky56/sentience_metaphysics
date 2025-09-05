// AI Service Types and Configuration
export type AIProvider = 'ollama' | 'lmstudio' | 'gemini' | 'openai';

export interface AIServiceConfig {
  provider: AIProvider;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  error?: string;
}

// Default configurations for different providers
export const DEFAULT_CONFIGS: Record<AIProvider, Partial<AIServiceConfig>> = {
  ollama: {
    baseUrl: 'http://localhost:11434',
    model: 'llama2'
  },
  lmstudio: {
    baseUrl: 'http://localhost:1234',
    model: 'local-model'
  },
  gemini: {
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    model: 'gemini-pro'
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-3.5-turbo'
  }
};

// Storage keys for configurations
export const STORAGE_KEYS = {
  AI_CONFIG: 'seg_v2_ai_config',
  API_KEYS: 'seg_v2_api_keys'
};
