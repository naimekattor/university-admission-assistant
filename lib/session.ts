import { db, sessions } from '@/lib/db';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE_NAME = 'admission_session_id';
const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function getOrCreateSession(userAgent?: string, ipAddress?: string) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (sessionToken) {
    // Check if session exists and is still valid
    const existingSession = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionToken, sessionToken))
      .limit(1);

    if (existingSession.length > 0) {
      // Update last active time
      await db
        .update(sessions)
        .set({ lastActiveAt: new Date() })
        .where(eq(sessions.sessionToken, sessionToken));

      return existingSession[0];
    }
  }

  // Create new session
  const newSessionToken = uuidv4();
  const newSession = await db
    .insert(sessions)
    .values({
      sessionToken: newSessionToken,
      userAgent: userAgent || '',
      ipAddress: ipAddress || '',
    })
    .returning();

  // Set cookie
  cookieStore.set(SESSION_COOKIE_NAME, newSessionToken, {
    maxAge: SESSION_COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return newSession[0];
}

export async function getSessionById(sessionId: string) {
  const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  return session[0] || null;
}

export async function getCurrentSessionFromCookie() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const session = await db
    .select()
    .from(sessions)
    .where(eq(sessions.sessionToken, sessionToken))
    .limit(1);

  return session[0] || null;
}
