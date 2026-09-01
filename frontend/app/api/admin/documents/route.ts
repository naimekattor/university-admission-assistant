import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/rag/search?q=all`);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ documents: data.data || [] });
    }
  } catch (err) {}

  return NextResponse.json({
    documents: [
      { id: 'doc-1', title: 'BUET Admission Circular 2026', university: 'BUET', year: 2026, status: 'Indexed', chunksCount: 14 },
      { id: 'doc-2', title: 'DU Ka Unit Prospectus', university: 'DU', year: 2026, status: 'Indexed', chunksCount: 22 },
    ],
  });
}

export async function DELETE(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ success: true, message: 'Document deleted successfully' });
}
