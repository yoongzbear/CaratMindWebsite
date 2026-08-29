import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      //   password?: string;
    };

    const identifier = body.identifier?.trim();
    // const password = body.password;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Username or email are required.' },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${process.env.DJANGO_API_BASE_URL}/api/accounts/forgot-password/`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
        cache: 'no-store',
      },
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to request code for reset password.' },
      { status: 500 },
    );
  }
}
