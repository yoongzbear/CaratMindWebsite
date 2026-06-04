import { NextResponse } from 'next/server';
import { globalSignOut } from '@/lib/cognito/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      accessToken?: string;
    };

    if (body.accessToken) {
      try {
        await globalSignOut(body.accessToken);
      } catch {
        // Cookie/session cleanup still proceeds if Cognito revoke fails.
      }
    }

    await clearAuthCookies();
    return NextResponse.json({ ok: true });
  } catch {
    await clearAuthCookies();
    return NextResponse.json({ ok: true });
  }
}
