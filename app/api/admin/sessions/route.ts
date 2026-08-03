import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { db, sessions, chatMessages, activityLogs } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const sessionIdParam = searchParams.get('sessionId');

    // If specific sessionId requested, return detailed transcript messages
    if (sessionIdParam) {
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.sessionId, sessionIdParam))
        .orderBy(chatMessages.createdAt);

      return NextResponse.json({ messages });
    }

    // Otherwise, fetch session list with message counts & token estimates
    const allSessions = await db
      .select()
      .from(sessions)
      .orderBy(desc(sessions.lastActiveAt))
      .limit(50);

    const result = await Promise.all(
      allSessions.map(async (sess) => {
        const msgs = await db
          .select({
            role: chatMessages.role,
            content: chatMessages.content,
          })
          .from(chatMessages)
          .where(eq(chatMessages.sessionId, sess.id));

        let promptChars = 0;
        let completionChars = 0;

        for (const m of msgs) {
          if (m.role === 'user') {
            promptChars += (m.content || '').length;
          } else {
            completionChars += (m.content || '').length;
          }
        }

        const estPromptTokens = Math.ceil(promptChars / 4);
        const estCompletionTokens = Math.ceil(completionChars / 4);

        return {
          id: sess.id,
          sessionToken: sess.sessionToken,
          createdAt: sess.createdAt,
          lastActiveAt: sess.lastActiveAt,
          userAgent: sess.userAgent || 'Unknown Browser',
          ipAddress: sess.ipAddress || 'Unknown IP',
          messageCount: msgs.length,
          tokens: {
            promptTokens: estPromptTokens,
            completionTokens: estCompletionTokens,
            totalTokens: estPromptTokens + estCompletionTokens,
          },
        };
      })
    );

    return NextResponse.json({ sessions: result });
  } catch (err: any) {
    console.error('Admin sessions GET error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch sessions' }, { status: 500 });
  }
}
