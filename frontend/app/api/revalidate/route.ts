import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

const EXPECTED_SECRET =
  process.env.REVALIDATION_SECRET || 'eduguide_revalidation_secure_secret_2026';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-revalidate-secret');
    const { searchParams } = new URL(req.url);
    const secretParam = searchParams.get('secret');

    if (authHeader !== EXPECTED_SECRET && secretParam !== EXPECTED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized revalidation request' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { tag, path } = body;

    if (!tag && !path) {
      return NextResponse.json(
        { error: 'Please specify "tag" or "path" in request payload' },
        { status: 400 }
      );
    }

    if (tag) {
      if (Array.isArray(tag)) {
        tag.forEach((t) => revalidateTag(t));
      } else {
        revalidateTag(tag);
      }
    }

    if (path) {
      if (Array.isArray(path)) {
        path.forEach((p) => revalidatePath(p));
      } else {
        revalidatePath(path);
      }
    }

    return NextResponse.json({
      revalidated: true,
      tag: tag || null,
      path: path || null,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Revalidation failure' },
      { status: 500 }
    );
  }
}
