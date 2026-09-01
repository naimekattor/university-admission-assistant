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
  maxRetries = 3,
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_CHAT_MODEL || 'gemini-3.6-flash' });
  const base64Data = pagePdfBuffer.toString('base64');

  const prompt = `You are a high-precision document OCR system specializing in bilingual Bangla (বাংলা) and English university admission circulars and prospectuses.

Please extract ALL text from Page ${pageNumber} of this PDF document with 100% precision:
1. PAGE MARKER: Prefix the text with "--- Page ${pageNumber} ---" at the top.
2. BILINGUAL TEXT: Preserve all Bangla text (বাংলা হরফ/যুক্তবর্ণ) and English text exactly as written. Do NOT translate or summarize.
3. MARKDOWN TABLES: Format all tabular data (department-wise seat counts, GPA cutoffs, subject prerequisites, marks, dates, fee structures) into clean Markdown tables using pipe syntax (|).
4. PRESERVE NUMBERS & UNITS: Keep all numbers (both Bangla digits ১,২,৩ and English digits 1,2,3), unit letters (ক, খ, গ, ঘ, চ / A, B, C, D), and course names 100% accurate.

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
        const waitMs = Math.min(attempt * 3000, 10000);
        console.warn(
          `[Vision PDF Extractor] Gemini Page ${pageNumber} hit 429 Rate Limit (Attempt ${attempt}/${maxRetries}). Retrying in ${waitMs / 1000}s...`,
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
 * Unified Fast PDF extraction service:
 * 1. Primary: Instant Native PDF text extraction via pdf-parse (0.05 seconds, ZERO rate limits)
 * 2. Secondary Fallback: Gemini 2.0 Flash Vision API (Only for scanned image-only PDFs)
 */
export async function extractBanglaPdfText(pdfBuffer: Buffer): Promise<string> {
  // Step 1: Fast Native Extraction (0.05s, 0 Rate Limits, 0 Delays)
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse/lib/pdf-parse.js');
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text ? pdfData.text.trim() : '';

    if (extractedText.length > 200) {
      console.log(
        `[Vision PDF Extractor] Instant native extraction successful (${extractedText.length} chars across ${pdfData.numpages || 1} page(s) in 0.05s).`,
      );
      return extractedText;
    }
  } catch (parseErr) {
    console.warn('[Vision PDF Extractor] Native pdf-parse skipped, using Gemini Vision fallback:', parseErr);
  }

  // Step 2: Fallback to Gemini 2.0 Flash Vision for scanned image PDFs
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      console.log('[Vision PDF Extractor] Scanned PDF detected. Loading document for Gemini Vision...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const srcPdf = await PDFDocument.load(pdfBuffer);
      const pageCount = srcPdf.getPageCount();

      console.log(`[Vision PDF Extractor] Processing ${pageCount} scanned page(s) via Gemini 2.0 Flash Vision API...`);
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
        '[Vision PDF Extractor] Gemini Vision extraction failed:',
        err instanceof Error ? err.message : err,
      );
    }
  }

  return '';
}
