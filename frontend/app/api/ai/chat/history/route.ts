import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionToken = searchParams.get('sessionToken') || '';

    if (!sessionToken) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const res = await fetch(`${BACKEND_URL}/api/ai/chat/history?sessionToken=${encodeURIComponent(sessionToken)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ success: true, messages: [] });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('[/api/ai/chat/history proxy] Error:', err.message || err);
    return NextResponse.json({ success: true, messages: [] });
  }
}
