import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'uaa-admin-secret-key-2026';

export const ADMIN_COOKIE_NAME = 'admin_auth_token';

// Generate token using HMAC sha256
export function generateAdminToken(username: string): string {
  const payload = `${username}:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(payload)
    .digest('hex');
  return Buffer.from(`${payload}:${signature}`).toString('base64');
}

// Verify token
export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 3) return false;

    const [username, timestampStr, signature] = parts;
    if (username !== ADMIN_USERNAME) return false;

    const timestamp = parseInt(timestampStr, 10);
    // Token valid for 7 days
    if (isNaN(timestamp) || Date.now() - timestamp > 7 * 24 * 60 * 60 * 1000) {
      return false;
    }

    const expectedSignature = crypto
      .createHmac('sha256', ADMIN_SECRET)
      .update(`${username}:${timestampStr}`)
      .digest('hex');

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

// Validate credentials
export function validateAdminCredentials(u: string, p: string): boolean {
  return u === ADMIN_USERNAME && p === ADMIN_PASSWORD;
}

// Check admin auth from Next request cookies
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}
