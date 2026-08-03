import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { listAllDocuments, deleteDocumentPoints } from '@/lib/qdrant';

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rawPoints = await listAllDocuments(300);
    
    // Process and format documents for admin viewing
    const documents = rawPoints.map((point: any) => ({
      id: point.id,
      university: point.payload?.university || 'Unknown',
      unit: point.payload?.unit || 'All Units',
      year: point.payload?.year || 'N/A',
      type: point.payload?.type || 'circular',
      originalFileName: point.payload?.originalFileName || point.payload?.source || 'Unknown File',
      filePath: point.payload?.filePath || '',
      page: point.payload?.page ?? 1,
      snippet: typeof point.payload?.text === 'string' ? point.payload.text.slice(0, 150) + '...' : '',
      fullTextLength: typeof point.payload?.text === 'string' ? point.payload.text.length : 0,
    }));

    return NextResponse.json({ documents });
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
    const { pointIds, fileName } = await req.json();

    let idsToDelete: string[] = [];

    if (Array.isArray(pointIds) && pointIds.length > 0) {
      idsToDelete = pointIds;
    } else if (fileName) {
      // Find all points matching fileName
      const rawPoints = await listAllDocuments(500);
      idsToDelete = rawPoints
        .filter((p: any) => (p.payload?.originalFileName === fileName || p.payload?.source === fileName))
        .map((p: any) => String(p.id));
    }

    if (idsToDelete.length === 0) {
      return NextResponse.json({ error: 'No matching document points found to delete' }, { status: 400 });
    }

    const result = await deleteDocumentPoints(idsToDelete);

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} document chunk(s)`,
      deletedCount: result.count,
    });
  } catch (err: any) {
    console.error('Admin documents DELETE error:', err);
    return NextResponse.json({ error: err.message || 'Failed to delete document' }, { status: 500 });
  }
}
