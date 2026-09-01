import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/users`);
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ sessions: data.data || [] });
    }
  } catch (err) {}

  return NextResponse.json({
    sessions: [
      { id: 'usr-1', name: 'Tanvir Hossain', group: 'Science', sscGpa: 5.0, hscGpa: 5.0, target: 'BUET CSE', passingYear: 2024, lastActive: '10 mins ago', status: 'Active' },
      { id: 'usr-2', name: 'Nusrat Jahan', group: 'Science', sscGpa: 5.0, hscGpa: 4.92, target: 'DU Ka Unit', passingYear: 2024, lastActive: '45 mins ago', status: 'Active' },
    ],
  });
}
