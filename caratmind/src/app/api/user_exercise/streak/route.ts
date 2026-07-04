import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const baseUrl = process.env.DJANGO_API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/user_exercise/streak/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    let data: any;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = { error: 'Unexpected response from server.' };
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Failed to load streak.' },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Something went wrong.' },
      { status: 500 },
    );
  }
}
