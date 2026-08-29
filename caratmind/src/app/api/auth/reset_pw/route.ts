import { NextResponse } from 'next/server';
import { setAuthCookies } from '@/utils/auth/cookies';
import { buildSessionPayload } from '@/utils/auth/session-response';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      username?: string;
      confirmationCode?: string;
      newPassword?: string;
      confirmPassword?: string;
    };

    // const identifier = body.username?.trim();
    // const password = body.password;

    const { username, confirmationCode, newPassword, confirmPassword } =
      body ?? {};

    if (!username || !confirmationCode || !newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          error:
            'Username/email, confirmation code, new password and confirmed password are required.',
        },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${process.env.DJANGO_API_BASE_URL}/api/accounts/reset-password/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          confirmationCode,
          newPassword,
          confirmPassword,
        }),
        cache: 'no-store',
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to reset password.' },
      { status: 500 },
    );
  }
}
