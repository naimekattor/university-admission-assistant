import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { db, sessions, chatMessages, activityLogs } from '@/lib/db';
import { listAllDocuments } from '@/lib/qdrant';
import { count, gte, sql } from 'drizzle-orm';

export async function GET() {
  const auth = await isAdminAuthenticated();
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Total Sessions
    const [sessionsCountResult] = await db.select({ val: count() }).from(sessions);
    const totalSessions = sessionsCountResult?.val || 0;

    // 2. Active Sessions in last 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [activeSessionsResult] = await db
      .select({ val: count() })
      .from(sessions)
      .where(gte(sessions.lastActiveAt, twentyFourHoursAgo));
    const activeSessions24h = activeSessionsResult?.val || 0;

    // 3. Total Chat Messages
    const [messagesCountResult] = await db.select({ val: count() }).from(chatMessages);
    const totalMessages = messagesCountResult?.val || 0;

    // 4. Token Estimation from chat message contents
    const allMessages = await db
      .select({
        role: chatMessages.role,
        content: chatMessages.content,
      })
      .from(chatMessages);

    let totalPromptChars = 0;
    let totalCompletionChars = 0;
    let userMsgCount = 0;
    let assistantMsgCount = 0;

    for (const msg of allMessages) {
      if (msg.role === 'user') {
        totalPromptChars += (msg.content || '').length;
        userMsgCount++;
      } else {
        totalCompletionChars += (msg.content || '').length;
        assistantMsgCount++;
      }
    }

    // Estimate ~4 characters per LLM token
    const estimatedPromptTokens = Math.ceil(totalPromptChars / 4);
    const estimatedCompletionTokens = Math.ceil(totalCompletionChars / 4);
    const estimatedTotalTokens = estimatedPromptTokens + estimatedCompletionTokens;

    // 5. Activity logs breakdown
    const activityCounts = await db
      .select({
        action: activityLogs.action,
        count: count(),
      })
      .from(activityLogs)
      .groupBy(activityLogs.action);

    // 6. Indexed documents count from Qdrant
    const documents = await listAllDocuments(500);
    const totalIndexedChunks = documents.length;

    // Group unique uploaded files from payload
    const uniqueFiles = new Set(
      documents
        .map((doc: any) => doc.payload?.originalFileName || doc.payload?.source)
        .filter(Boolean)
    );
    const totalIndexedFiles = uniqueFiles.size;

    return NextResponse.json({
      stats: {
        totalSessions,
        activeSessions24h,
        totalMessages,
        userMsgCount,
        assistantMsgCount,
        tokenUsage: {
          estimatedPromptTokens,
          estimatedCompletionTokens,
          estimatedTotalTokens,
          totalPromptChars,
          totalCompletionChars,
        },
        knowledgeBase: {
          totalIndexedChunks,
          totalIndexedFiles,
        },
        activities: activityCounts,
      },
    });
  } catch (err: any) {
    console.error('Admin stats API error:', err);
    return NextResponse.json({ error: err.message || 'Failed to fetch admin stats' }, { status: 500 });
  }
}
