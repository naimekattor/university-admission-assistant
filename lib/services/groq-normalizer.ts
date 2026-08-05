import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

/**
 * Normalizes raw OCR text from bilingual (Bangla & English) admission circulars using Groq Llama 3.3 70B Versatile:
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

  try {
    console.log(`[Groq Normalizer] Normalizing ${rawText.length} characters of raw text via Llama 3.3 70B Versatile...`);

    const prompt = `You are a high-precision document normalizer specializing in bilingual Bangla (বাংলা) and English university admission circulars and prospectuses.

Given the raw extracted text below from an OCR engine:
1. NORMALIZE HEADINGS: Add clean Markdown headings (# for document title, ## for major sections, ### for sub-sections).
2. FIX OCR ARTIFACTS: Fix broken characters, weird line breaks, and misrecognized Bangla ligatures (যুক্তবর্ণ).
3. CONVERT TABLES TO MARKDOWN: Convert all tabular lists (unit eligibility, GPA cutoffs, subject criteria, seat counts, fee structures) into clean Markdown tables using pipe syntax (|).
4. PRESERVE NUMBERS & FACTS: Keep all numbers (both Bangla digits ১,২,৩ and English digits 1,2,3), dates, unit letters (ক, খ, গ, ঘ, চ / A, B, C, D), and GPA cutoffs 100% accurate.
5. DO NOT TRANSLATE or summarize. Preserve the full content in its original language (Bangla / English).

Raw OCR Input:
---
${rawText.slice(0, 12000)}
---

Output ONLY the cleaned, normalized Markdown text:`;

    const response = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.1,
    });

    const cleanedText = response.text ? response.text.trim() : rawText;
    console.log(`[Groq Normalizer] Successfully normalized text (${cleanedText.length} characters).`);
    return cleanedText;
  } catch (err: any) {
    console.warn('[Groq Normalizer] Groq normalization failed, using raw text fallback:', err.message || err);
    return rawText;
  }
}
