import { NextResponse } from 'next/server';

export async function PATCH(request: Request) {
  try {
    const { preferredUsername } = (await request.json()) as {
      preferredUsername?: string;
    };

    if (!preferredUsername?.trim()) {
      return NextResponse.json(
        { error: 'Preferred username is required.' },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const baseUrl = process.env.DJANGO_API_BASE_URL;
    const res = await fetch(`${baseUrl}/api/accounts/update-name/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ preferredUsername: preferredUsername.trim() }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Update failed.' },
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
