import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { exchangeAuthorizationCode } from '@/lib/cognito/server';
import { getCognitoConfig } from '@/lib/cognito/config';
import {
  cookieOptions,
  OAUTH_STATE_COOKIE,
  setAuthCookies,
} from '@/lib/auth/cookies';

export async function GET(request: Request) {
  const { appUrl } = getCognitoConfig();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');

  const store = await cookies();
  const storedState = store.get(OAUTH_STATE_COOKIE)?.value;
  store.delete(OAUTH_STATE_COOKIE);

  const fallback = `${appUrl}/login?error=oauth_failed`;

  if (error || !code) {
    return NextResponse.redirect(fallback);
  }

  if (!state || !storedState) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_state`);
  }

  const [expectedState, nextPath] = storedState.split('|');
  if (state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_state`);
  }

  try {
    const result = await exchangeAuthorizationCode(code);
    const username = result.username ?? 'oauth-user';
    await setAuthCookies(result.refreshToken, username);

    const redirectTo =
      nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//')
        ? nextPath
        : '/home';

    return NextResponse.redirect(`${appUrl}${redirectTo}`);
  } catch {
    return NextResponse.redirect(fallback);
  }
}
