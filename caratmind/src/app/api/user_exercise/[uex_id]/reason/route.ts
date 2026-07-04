import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ uex_id: string }> },
) {
  try {
    const { uex_id } = await params;

    const { reason } = (await request.json()) as {
      reason?: string;
    };

    if (!reason || reason === '') {
      return NextResponse.json(
        { error: 'Incompletion reason cannot be empty.' },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const baseUrl = process.env.DJANGO_API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/user_exercise/${uex_id}/reason/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason,
      }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Failed to save incompletion rating.' },
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
