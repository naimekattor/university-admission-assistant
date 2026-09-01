import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

/**
 * Normalizes raw OCR text from bilingual (Bangla & English) admission circulars using Groq Llama 3.3 70B Versatile:
 * - Processes ALL pages without truncating at 12,000 characters
 * - Preserves "--- Page N ---" markers so Qdrant metadata has accurate page numbers
 * - Normalizes headings (#, ##, ###)
 * - Fixes OCR artifacts, broken Bangla ligatures, and typos
 * - Converts tabular data into clean Markdown tables (|)
 * - Preserves numbers (Bangla & English digits) and facts 100% accurately
 */
export async function normalizeTextWithGroq(rawText: string): Promise<string> {
  if (!rawText || rawText.trim().length === 0) {
    return '';
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log('[Groq Normalizer] GROQ_API_KEY not configured. Skipping Groq normalization.');
    return rawText;
  }

  // Split document by page markers "--- Page N ---"
  const pageParts = rawText.split(/(?=--- Page \d+ ---)/i);

  if (pageParts.length <= 1 && rawText.length > 8000) {
    const chunks: string[] = [];
    for (let i = 0; i < rawText.length; i += 8000) {
      chunks.push(rawText.slice(i, i + 8000));
    }
    const normalizedChunks = await Promise.all(
      chunks.map((c) => normalizeSingleChunk(c))
    );
    return normalizedChunks.join('\n\n');
  }

  console.log(`[Groq Normalizer] Normalizing ${pageParts.length} page(s) (${rawText.length} total chars) via Groq...`);

  // Group pages into batches of ~7000 characters to stay within context limits without truncating any page
  const pageBatches: string[] = [];
  let currentBatch = '';

  for (const part of pageParts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    if (currentBatch.length + trimmed.length > 7000 && currentBatch.length > 0) {
      pageBatches.push(currentBatch);
      currentBatch = trimmed;
    } else {
      currentBatch += (currentBatch ? '\n\n' : '') + trimmed;
    }
  }
  if (currentBatch.trim()) {
    pageBatches.push(currentBatch.trim());
  }

  const normalizedResults: string[] = [];
  for (let idx = 0; idx < pageBatches.length; idx++) {
    const batchText = pageBatches[idx];
    try {
      console.log(`[Groq Normalizer] Processing page batch ${idx + 1}/${pageBatches.length} (${batchText.length} chars)...`);
      const normalizedBatch = await normalizeSingleChunk(batchText);
      normalizedResults.push(normalizedBatch);
    } catch (err: any) {
      console.warn(`[Groq Normalizer] Batch ${idx + 1} normalization failed, using raw fallback:`, err.message || err);
      normalizedResults.push(batchText);
    }
  }

  return normalizedResults.join('\n\n');
}

async function normalizeSingleChunk(textChunk: string): Promise<string> {
  const prompt = `You are a high-precision document normalizer specializing in bilingual Bangla (বাংলা) and English university admission circulars and prospectuses.

Given the raw extracted text below from an OCR engine:
1. PRESERVE PAGE MARKERS: Keep all "--- Page N ---" headers EXACTLY as written at the start of each page. Do NOT delete, modify, or merge page markers.
2. NORMALIZE HEADINGS: Add clean Markdown headings (# for document title, ## for major sections, ### for sub-sections).
3. FIX OCR ARTIFACTS: Fix broken characters, weird line breaks, and misrecognized Bangla ligatures (যুক্তবর্ণ).
4. CONVERT TABLES TO MARKDOWN: Convert all tabular lists (unit eligibility, GPA cutoffs, subject criteria, seat counts, fee structures) into clean Markdown tables using pipe syntax (|).
5. PRESERVE NUMBERS & FACTS: Keep all numbers (both Bangla digits ১,২,৩ and English digits 1,2,3), dates, unit letters (ক, খ, গ, ঘ, চ / A, B, C, D), and GPA cutoffs 100% accurate.
6. DO NOT TRANSLATE or summarize. Preserve full content in original language.

Raw OCR Input:
---
${textChunk}
---

Output ONLY the cleaned, normalized Markdown text:`;

  const response = await generateText({
    model: groq(process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'),
    prompt,
    temperature: 0.1,
  });

  return response.text ? response.text.trim() : textChunk;
}
