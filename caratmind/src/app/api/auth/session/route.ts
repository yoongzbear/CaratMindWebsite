import { NextResponse } from 'next/server';
import {
  getUserProfile,
  mapCognitoError,
  refreshTokens,
} from '@/lib/cognito/server';
import { readAuthCookies, setAuthCookies } from '@/lib/auth/cookies';
import { buildSessionPayload } from '@/lib/auth/session-response';

export async function GET() {
  try {
    const { refreshToken, username } = await readAuthCookies();

    if (!refreshToken || !username) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const tokens = await refreshTokens(username, refreshToken);
    const profile = await getUserProfile(tokens.accessToken);
    await setAuthCookies(tokens.refreshToken, profile.username);

    return NextResponse.json(buildSessionPayload(tokens, profile));
  } catch (error) {
    return NextResponse.json(
      { error: mapCognitoError(error), user: null },
      { status: 401 },
    );
  }
}
