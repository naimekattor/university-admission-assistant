import { db, sessions } from '@/lib/db';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

const SESSION_COOKIE_NAME = 'admission_session_id';
const SESSION_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

export async function getOrCreateSession(userAgent?: string, ipAddress?: string) {
  try {
    const cookieStore = await cookies();
    let sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (sessionToken) {
      try {
        const existingSession = await db
          .select()
          .from(sessions)
          .where(eq(sessions.sessionToken, sessionToken))
          .limit(1);

        if (existingSession.length > 0) {
          await db
            .update(sessions)
            .set({ lastActiveAt: new Date() })
            .where(eq(sessions.sessionToken, sessionToken))
            .catch(() => {});

          return existingSession[0];
        }
      } catch (err) {
        console.warn('Database session query fallback:', err);
      }
    }

    if (!sessionToken) {
      sessionToken = uuidv4();
    }

    let createdSession = null;
    try {
      const inserted = await db
        .insert(sessions)
        .values({
          sessionToken,
          userAgent: userAgent || '',
          ipAddress: ipAddress || '',
        })
        .returning();
      createdSession = inserted[0];
    } catch (err) {
      console.warn('Database session creation fallback:', err);
    }

    try {
      cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
        maxAge: SESSION_COOKIE_MAX_AGE,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    } catch {
      // Ignore cookie set warning if response already started
    }

    return (
      createdSession || {
        id: uuidv4(),
        sessionToken,
        createdAt: new Date(),
        lastActiveAt: new Date(),
        userAgent: userAgent || '',
        ipAddress: ipAddress || '',
      }
    );
  } catch (error) {
    console.error('Session error, fallback session created:', error);
    const fallbackToken = uuidv4();
    return {
      id: fallbackToken,
      sessionToken: fallbackToken,
      createdAt: new Date(),
      lastActiveAt: new Date(),
      userAgent: userAgent || '',
      ipAddress: ipAddress || '',
    };
  }
}

export async function getSessionById(sessionId: string) {
  try {
    const session = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
    return session[0] || null;
  } catch {
    return null;
  }
}

export async function getCurrentSessionFromCookie() {
  try {
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
  } catch {
    return null;
  }
}
