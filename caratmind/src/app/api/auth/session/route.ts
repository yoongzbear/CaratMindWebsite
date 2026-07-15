import { NextResponse } from 'next/server';
// import {
//   getUserProfile,
//   mapCognitoError,
//   refreshTokens,
// } from '@/lib/cognito/server';
import { readAuthCookies, setAuthCookies } from '@/lib/auth/cookies';
import { buildSessionPayload } from '@/lib/auth/session-response';
import { refreshAccessToken } from '@/lib/auth/refresh';

export async function GET() {
  try {
    const { refreshToken, username } = await readAuthCookies();

    if (!refreshToken || !username) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // const refreshRes = await fetch(
    //   `${process.env.DJANGO_API_BASE_URL}/api/accounts/refresh/`,
    //   {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ username, refreshToken }),
    //     cache: 'no-store',
    //   },
    // );

    const tokens = await refreshAccessToken(username, refreshToken);

    // if (!refreshRes.ok) {
    //   throw new Error('Failed to refresh tokens');
    // }

    // const { tokens } = await refreshRes.json();

    // fetch profile from db
    const baseUrl = process.env.DJANGO_API_BASE_URL;
    const meRes = await fetch(`${baseUrl}/api/me/`, {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
      cache: 'no-store',
    });

    if (!meRes.ok) {
      throw new Error('Failed to load user profile');
    }

    const meData = await meRes.json();

    await setAuthCookies(tokens.refresh_token, username);

    return NextResponse.json({
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
      user: {
        username: meData.user.username,
        email: meData.user.email,
        preferredUsername: meData.user.preferredUsername,
        completedOnboarding: meData.user.completedOnboarding,
      },
    });
  } catch (error) {
    const res = NextResponse.json({ user: null }, { status: 401 });
    res.cookies.set('cm_access_token', '', { maxAge: 0 });
    res.cookies.set('cm_refresh_token', '', { maxAge: 0 });
    return res;
  }
}

// export async function GET() {
//   try {
//     const { refreshToken, username } = await readAuthCookies();

//     if (!refreshToken || !username) {
//       return NextResponse.json({ user: null }, { status: 401 });
//     }

//     const tokens = await refreshTokens(username, refreshToken);

//     const baseUrl = process.env.DJANGO_API_BASE_URL;
//     const meRes = await fetch(`${baseUrl}/api/me/`, {
//       headers: { Authorization: `Bearer ${tokens.accessToken}` },
//       cache: 'no-store',
//     });

//     if (!meRes.ok) {
//       throw new Error('Failed to load user profile');
//     }

//     const meData = await meRes.json();
//     await setAuthCookies(tokens.refreshToken, meData.user.username);

//     return NextResponse.json({
//       accessToken: tokens.accessToken,
//       expiresIn: tokens.expiresIn,
//       user: {
//         username: meData.user.username,
//         email: meData.user.email,
//         preferredUsername: meData.user.preferredUsername,
//       },
//     });
//   } catch (error) {
//     const res = NextResponse.json({ user: null }, { status: 401 });
//     res.cookies.set('cm_access_token', '', { maxAge: 0 });
//     res.cookies.set('cm_refresh_token', '', { maxAge: 0 });
//     return res;
//   }
// }
