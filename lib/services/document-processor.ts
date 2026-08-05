import { generateEmbedding } from '@/lib/ai/embeddings';
import {
  ensureCollection,
  qdrantClient,
  ADMISSION_DOCS_COLLECTION,
} from '@/lib/qdrant';
import { v4 as uuidv4 } from 'uuid';

export type DocumentType = 'circular' | 'prospectus' | 'faq' | 'notice' | 'regulation';

export interface ProcessedDocument {
  id: string;
  university: string;
  unit?: string;
  year: number;
  source: string;
  page: number;
  text: string;
  type: DocumentType;
  originalFileName: string;
  filePath: string;
}

export function detectUnitFromText(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('ক ইউনিট') || t.includes('ka unit') || t.includes('a unit') || t.includes('science group') || t.includes('বিজ্ঞান')) {
    return 'Ka Unit (Science / A Unit)';
  }
  if (t.includes('খ ইউনিট') || t.includes('kha unit') || t.includes('b unit') || t.includes('humanities') || t.includes('मानविक') || t.includes('মানবিক')) {
    return 'Kha Unit (Arts / B Unit)';
  }
  if (t.includes('গ ইউনিট') || t.includes('ga unit') || t.includes('c unit') || t.includes('business studies') || t.includes('ব্যবসায়')) {
    return 'Ga Unit (Commerce / C Unit)';
  }
  if (t.includes('ঘ ইউনিট') || t.includes('gha unit') || t.includes('d unit') || t.includes('সমন্বিত')) {
    return 'Gha Unit (Combined / D Unit)';
  }
  if (t.includes('চ ইউনিট') || t.includes('cha unit') || t.includes('fine arts') || t.includes('চারুকলা')) {
    return 'Cha Unit (Fine Arts)';
  }
  return 'All Units';
}

import { extractBanglaPdfText } from '@/lib/services/vision-pdf-extractor';
import { db, documents } from '../db';

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === 'application/pdf') {
    return await extractBanglaPdfText(buffer);
  }

  if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (mimeType.startsWith('text/')) {
    return buffer.toString('utf-8');
  }

  if (mimeType.startsWith('image/')) {
    return '';
  }

  throw new Error(`Unsupported file type: ${mimeType}`);
}

export function normalizeExtractedText(text: string): string {
  if (!text) return '';

  // 1. Convert CRLF / CR to standard \n
  const clean = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. If text already contains Markdown table syntax (|), headers (#), or lists (- / *), preserve line structure
  const hasMarkdownStructure = /\||- |\* |#|^\s*\d+[\.\)]/m.test(clean);
  if (hasMarkdownStructure) {
    return clean
      .split('\n')
      .map((l) => l.trim())
      .filter((l, i, arr) => l !== '' || (i > 0 && arr[i - 1] !== ''))
      .join('\n');
  }

  // 3. Fallback paragraph merging for plain raw text
  const lines = clean.split('\n').map((l) => l.trim()).filter(Boolean);
  const mergedParagraphs: string[] = [];
  let currentBuffer = '';

  for (const line of lines) {
    if (!currentBuffer) {
      currentBuffer = line;
    } else {
      const lastChar = currentBuffer.slice(-1);
      if (['।', '.', '?', '!', ':'].includes(lastChar) || line.startsWith('|') || line.startsWith('#') || line.startsWith('-')) {
        mergedParagraphs.push(currentBuffer);
        currentBuffer = line;
      } else {
        currentBuffer += ' ' + line;
      }
    }
  }

  if (currentBuffer) {
    mergedParagraphs.push(currentBuffer);
  }

  return mergedParagraphs.join('\n\n').replace(/[ \t]+/g, ' ').trim();
}

export function chunkText(text: string, maxChunkSize = 1000, overlap = 100): string[] {
  const normalized = normalizeExtractedText(text);
  // Split by double newlines or Bangla dari (।) / newlines
  const paragraphs = normalized.split(/\n\s*\n|(?<=।)\n+/);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length > maxChunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 5)).join(' ');
      currentChunk = overlapWords + '\n\n' + trimmed;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [normalized.trim()];
}

import { normalizeTextWithGroq } from '@/lib/services/groq-normalizer';

export async function processAndUploadDocument(params: {
  buffer: Buffer;
  mimeType: string;
  originalFileName: string;
  filePath: string;
  university: string;
  unit?: string;
  year: number;
  documentType: DocumentType;
}): Promise<{ documentsCount: number; chunksCount: number; detectedUnit: string }> {
  const { buffer, mimeType, originalFileName, filePath, university, unit, year, documentType } = params;

  const rawText = await extractTextFromFile(buffer, mimeType);
  const cleanRawText = normalizeExtractedText(rawText);

  if (!cleanRawText.trim()) {
    throw new Error('No text content could be extracted from the file');
  }

  // Run Groq Llama 3.3 70B Versatile normalization for headings, OCR artifacts, and Markdown tables
  const normalizedText = await normalizeTextWithGroq(cleanRawText);

  const detectedUnit = (!unit || unit === 'auto' || unit === '') ? detectUnitFromText(normalizedText) : unit;
  const chunks = chunkText(normalizedText);
  const docId = uuidv4();

  await ensureCollection(ADMISSION_DOCS_COLLECTION);

  console.log(`[Document Processor] Generating embeddings for ${chunks.length} chunk(s) from "${originalFileName}"...`);

  const points = [];
  for (let i = 0; i < chunks.length; i++) {
    const vector = await generateEmbedding(chunks[i]);

    points.push({
      id: uuidv4(),
      vector,
      payload: {
        docId,
        chunkIndex: i,
        university,
        unit: detectedUnit,
        year,
        source: originalFileName,
        page: Math.floor(i / 3) + 1,
        text: chunks[i],
        type: documentType,
        originalFileName,
        filePath,
      },
    });
  }

  // Insert document record into PostgreSQL
  try {
    await db.insert(documents).values({
      originalFileName,
      filePath,
      university,
      unit: detectedUnit,
      year,
      documentType,
      chunkCount: points.length,
    });
    console.log(`[Document Processor] Recorded document metadata in PostgreSQL for "${originalFileName}".`);
  } catch (dbErr: any) {
    console.warn(`[Document Processor] PostgreSQL document insertion warning:`, dbErr.message || dbErr);
  }

  // Upsert vector points into Qdrant Vector DB
  await qdrantClient.upsert(ADMISSION_DOCS_COLLECTION, { points });
  console.log(`[Document Processor] Successfully stored ${points.length} vector points in Qdrant collection "${ADMISSION_DOCS_COLLECTION}".`);

  return { documentsCount: 1, chunksCount: points.length, detectedUnit };
}
