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
  year: number;
  source: string;
  page: number;
  text: string;
  type: DocumentType;
  originalFileName: string;
  filePath: string;
}

export async function extractTextFromFile(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  if (mimeType === 'application/pdf') {
    const { PDFParse } = await import('pdf-parse');
    const pdf = new PDFParse({ data: buffer }) as any;
    await pdf.load();
    const result = (await pdf.getText()) as { text: string };
    pdf.destroy();
    return result.text || '';
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

export function chunkText(text: string, maxChunkSize = 1000, overlap = 100): string[] {
  const paragraphs = text.split(/\n\s*\n/);
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

  return chunks.length > 0 ? chunks : [text.trim()];
}

export async function processAndUploadDocument(params: {
  buffer: Buffer;
  mimeType: string;
  originalFileName: string;
  filePath: string;
  university: string;
  year: number;
  documentType: DocumentType;
}): Promise<{ documentsCount: number; chunksCount: number }> {
  const { buffer, mimeType, originalFileName, filePath, university, year, documentType } = params;

  const rawText = await extractTextFromFile(buffer, mimeType);
  if (!rawText.trim()) {
    throw new Error('No text content could be extracted from the file');
  }

  const chunks = chunkText(rawText);
  const docId = uuidv4();

  await ensureCollection(ADMISSION_DOCS_COLLECTION);

  const points = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunkId = `${docId}-chunk-${i}`;
    const vector = await generateEmbedding(chunks[i]);

    points.push({
      id: uuidv4(),
      vector,
      payload: {
        docId,
        chunkIndex: i,
        university,
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

  await qdrantClient.upsert(ADMISSION_DOCS_COLLECTION, { points });

  return { documentsCount: 1, chunksCount: points.length };
}
