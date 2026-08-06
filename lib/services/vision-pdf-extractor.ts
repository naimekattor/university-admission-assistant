import { GoogleGenerativeAI } from '@google/generative-ai';
import { PDFDocument } from 'pdf-lib';

/**
 * Utility to pause execution for rate-limiting
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * High-precision PDF text extractor using Google Gemini 2.0 Flash Vision API.
 * Includes automatic retry with exponential backoff on 429 Rate Limit.
 */
async function extractSinglePageWithGemini(
  genAI: GoogleGenerativeAI,
  pagePdfBuffer: Buffer,
  pageNumber: number,
  maxRetries = 4,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const base64Data = pagePdfBuffer.toString('base64');

  const prompt = `You are a high-precision document OCR and extractor specializing in bilingual Bangla (বাংলা) and English university admission circulars and prospectuses.

Please extract ALL text from Page ${pageNumber} of this PDF document with 100% precision:
1. PAGE MARKER: Prefix the text with "--- Page ${pageNumber} ---" at the top.
2. BILINGUAL TEXT: Preserve all Bangla text (বাংলা হরফ/যুক্তবর্ণ) and English text exactly as written. Do NOT translate or summarize.
3. MARKDOWN TABLES: Format all tabular data (department-wise seat counts, GPA cutoffs, subject prerequisites, marks, dates, fee structures) into clean Markdown tables using pipe syntax (|).
4. PRESERVE NUMBERS & UNITS: Keep all numbers (both Bangla digits ১,২,৩ and English digits 1,2,3), unit letters (ক, খ, গ, ঘ, চ / A, B, C, D), and course names 100% accurate.
5. COMPLETE OUTPUT: Extract every single paragraph, table row, and header.

Output ONLY the extracted Markdown text:`;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
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
    } catch (err: any) {
      const is429 = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('Quota exceeded');

      if (is429 && attempt < maxRetries) {
        // Extract retryDelay from error object or calculate backoff (4s, 8s, 16s)
        const retryDelaySec = err?.errorDetails?.[2]?.retryDelay ? parseInt(err.errorDetails[2].retryDelay, 10) : attempt * 4;
        const waitMs = Math.max((retryDelaySec || 4) * 1000, 3000);

        console.warn(
          `[Vision PDF Extractor] Page ${pageNumber} hit 429 Rate Limit (Attempt ${attempt}/${maxRetries}). Retrying in ${Math.round(waitMs / 1000)}s...`,
        );
        await sleep(waitMs);
      } else {
        throw err;
      }
    }
  }

  return '';
}

/**
 * Unified PDF extraction service:
 * 1. Primary: Google Gemini 2.0 Flash Vision API (Page-by-page processing via pdf-lib with 429 Retry)
 * 2. Fallback: Native Node.js pdf-parse engine
 */
export async function extractBanglaPdfText(pdfBuffer: Buffer): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      console.log('[Vision PDF Extractor] Loading PDF document with pdf-lib...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const srcPdf = await PDFDocument.load(pdfBuffer);
      const pageCount = srcPdf.getPageCount();

      console.log(`[Vision PDF Extractor] Processing ${pageCount} page(s) via Gemini 2.0 Flash Vision API (page-by-page)...`);
      const extractedPages: string[] = [];

      for (let i = 0; i < pageCount; i++) {
        try {
          const singlePagePdf = await PDFDocument.create();
          const [copiedPage] = await singlePagePdf.copyPages(srcPdf, [i]);
          singlePagePdf.addPage(copiedPage);

          const singlePageBytes = await singlePagePdf.save();
          const singlePageBuffer = Buffer.from(singlePageBytes);

          console.log(`[Vision PDF Extractor] Extracting Page ${i + 1}/${pageCount} via Gemini Vision...`);
          const pageText = await extractSinglePageWithGemini(genAI, singlePageBuffer, i + 1);

          if (pageText) {
            extractedPages.push(pageText);
          }

          // Small delay between page extractions to stay smoothly within 15 RPM Free Tier limit
          if (i < pageCount - 1) {
            await sleep(1500);
          }
        } catch (pageErr) {
          console.warn(`[Vision PDF Extractor] Gemini extraction failed on page ${i + 1}:`, pageErr instanceof Error ? pageErr.message : pageErr);
        }
      }

      if (extractedPages.length > 0) {
        const fullText = extractedPages.join('\n\n');
        console.log(`[Vision PDF Extractor] Successfully extracted ${fullText.length} characters across ${extractedPages.length}/${pageCount} pages.`);
        return fullText;
      }
    } catch (err) {
      console.warn(
        '[Vision PDF Extractor] Gemini Vision multi-page extraction failed, attempting fallback:',
        err instanceof Error ? err.message : err,
      );
    }
  } else {
    console.warn('[Vision PDF Extractor] GEMINI_API_KEY not found in environment variables.');
  }

  // Fallback to standard pdf-parse parser
  console.log('[Vision PDF Extractor] Falling back to standard pdf-parse parser.');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse/lib/pdf-parse.js');
  const data = await pdfParse(pdfBuffer);
  return data.text || '';
}
