import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/utils/auth/cookies';
import { buildSessionPayload } from '@/utils/auth/session-response';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      password?: string;
    };

    const identifier = body.identifier?.trim();
    const password = body.password;

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Username/email and password are required.' },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${process.env.DJANGO_API_BASE_URL}/api/accounts/login/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        cache: 'no-store',
      },
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: data.error ?? 'Login failed.',
          needsConfirmation: data.needsConfirmation,
          username: data.username,
          sub: data.sub,
          email: data.email,
          preferredUsername: data.preferredUsername,
        },
        { status: res.status },
      );
    }

    const { tokens, profile } = data;

    await setAuthCookies(tokens.refresh_token, profile.username);

    // return NextResponse.json(buildSessionPayload(tokens, profile));
    return NextResponse.json(
      buildSessionPayload(
        {
          accessToken: tokens.access_token,
          idToken: tokens.id_token,
          refreshToken: tokens.refresh_token,
          expiresIn: tokens.expires_in,
        },
        {
          username: profile.username,
          email: profile.email,
          preferredUsername: profile.preferred_username,
          onboarding: profile.onboarding,
        },
      ),
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
