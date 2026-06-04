import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getOAuthAuthorizeUrl } from '@/lib/cognito/server';
import { cookieOptions, OAUTH_STATE_COOKIE } from '@/lib/auth/cookies';
import { randomBytes } from 'crypto';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provider = searchParams.get('provider');
  const next = searchParams.get('next') ?? '/home';

  if (provider !== 'Google') {
    return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
  }

  const state = randomBytes(24).toString('hex');
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, `${state}|${next}`, {
    ...cookieOptions,
    maxAge: 600,
  });

  const authorizeUrl = getOAuthAuthorizeUrl(provider);
  const url = new URL(authorizeUrl);
  url.searchParams.set('state', state);

  return NextResponse.redirect(url.toString());
}
