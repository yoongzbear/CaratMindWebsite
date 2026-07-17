import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jrnl_id: string }> },
) {
  try {
    const { jrnl_id } = await params;

    const { correctMood } = (await request.json()) as {
      correctMood?: string;
    };

    if (!correctMood || correctMood === '') {
      return NextResponse.json(
        { error: 'Corrected mood cannot be empty.' },
        { status: 400 },
      );
    }

    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const baseUrl = process.env.DJANGO_API_BASE_URL;

    const res = await fetch(`${baseUrl}/api/mood/${jrnl_id}/corrected/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        corrected_mood: correctMood,
      }),
      cache: 'no-store',
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Failed to save corrected mood.' },
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
