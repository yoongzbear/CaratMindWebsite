import { readAuthCookies } from '@/utils/auth/cookies';
import { refreshAccessToken } from '@/utils/auth/refresh';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { page: string } },
) {
  const { refreshToken, username } = await readAuthCookies();
  if (!refreshToken || !username)
    return NextResponse.json({ ok: false }, { status: 401 });

  const tokens = await refreshAccessToken(username, refreshToken);

  const res = await fetch(
    `${process.env.DJANGO_API_BASE_URL}/api/accounts/onboarding/${params.page}/complete/`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    },
  );

  return NextResponse.json({ ok: res.ok }, { status: res.ok ? 200 : 500 });
}
