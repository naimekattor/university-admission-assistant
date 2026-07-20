import { LanguageModel } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export type AIProvider = 'ollama' | 'openai' | 'anthropic';

export function getAIModel(): LanguageModel {
  const provider = (process.env.AI_PROVIDER || 'ollama') as AIProvider;

  console.log('[AI] Using provider:', provider);

  switch (provider) {
    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is required when using OpenAI provider');
      }
      return openai('gpt-4-turbo');

    case 'anthropic':
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error('ANTHROPIC_API_KEY is required when using Anthropic provider');
      }
      return anthropic('claude-3-5-sonnet-20241022');

    case 'ollama':
    default:
      if (!process.env.OLLAMA_BASE_URL) {
        throw new Error('OLLAMA_BASE_URL is required when using Ollama provider');
      }
      // Using experimental language model for Ollama
      return {
        modelId: 'ollama',
        provider: 'ollama',
        supportsImageGeneration: false,
        supportsStreaming: true,
      } as unknown as LanguageModel;
  }
}

export function getOllamaModel() {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const modelName = process.env.OLLAMA_MODEL || 'llama2';

  return {
    apiIdentifier: modelName,
    baseURL: baseUrl,
  };
}
