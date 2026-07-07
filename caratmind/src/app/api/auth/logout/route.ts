import { NextResponse } from 'next/server';
// import { globalSignOut } from '@/lib/cognito/server';
import { clearAuthCookies } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      accessToken?: string;
    };

    if (body.accessToken) {
      try {
        await fetch(`${process.env.DJANGO_API_BASE_URL}/api/accounts/logout/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: body.accessToken }),
          cache: 'no-store',
        });
      } catch {}
    }

    // if (body.accessToken) {
    //   try {
    //     await globalSignOut(body.accessToken);
    //   } catch {
    //     // Cookie/session cleanup still proceeds if Cognito revoke fails.
    //   }
    // }

    await clearAuthCookies();
    return NextResponse.json({ ok: true });
  } catch {
    await clearAuthCookies();
    return NextResponse.json({ ok: true });
  }
}
