import { setAuthCookies } from './cookies';

export async function refreshAccessToken(
  username: string,
  refreshToken: string,
) {
  const refreshRes = await fetch(
    `${process.env.DJANGO_API_BASE_URL}/api/accounts/refresh/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, refreshToken }),
      cache: 'no-store',
    },
  );

  if (!refreshRes.ok) {
    throw new Error('Failed to refresh tokens');
  }

  const { tokens } = await refreshRes.json();
  await setAuthCookies(tokens.refresh_token, username);
  return tokens; // access_token, refresh_token, expires_in
}
