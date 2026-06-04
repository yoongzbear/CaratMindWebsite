import { NextResponse } from 'next/server';
import {
  getUserProfile,
  mapCognitoError,
  signInWithPassword,
} from '@/lib/cognito/server';
import { setAuthCookies } from '@/lib/auth/cookies';
import { buildSessionPayload } from '@/lib/auth/session-response';

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

    const tokens = await signInWithPassword(identifier, password);
    const profile = await getUserProfile(tokens.accessToken);
    await setAuthCookies(tokens.refreshToken, profile.username);

    return NextResponse.json(buildSessionPayload(tokens, profile));
  } catch (error) {
    return NextResponse.json(
      { error: mapCognitoError(error) },
      { status: 401 },
    );
  }
}
