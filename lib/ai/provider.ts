import { LanguageModel } from 'ai';
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export type AIProvider = 'ollama' | 'openai' | 'anthropic';

export function getAIModel(): LanguageModel {
  let provider = (process.env.AI_PROVIDER || 'ollama') as AIProvider;

  if (provider === 'openai' && !process.env.OPENAI_API_KEY) {
    console.warn('[AI] OPENAI_API_KEY is not configured. Falling back to local Ollama instantly.');
    provider = 'ollama';
  }

  if (provider === 'anthropic' && !process.env.ANTHROPIC_API_KEY) {
    console.warn('[AI] ANTHROPIC_API_KEY is not configured. Falling back to local Ollama instantly.');
    provider = 'ollama';
  }

  console.log('[AI] Using provider:', provider);

  switch (provider) {
    case 'openai':
      return openai('gpt-4-turbo');

    case 'anthropic':
      return anthropic('claude-3-5-sonnet-20241022');

    case 'ollama':
    default:
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
