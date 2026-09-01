import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { roleType = 'advisor', userQuery, studentContext } = body;

    if (!userQuery || typeof userQuery !== 'string') {
      return NextResponse.json(
        { error: 'userQuery is required and must be a string' },
        { status: 400 }
      );
    }

    const res = await fetch(`${BACKEND_URL}/api/ai/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': req.headers.get('x-session-id') || '',
      },
      body: JSON.stringify({ roleType, userQuery, studentContext }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[/api/ai/query proxy] Error connecting to backend:', error.message || error);
    return NextResponse.json(
      {
        success: true,
        data: {
          type: 'general_answer',
          summary: 'Connect to EduGuide backend at http://localhost:4000 to enable real-time AI responses.',
          sections: [
            {
              heading: 'Notice',
              content: 'The backend service is initializing or operating in standalone mode. You can check eligibility, browse universities, or start your backend with `pnpm dev:backend`.',
            },
          ],
          recommendedNextActions: [
            { label: 'Check Eligibility', action: 'check_eligibility' },
            { label: 'Explore Universities', action: 'explore_universities' },
          ],
        },
      },
      { status: 200 }
    );
  }
}
