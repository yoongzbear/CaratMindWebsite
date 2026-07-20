import { StatusKey } from '@/types/journal';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { entry, status } = (await request.json()) as {
      entry?: string;
      status?: StatusKey;
      //   status?: 'draft' | 'submitted';
    };

    if (!entry?.trim()) {
      return NextResponse.json(
        { error: 'Entry cannot be empty.' },
        { status: 400 },
      );
    }
    if (status !== 'draft' && status !== 'submitted') {
      return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    }

    const authHeader = request.headers.get('authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const baseUrl = process.env.DJANGO_API_BASE_URL;
    const res = await fetch(`${baseUrl}/api/journal/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ entry, status }),
      cache: 'no-store',
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error ?? 'Failed to save entry.' },
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
