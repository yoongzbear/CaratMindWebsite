import { cookies } from 'next/headers';

export const REFRESH_COOKIE = 'cm_refresh_token';
export const USERNAME_COOKIE = 'cm_username';
// export const OAUTH_STATE_COOKIE = 'cm_oauth_state';

const isProd = process.env.NODE_ENV === 'production';

export const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

export async function setAuthCookies(
  refreshToken: string,
  username: string,
  maxAgeSeconds = 60 * 60 * 24 * 30,
) {
  const store = await cookies();
  store.set(REFRESH_COOKIE, refreshToken, {
    ...cookieOptions,
    maxAge: maxAgeSeconds,
  });
  store.set(USERNAME_COOKIE, username, {
    ...cookieOptions,
    maxAge: maxAgeSeconds,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(REFRESH_COOKIE);
  store.delete(USERNAME_COOKIE);
  // store.delete(OAUTH_STATE_COOKIE);
}

export async function readAuthCookies() {
  const store = await cookies();
  return {
    refreshToken: store.get(REFRESH_COOKIE)?.value,
    username: store.get(USERNAME_COOKIE)?.value,
  };
}
