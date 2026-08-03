import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Extract Bangla & English PDF text using Google Gemini 2.0 Flash Vision API.
 */
async function extractWithGemini(pdfBuffer: Buffer): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment variables.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const base64Data = pdfBuffer.toString('base64');
  const prompt = `You are an expert OCR system specialized in bilingual Bangla (বাংলা) and English university admission circulars and prospectuses.

Please extract ALL text from this document with 100% precision:
1. Preserve all Bangla text (বাংলা হরফ/যুক্তবর্ণ) and English text exactly as written.
2. Keep all tables, subject-wise GPA cutoffs, seat numbers, unit names (ক, খ, গ, ঘ, চ), marks, dates, and fees formatted in clean Markdown tables or bullet lists.
3. Preserve numbers (both Bangla digits ১,২,৩ and English digits 1,2,3).
4. Do NOT translate Bangla to English or English to Bangla.
5. Do NOT summarize or omit any section. Output the exact complete extracted text.

Output ONLY the extracted Markdown text.`;

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64Data,
        mimeType: 'application/pdf',
      },
    },
    prompt,
  ]);

  const responseText = result.response.text();
  return responseText ? responseText.trim() : '';
}

/**
 * Extract Bangla PDF text using local Ollama Vision API (e.g. llama3.2-vision or qwen2-vl).
 */
async function extractWithOllamaVision(pdfBuffer: Buffer): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const visionModel = process.env.OLLAMA_VISION_MODEL || 'llama3.2-vision';
  const base64Data = pdfBuffer.toString('base64');

  const prompt = `Extract all text from this bilingual Bangla and English admission circular accurately. Preserve numbers, tables, units (Ka, Kha, Ga), and formatting in clean Markdown.`;

  const response = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: visionModel,
      prompt: prompt,
      images: [base64Data],
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama Vision HTTP error ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.response ? data.response.trim() : '';
}

/**
 * Unified Bangla PDF extraction service:
 * 1. Primary: Gemini 1.5 Flash Vision API
 * 2. Secondary Fallback: Ollama Local Vision (llama3.2-vision)
 * 3. Final Fallback: Standard pdf-parse
 */
export async function extractBanglaPdfText(pdfBuffer: Buffer): Promise<string> {
  // Step 1: Try Gemini Vision API
  if (process.env.GEMINI_API_KEY) {
    try {
      console.log('[Vision PDF Extractor] Attempting extraction via Gemini Flash Vision...');
      const geminiText = await extractWithGemini(pdfBuffer);
      if (geminiText && geminiText.length > 20) {
        console.log('[Vision PDF Extractor] Successfully extracted text using Gemini Vision.');
        return geminiText;
      }
    } catch (err) {
      console.warn(
        '[Vision PDF Extractor] Gemini Vision failed or quota exceeded:',
        err instanceof Error ? err.message : err,
      );
    }
  } else {
    console.log('[Vision PDF Extractor] GEMINI_API_KEY not set. Skipping Gemini Vision.');
  }

  // Step 2: Fallback to Ollama Local Vision
  try {
    console.log('[Vision PDF Extractor] Attempting fallback extraction via Ollama Local Vision...');
    const ollamaText = await extractWithOllamaVision(pdfBuffer);
    if (ollamaText && ollamaText.length > 20) {
      console.log('[Vision PDF Extractor] Successfully extracted text using Ollama Local Vision.');
      return ollamaText;
    }
  } catch (err) {
    console.warn(
      '[Vision PDF Extractor] Ollama Local Vision failed:',
      err instanceof Error ? err.message : err,
    );
  }

  // Step 3: Final Fallback to standard pdf-parse
  console.log('[Vision PDF Extractor] Falling back to standard pdf-parse parser.');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse.js');
  const data = await pdfParse(pdfBuffer);
  return data.text || '';
}
