import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { processAndUploadDocument } from '@/lib/services/document-processor';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads', 'circulars');

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'text/html',
  'image/png',
  'image/jpeg',
  'image/webp',
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const university = formData.get('university') as string || 'Unknown';
    const unit = formData.get('unit') as string || 'auto';
    const year = parseInt(formData.get('year') as string) || new Date().getFullYear();
    const documentType = (formData.get('documentType') as string || 'circular') as 'circular' | 'prospectus' | 'faq' | 'notice' | 'regulation';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx?|txt|html?|png|jpe?g|webp)$/i)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const filePath = join(UPLOAD_DIR, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const result = await processAndUploadDocument({
      buffer,
      mimeType: file.type,
      originalFileName: file.name,
      filePath: `/uploads/circulars/${safeName}`,
      university,
      unit,
      year,
      documentType,
    });

    return NextResponse.json({
      success: true,
      message: `Processed ${result.documentsCount} document(s) [Unit: ${result.detectedUnit}] into ${result.chunksCount} chunks`,
      ...result,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process upload' },
      { status: 500 },
    );
  }
}
