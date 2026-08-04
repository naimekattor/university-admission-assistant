import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { listAllDocuments, deleteDocumentPoints } from '@/lib/qdrant';
import { db } from '@/lib/db';
import { documents } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Try fetching stored document records from PostgreSQL first
    const pgDocs = await db.select().from(documents).orderBy(desc(documents.createdAt));

    if (pgDocs.length > 0) {
      const formattedDocs = pgDocs.map((doc) => ({
        id: doc.id,
        university: doc.university || 'Unknown',
        unit: doc.unit || 'All Units',
        year: doc.year || 'N/A',
        type: doc.documentType || 'circular',
        originalFileName: doc.originalFileName,
        filePath: doc.filePath || '',
        chunkCount: doc.chunkCount || 0,
        createdAt: doc.createdAt,
      }));
      return NextResponse.json({ documents: formattedDocs });
    }

    // 2. Fallback to Qdrant: Group vector points by originalFileName so each document shows as 1 full file
    const rawPoints = await listAllDocuments(500);
    const groupedMap = new Map<string, any>();

    for (const point of rawPoints) {
      const fileName = String(point.payload?.originalFileName || point.payload?.source || 'Unknown File');
      if (!groupedMap.has(fileName)) {
        groupedMap.set(fileName, {
          id: String(point.id),
          university: String(point.payload?.university || 'Unknown'),
          unit: String(point.payload?.unit || 'All Units'),
          year: String(point.payload?.year || 'N/A'),
          type: String(point.payload?.type || 'circular'),
          originalFileName: fileName,
          filePath: String(point.payload?.filePath || ''),
          chunkCount: 1,
          snippet: typeof point.payload?.text === 'string' ? point.payload.text.slice(0, 150) + '...' : '',
        });
      } else {
        const existing = groupedMap.get(fileName);
        existing.chunkCount += 1;
      }
    }

    return NextResponse.json({ documents: Array.from(groupedMap.values()) });
  } catch (err: any) {
    console.error('Admin documents GET error:', err);
    return NextResponse.json({ error: err.message || 'Failed to list documents' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { docId, fileName, filePath } = await req.json();

    if (!fileName && !docId) {
      return NextResponse.json({ error: 'Missing fileName or docId for deletion' }, { status: 400 });
    }

    let deletedChunkCount = 0;

    // 1. Delete ALL matching vector points from Qdrant by fileName or docId
    const rawPoints = await listAllDocuments(1000);
    const idsToDelete = rawPoints
      .filter((p: any) => {
        const pFileName = p.payload?.originalFileName || p.payload?.source;
        const pDocId = p.payload?.docId;
        return (fileName && pFileName === fileName) || (docId && (pDocId === docId || String(p.id) === docId));
      })
      .map((p: any) => String(p.id));

    if (idsToDelete.length > 0) {
      const qdrantResult = await deleteDocumentPoints(idsToDelete);
      deletedChunkCount = qdrantResult.count;
    }

    // 2. Delete document record(s) from PostgreSQL database
    try {
      if (docId) {
        await db.delete(documents).where(eq(documents.id, docId));
      }
      if (fileName) {
        await db.delete(documents).where(eq(documents.originalFileName, fileName));
      }
    } catch (dbErr) {
      console.warn('Postgres document deletion note:', dbErr);
    }

    // 3. Delete physical file from server disk
    const filePathsToTry = [
      filePath,
      fileName ? `uploads/circulars/${fileName}` : null,
      fileName ? `uploads/${fileName}` : null,
    ].filter(Boolean) as string[];

    for (const relPath of filePathsToTry) {
      try {
        const cleanPath = relPath.startsWith('/') ? relPath.slice(1) : relPath;
        const fullPath = join(process.cwd(), 'public', cleanPath);
        await unlink(fullPath);
        console.log(`Deleted physical file from disk: ${fullPath}`);
        break;
      } catch {
        // Continue trying alternative path locations
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted document "${fileName || docId}" from PostgreSQL, Qdrant (${deletedChunkCount} chunks), and file storage.`,
      deletedCount: deletedChunkCount,
    });
  } catch (err: any) {
    console.error('Admin documents DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete document' }, { status: 500 });
  }
}
