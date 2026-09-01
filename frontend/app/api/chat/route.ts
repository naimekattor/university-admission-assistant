import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function GET(req: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/ai/query`, {
      headers: {
        'x-session-id': req.headers.get('x-session-id') || '',
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ messages: [] });
  }
}

export async function DELETE() {
  return NextResponse.json({ success: true, message: 'Chat history cleared' });
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1] : null;
    const userQuery = lastMessage?.content || '';

    const res = await fetch(`${BACKEND_URL}/api/ai/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': req.headers.get('x-session-id') || '',
      },
      body: JSON.stringify({
        roleType: 'advisor',
        userQuery,
      }),
    });

    if (!res.ok) {
      throw new Error(`Backend response error: ${res.status}`);
    }

    const data = await res.json();
    const textResponse = data.data?.summary || (data.data?.sections ? data.data.sections.map((s: any) => `### ${s.heading}\n${s.content}`).join('\n\n') : 'Hello! I am your AI admission counselor.');

    return new Response(textResponse, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: any) {
    console.error('[/api/chat proxy error]', error);
    return new Response(
      'AI Assistant is ready. Connect the backend server on port 4000 (`pnpm dev:backend`) for live AI generation.',
      { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  }
}
