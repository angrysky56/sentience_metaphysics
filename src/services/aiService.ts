import axios, { AxiosResponse } from 'axios';
import { AIServiceConfig, AIMessage, AIResponse, AIProvider, DEFAULT_CONFIGS } from './types';

export class AIService {
  private config: AIServiceConfig;

  constructor(config: AIServiceConfig) {
    this.config = { ...DEFAULT_CONFIGS[config.provider], ...config };
  }

  async generateResponse(messages: AIMessage[], systemPrompt?: string): Promise<AIResponse> {
    try {
      const allMessages = systemPrompt 
        ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
        : messages;

      switch (this.config.provider) {
        case 'ollama':
          return await this.callOllama(allMessages);
        case 'lmstudio':
          return await this.callLMStudio(allMessages);
        case 'gemini':
          return await this.callGemini(allMessages);
        case 'openai':
          return await this.callOpenAI(allMessages);
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      return {
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private async callOllama(messages: AIMessage[]): Promise<AIResponse> {
    const prompt = this.messagesToPrompt(messages);
    const response: AxiosResponse = await axios.post(`${this.config.baseUrl}/api/generate`, {
      model: this.config.model,
      prompt: prompt,
      stream: false
    });

    return {
      content: response.data.response || 'No response generated'
    };
  }

  private async callLMStudio(messages: AIMessage[]): Promise<AIResponse> {
    const response: AxiosResponse = await axios.post(`${this.config.baseUrl}/v1/chat/completions`, {
      model: this.config.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return {
      content: response.data.choices[0]?.message?.content || 'No response generated'
    };
  }

  private async callGemini(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('Gemini API key is required');
    }

    const prompt = this.messagesToPrompt(messages);
    const response: AxiosResponse = await axios.post(
      `${this.config.baseUrl}/models/${this.config.model}:generateContent?key=${this.config.apiKey}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }
    );

    return {
      content: response.data.candidates[0]?.content?.parts[0]?.text || 'No response generated'
    };
  }

  private async callOpenAI(messages: AIMessage[]): Promise<AIResponse> {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    const response: AxiosResponse = await axios.post(
      `${this.config.baseUrl}/chat/completions`,
      {
        model: this.config.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      content: response.data.choices[0]?.message?.content || 'No response generated'
    };
  }

  private messagesToPrompt(messages: AIMessage[]): string {
    return messages.map(msg => {
      const rolePrefix = msg.role === 'user' ? 'Human: ' : 
                        msg.role === 'assistant' ? 'Assistant: ' : 
                        'System: ';
      return `${rolePrefix}${msg.content}`;
    }).join('\n\n');
  }

  // Test connection to the AI service
  async testConnection(): Promise<boolean> {
    try {
      const testResponse = await this.generateResponse([
        { role: 'user', content: 'Hello, are you working?' }
      ]);
      return !testResponse.error && testResponse.content.length > 0;
    } catch {
      return false;
    }
  }
}

// Service factory
export function createAIService(config: AIServiceConfig): AIService {
  return new AIService(config);
}
