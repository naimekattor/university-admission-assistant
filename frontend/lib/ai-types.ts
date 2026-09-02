export interface StructuredAiResponse {
  type: string;
  summary: string;
  keyPoints?: string[];
  requirements?: string[];
  dates?: Array<{ title: string; date: string }>;
  sources?: Array<{ title: string; url: string }>;
  disclaimer?: string;
  nextSteps?: string[];
}
